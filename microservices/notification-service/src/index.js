require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDatabase } = require('./config/database');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { connectRedis } = require('./config/redis');
const { initializeSocketIO } = require('./config/socket');
const { startConsumer } = require('./consumers/notificationConsumer');
const notificationRoutes = require('./routes/notificationRoutes.js');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const { startChangeStream } = require('./services/changeStreamService');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/notifications', notificationRoutes);

// Initialize services
async function startServer() {
  try {
    logger.info('🚀 Starting Notification Service...');
    
    // 1. Connect to MongoDB
    await connectDatabase();
    
    // 2. Connect to Redis (for Socket.IO adapter)
    await connectRedis();
    
    // 3. Connect to RabbitMQ
    await connectRabbitMQ();
   
    if (process.env.ENABLE_CHANGE_STREAMS === 'true') {
  startChangeStream();
}
    // 4. Initialize Socket.IO with Redis adapter
    const io = initializeSocketIO(server);
    app.set('io', io);
    
    // 5. Start consuming RabbitMQ messages
    await startConsumer();
    
    // 6. Start HTTP + WebSocket server
    const PORT = process.env.PORT || 3002;
    server.listen(PORT, () => {
      logger.info(`✅ Notification Service running on port ${PORT}`);
      logger.info(`📡 WebSocket server ready`);
      logger.info(`🗄️  MongoDB connected`);
      logger.info(`📮 RabbitMQ consumer active`);
      logger.info(`🔴 Redis adapter enabled`);
    });

  } catch (error) {
    logger.error('❌ Failed to start notification service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  logger.info('⚠️  Shutting down gracefully...');
  
  server.close(() => {
    logger.info('✅ HTTP server closed');
  });
  
  const { closeDatabase } = require('./config/database');
  const { closeRedis } = require('./config/redis');
  const { closeConnection } = require('./config/rabbitmq');
  
  await Promise.all([
    closeDatabase(),
    closeRedis(),
    closeConnection(),
  ]);
  
  logger.info('✅ All connections closed');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
startServer();
