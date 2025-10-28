import amqp from 'amqplib';
import Logger from '../utils/logger.js';

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      // Assert the email queue exists
      await this.channel.assertQueue(process.env.EMAIL_QUEUE || 'email_queue', {
        durable: true
      });
      
      this.isConnected = true;
      Logger.info('✓ RabbitMQ connected successfully');

      // Handle connection errors
      this.connection.on('error', (err) => {
        Logger.error('RabbitMQ connection error:', err);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        Logger.warn('RabbitMQ connection closed, will attempt reconnection...');
        this.isConnected = false;
      });

      return true;

    } catch (error) {
      Logger.error('Failed to connect to RabbitMQ:', error.message);
      this.isConnected = false;
      
      // Retry connection after 5 seconds
      Logger.info('Retrying RabbitMQ connection in 5 seconds...');
      setTimeout(() => this.connect(), 5000);
      
      throw error;
    }
  }

  async publishToQueue(queueName, data) {
    if (!this.isConnected || !this.channel) {
      Logger.warn('RabbitMQ not connected, attempting to reconnect...');
      await this.connect();
    }

    try {
      const message = Buffer.from(JSON.stringify(data));
      
      // Send to queue with persistence
      this.channel.sendToQueue(queueName, message, {
        persistent: true,
        contentType: 'application/json'
      });
      
      Logger.info(`✓ Message published to ${queueName}`);
      return true;

    } catch (error) {
      Logger.error('Error publishing to queue:', error.message);
      throw error;
    }
  }

  async publishEmail(emailData) {
    const queueName = process.env.EMAIL_QUEUE || 'email_queue';
    return await this.publishToQueue(queueName, emailData);
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.isConnected = false;
      Logger.info('✓ RabbitMQ connection closed');
    } catch (error) {
      Logger.error('Error closing RabbitMQ connection:', error);
    }
  }

  isHealthy() {
    return this.isConnected && this.channel && this.connection;
  }

  getStatus() {
    return {
      connected: this.isConnected,
      status: this.isConnected ? 'healthy' : 'disconnected'
    };
  }
}

// Create and export singleton instance
const rabbitmqService = new RabbitMQService();

export default rabbitmqService;