const socketIO = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const jwt = require('jsonwebtoken');
const { getRedisClient } = require('./redis');
const logger = require('../utils/logger');

let io;

function initializeSocketIO(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Use Redis adapter for multi-instance support
  const pubClient = getRedisClient();
  const subClient = pubClient.duplicate();
  
  io.adapter(createAdapter(pubClient, subClient));

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // Connection handling
  io.on('connection', (socket) => {
    const userId = socket.userId;
    
    logger.info(`✅ User connected: ${userId}`, {
      socketId: socket.id,
      userId
    });

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Handle mark as read
    socket.on('notification:markAsRead', async (notificationId) => {
      try {
        const notificationService = require('../services/notification.service');
        await notificationService.markAsRead(notificationId, userId);
        
        socket.emit('notification:updated', {
          id: notificationId,
          read: true
        });
      } catch (error) {
        logger.error('Error marking notification as read:', error);
      }
    });

    // Handle mark all as read
    socket.on('notification:markAllAsRead', async () => {
      try {
        const notificationService = require('../services/notification.service');
        await notificationService.markAllAsRead(userId);
        
        socket.emit('notifications:allRead');
      } catch (error) {
        logger.error('Error marking all as read:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`❌ User disconnected: ${userId}`, {
        socketId: socket.id,
        userId
      });
    });
  });

  logger.info('✅ Socket.IO initialized with Redis adapter');
  
  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

// Send notification to specific user
function sendToUser(userId, event, data) {
  const io = getIO();
  io.to(`user:${userId}`).emit(event, data);
  logger.info(`📤 Sent notification to user ${userId}`, { event, data });
}

// Broadcast to all connected users
function broadcast(event, data) {
  const io = getIO();
  io.emit(event, data);
}

module.exports = {
  initializeSocketIO,
  getIO,
  sendToUser,
  broadcast
};

