import app from './src/app.js';
import config from './src/config/env.js';
import Logger from './src/utils/logger.js';
import prisma from './src/config/database.js';

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    Logger.info('✅ Database connected successfully');
  } catch (error) {
    Logger.error('❌ Database connection failed', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    // Test database connection
    await testDatabaseConnection();

    // Start HTTP server
    const server = app.listen(config.port, '0.0.0.0', () => {
      Logger.info(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
      Logger.info(`📊 Health check available at http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      Logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        Logger.info('HTTP server closed');
        
        try {
          await prisma.$disconnect();
          Logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          Logger.error('Error during database disconnect', error);
          process.exit(1);
        }
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    Logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection at Promise', reason);
  process.exit(1);
});

// Start the server
startServer();

