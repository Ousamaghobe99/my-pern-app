const Notification = require('../models/notificationModel');
const { sendToUser } = require('../config/socket');
const logger = require('../utils/logger');

/**
 * Start MongoDB Change Stream
 * This watches for real-time changes in notifications collection
 * Useful for syncing across multiple service instances
 */
function startChangeStream() {
  const changeStream = Notification.watch(
    [
      {
        $match: {
          operationType: { $in: ['insert', 'update', 'delete'] }
        }
      }
    ],
    { fullDocument: 'updateLookup' }
  );

  logger.info('👀 MongoDB Change Stream started');

  changeStream.on('change', (change) => {
    logger.info('📡 Database change detected:', change.operationType);

    switch (change.operationType) {
      case 'insert':
        handleInsert(change);
        break;
      case 'update':
        handleUpdate(change);
        break;
      case 'delete':
        handleDelete(change);
        break;
    }
  });

  changeStream.on('error', (error) => {
    logger.error('❌ Change stream error:', error);
    // Restart change stream after error
    setTimeout(startChangeStream, 5000);
  });

  return changeStream;
}

function handleInsert(change) {
  const notification = change.fullDocument;
  
  // Send to user via WebSocket
  sendToUser(notification.userId, 'notification:new', {
    id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    priority: notification.priority,
    category: notification.category,
    createdAt: notification.createdAt,
    read: false,
  });
}

function handleUpdate(change) {
  const notification = change.fullDocument;
  
  if (notification.read) {
    sendToUser(notification.userId, 'notification:updated', {
      id: notification._id.toString(),
      read: true,
      readAt: notification.readAt,
    });
  }
}

function handleDelete(change) {
  // You could send a delete event if needed
  logger.info('Notification deleted:', change.documentKey._id);
}

module.exports = { startChangeStream };