const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB with retry logic
 */
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ Connected to MongoDB');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDatabase, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error.message);
    setTimeout(connectDatabase, 5000); // Retry after 5 seconds
    throw error;
  }
}

/**
 * Close MongoDB connection gracefully
 */
async function closeDatabase() {
  try {
    await mongoose.connection.close();
    logger.info('✅ MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
}

module.exports = {
  connectDatabase,
  closeDatabase,
};