import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import logger from './utils/logger.js';
import { connectRabbitMQ, consumeEmails } from './queue/rabbitmqConsumer.js';
import emailRoutes from './routes/emailRoutes.js';

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'email-microservice',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/emails', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize
async function start() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✓ Connected to MongoDB');

    // Connect to RabbitMQ and start consuming
    await connectRabbitMQ();
    await consumeEmails();
    logger.info('✓ Connected to RabbitMQ and started consuming messages');

    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`✓ Email service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

start();
