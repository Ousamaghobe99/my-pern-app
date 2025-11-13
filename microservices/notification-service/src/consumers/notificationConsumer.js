const { getChannel } = require('../config/rabbitmq');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');
const { sendToUser } = require('../config/socket');
/**
 * Process notification message based on type
 * @param {object} message - Notification message
 */
async function processNotification(message) {
  const { type, data, metadata } = message;

  logger.info(`📨 Processing notification: ${type}`, { 
    email: data.email,
    attemptNumber: metadata?.attemptNumber || 1 
  });

  let result;

  switch (type) {
    case 'USER_CREATED':
    case 'USER_REGISTERED':
      result = await emailService.sendWelcomeEmail(data);
      break;

    case 'FIRST_LOGIN':
      result = await emailService.sendFirstLoginEmail(data);
      break;

    case 'PASSWORD_CHANGED':
    case 'PASSWORD_RESET':
      result = await emailService.sendPasswordChangedEmail(data);
      break;

    default:
      logger.warn(`⚠️ Unknown notification type: ${type}`);
      throw new Error(`Unknown notification type: ${type}`);
  }

  // Save notification to database
  await notificationService.saveNotification({
    type,
    recipient: data.email,
    status: 'sent',
    messageId: result.messageId,
    sentAt: new Date(),
    metadata: {
      ...metadata,
      subject: result.subject,
    },
  });

  return result;
}

/**
 * Start consuming notifications from RabbitMQ
 */
async function startConsumer() {
  const channel = getChannel();
  const queue = process.env.RABBITMQ_QUEUE;

  logger.info(`🚀 Starting notification consumer on queue: ${queue}`);

  await channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;

      const startTime = Date.now();
      let message;

      try {
        // Parse message
        message = JSON.parse(msg.content.toString());
        
        logger.info('📬 Received notification', {
          type: message.type,
          email: message.data?.email,
          timestamp: new Date().toISOString(),
        });

        // Process the notification
        await processNotification(message);

        // Acknowledge message (remove from queue)
        channel.ack(msg);

        const duration = Date.now() - startTime;
        logger.info(`✅ Notification processed successfully in ${duration}ms`, {
          type: message.type,
          email: message.data?.email,
        });

      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`❌ Failed to process notification after ${duration}ms:`, {
          error: error.message,
          stack: error.stack,
          type: message?.type,
          email: message?.data?.email,
        });

        // Handle retry logic
        const attemptNumber = (message?.metadata?.attemptNumber || 0) + 1;
        const maxRetries = parseInt(process.env.MAX_RETRY_ATTEMPTS) || 3;

        if (attemptNumber < maxRetries) {
          // Retry: Reject and requeue
          logger.warn(`🔄 Retrying notification (attempt ${attemptNumber}/${maxRetries})`);
          
          // Add retry metadata
          message.metadata = {
            ...message.metadata,
            attemptNumber,
            lastError: error.message,
            lastAttemptAt: new Date().toISOString(),
          };

          // Requeue with delay (using delayed exchange or separate queue)
          setTimeout(() => {
            channel.sendToQueue(
              queue,
              Buffer.from(JSON.stringify(message)),
              { persistent: true }
            );
          }, parseInt(process.env.RETRY_DELAY_MS) || 5000);

          // Acknowledge original message
          channel.ack(msg);

        } else {
          // Max retries reached - send to dead letter queue
          logger.error(`💀 Max retries reached, sending to DLQ`, {
            type: message?.type,
            email: message?.data?.email,
            attempts: attemptNumber,
          });

          // Save failed notification to database
          if (message) {
            await notificationService.saveNotification({
              type: message.type,
              recipient: message.data?.email,
              status: 'failed',
              error: error.message,
              failedAt: new Date(),
              metadata: message.metadata,
            }).catch(err => logger.error('Failed to save error notification:', err));
          }

          // Reject without requeue (goes to DLQ via dead letter exchange)
          channel.nack(msg, false, false);
        }
      }
    },
    {
      noAck: false, // Manual acknowledgment
    }
  );

  logger.info('👂 Consumer is listening for notifications...');
}

/**
 * Stop consuming notifications
 */
async function stopConsumer() {
  const channel = getChannel();
  await channel.cancel('notification_consumer');
  logger.info('🛑 Consumer stopped');
}

module.exports = {
  startConsumer,
  stopConsumer,
};