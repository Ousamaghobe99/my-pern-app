import app from './src/app.js';
import config from './src/config/env.js';
import Logger from './src/utils/logger.js';
import prisma from './src/config/database.js';
import rabbitmqService from './src/services/rabbitmqService.js'; // Assuming this is the path

// ==========================
// Initialize services
// ==========================
async function initializeServices() {
 try {
  // --- CRITICAL SERVICE: DATABASE ---
  Logger.info('🚀 Connecting to database...');
  await prisma.$connect();
  Logger.info('✅ Database connected');

  // --- NON-CRITICAL SERVICE: RABBITMQ ---
  try {
   Logger.info('🚀 Connecting to RabbitMQ...');
   await rabbitmqService.connect();
   Logger.info('✅ RabbitMQ connected');
  } catch (rabbitError) {
   // FIX: Log the failure but DO NOT crash the application (process.exit).
   Logger.error('⚠️ Failed to connect to RabbitMQ (Non-critical). App starting without full queue support.', rabbitError);
  }

 } catch (error) {
  // Only exit if the critical Database connection failed.
  Logger.error('❌ CRITICAL Service initialization failed (Database or other error). Exiting.', error);
  process.exit(1);
 }
}

// ==========================
// Start server
// ==========================
async function startServer() {
 try {
  await initializeServices();

  const server = app.listen(config.port, '0.0.0.0', () => {
   Logger.info(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
   Logger.info(`📊 Health check: http://localhost:${config.port}/health`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
   Logger.info(`\n${signal} received, closing gracefully...`);
   try {
    // Close RabbitMQ only if it was connected
    if (rabbitmqService.isHealthy()) {
     await rabbitmqService.close();
     Logger.info('✓ RabbitMQ connection closed');
    }

    await prisma.$disconnect();
    Logger.info('✓ Database connection closed');

    server.close(() => {
     Logger.info('✓ HTTP server closed');
     process.exit(0);
    });
   } catch (error) {
    Logger.error('❌ Error during shutdown', error);
    process.exit(1);
   }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

 } catch (error) {
  Logger.error('❌ Failed to start server', error);
  process.exit(1);
 }
}

// ==========================
// Global exception handling
// ==========================
process.on('uncaughtException', (error) => {
 Logger.error('❌ Uncaught Exception', error);
 process.exit(1);
});

process.on('unhandledRejection', (reason) => {
 Logger.error('❌ Unhandled Rejection', reason);
 process.exit(1);
});

// ==========================
// Launch
// ==========================
startServer();