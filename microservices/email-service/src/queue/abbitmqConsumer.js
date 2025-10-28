import amqp from 'amqplib';
import logger from '../utils/logger.js';
import emailService from '../services/emailService.js';

let connection = null;
let channel = null;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert main queue
    await channel.assertQueue(process.env.EMAIL_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': process.env.EMAIL_DLQ
      }
    });

    // Assert dead letter queue
    await channel.assertQueue(process.env.EMAIL_DLQ, { durable: true });

    logger.info('✓ RabbitMQ connection established');

    // Handle connection errors
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed, reconnecting...');
      setTimeout(connectRabbitMQ, 5000);
    });

    return channel;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    setTimeout(connectRabbitMQ, 5000);
    throw error;
  }
}

export async function consumeEmails() {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  // Set prefetch to process one message at a time
  await channel.prefetch(1);

  channel.consume(process.env.EMAIL_QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const emailData = JSON.parse(msg.content.toString());
      logger.info(`Processing email to ${emailData.to}`);

      // Route to appropriate email handler based on type
      if (emailData.type === 'welcome-credentials') {
        await emailService.sendWelcomeWithCredentials(emailData);
      } else {
        await emailService.sendEmail(emailData);
      }

      // Acknowledge message
      channel.ack(msg);
      logger.info(`✓ Email processed successfully`);

    } catch (error) {
      logger.error('Error processing email:', error);

      // Reject and requeue with delay (will go to DLQ after max retries)
      const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) + 1;
      const maxRetries = parseInt(process.env.MAX_RETRIES);

      if (retryCount < maxRetries) {
        // Requeue with delay
        setTimeout(() => {
          channel.sendToQueue(
            process.env.EMAIL_QUEUE,
            msg.content,
            {
              headers: {
                'x-retry-count': retryCount
              },
              persistent: true
            }
          );
          channel.ack(msg);
        }, parseInt(process.env.RETRY_DELAY));
      } else {
        // Max retries exceeded, send to DLQ
        channel.nack(msg, false, false);
      }
    }
  });

  logger.info(`✓ Consuming messages from ${process.env.EMAIL_QUEUE}`);
}

export function getChannel() {
  return channel;
}