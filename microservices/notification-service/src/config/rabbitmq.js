const amqp = require('amqplib');
const logger = require('../utils/logger');

let connection = null;
let channel = null;

/**
 * Connect to RabbitMQ with retry logic
 * @returns {Promise<Channel>}
 */
async function connectRabbitMQ() {
  try {
    // Create connection with heartbeat to detect dead connections
    connection = await amqp.connect(process.env.RABBITMQ_URL, {
      heartbeat: 60,
    });

    logger.info('✅ Connected to RabbitMQ');

    // Handle connection errors
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      setTimeout(connectRabbitMQ, 5000); // Retry after 5 seconds
    });

    connection.on('close', () => {
      logger.warn('⚠️ RabbitMQ connection closed, reconnecting...');
      setTimeout(connectRabbitMQ, 5000);
    });

    // Create channel
    channel = await connection.createChannel();
    
    // Set prefetch count (QoS) - process N messages at a time
    await channel.prefetch(parseInt(process.env.RABBITMQ_PREFETCH) || 5);

    // Declare exchange (topic exchange for routing)
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, 'topic', {
      durable: true,
    });

    // Declare main queue
    await channel.assertQueue(process.env.RABBITMQ_QUEUE, {
      durable: true, // Survives broker restart
      deadLetterExchange: 'notifications_dlx', // Dead letter exchange for failed messages
    });

    // Declare dead letter queue for failed messages
    await channel.assertQueue('notifications_dlq', {
      durable: true,
    });

    await channel.assertExchange('notifications_dlx', 'topic', {
      durable: true,
    });

    // Bind queue to exchange with routing patterns
    await channel.bindQueue(
      process.env.RABBITMQ_QUEUE,
      process.env.RABBITMQ_EXCHANGE,
      'notification.*' // Matches notification.email, notification.sms, etc.
    );

    // Bind DLQ
    await channel.bindQueue(
      'notifications_dlq',
      'notifications_dlx',
      '#'
    );

    logger.info('✅ RabbitMQ channel and queues configured');

    return channel;
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error.message);
    setTimeout(connectRabbitMQ, 5000); // Retry connection
    throw error;
  }
}

/**
 * Get current channel instance
 * @returns {Channel}
 */
function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.');
  }
  return channel;
}

/**
 * Close RabbitMQ connection gracefully
 */
async function closeConnection() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info('✅ RabbitMQ connection closed gracefully');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection:', error);
  }
}

module.exports = {
  connectRabbitMQ,
  getChannel,
  closeConnection,
};