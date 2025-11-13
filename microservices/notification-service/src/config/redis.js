const redis = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

/**
 * Connect to Redis
 */
async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('❌ Redis max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 50, 500);
        }
      }
    });

    redisClient.on('error', (err) => {
      logger.error('❌ Redis error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('⚠️ Reconnecting to Redis...');
    });

    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error.message);
    throw error;
  }
}

/**
 * Get Redis client
 */
function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

/**
 * Close Redis connection
 */
async function closeRedis() {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('✅ Redis connection closed gracefully');
    }
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
}

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedis,
};