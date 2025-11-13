const Notification = require('../models/notificationModel');
const logger = require('../utils/logger');

/**
 * Create a new notification
 */
async function createNotification(data) {
  try {
    const notification = new Notification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      category: data.category || 'other',
      actionUrl: data.actionUrl,
      actionText: data.actionText,
      metadata: data.metadata || {},
      expiresAt: data.expiresAt,
    });

    await notification.save();
    
    logger.info('✅ Notification created', {
      id: notification._id,
      userId: notification.userId,
      type: notification.type,
    });

    return notification;
  } catch (error) {
    logger.error('❌ Failed to create notification:', error);
    throw error;
  }
}

/**
 * Get user notifications with pagination and filters
 */
async function getUserNotifications(userId, options = {}) {
  try {
    const {
      limit = 50,
      skip = 0,
      read = null,
      type = null,
      category = null,
    } = options;

    const query = { userId };
    
    if (read !== null) {
      query.read = read;
    }
    
    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      total,
      limit,
      skip,
      hasMore: skip + notifications.length < total,
    };
  } catch (error) {
    logger.error('❌ Failed to get notifications:', error);
    throw error;
  }
}

/**
 * Get unread notification count
 */
async function getUnreadCount(userId) {
  try {
    const count = await Notification.countDocuments({
      userId,
      read: false,
    });
    
    return count;
  } catch (error) {
    logger.error('❌ Failed to get unread count:', error);
    throw error;
  }
}

/**
 * Get notification by ID
 */
async function getNotificationById(notificationId, userId) {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId, // Ensure user owns this notification
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  } catch (error) {
    logger.error('❌ Failed to get notification by ID:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 */
async function markAsRead(notificationId, userId) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { 
        $set: { 
          read: true, 
          readAt: new Date() 
        } 
      },
      { new: true } // Return updated document
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    logger.info('✅ Notification marked as read', {
      id: notificationId,
      userId,
    });

    return notification;
  } catch (error) {
    logger.error('❌ Failed to mark as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for user
 */
async function markAllAsRead(userId) {
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { 
        $set: { 
          read: true, 
          readAt: new Date() 
        } 
      }
    );

    logger.info('✅ All notifications marked as read', {
      userId,
      modifiedCount: result.modifiedCount,
    });

    return result;
  } catch (error) {
    logger.error('❌ Failed to mark all as read:', error);
    throw error;
  }
}

/**
 * Delete a notification
 */
async function deleteNotification(notificationId, userId) {
  try {
    const result = await Notification.deleteOne({
      _id: notificationId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new Error('Notification not found');
    }

    logger.info('✅ Notification deleted', {
      id: notificationId,
      userId,
    });

    return result;
  } catch (error) {
    logger.error('❌ Failed to delete notification:', error);
    throw error;
  }
}

/**
 * Delete all read notifications for user
 */
async function deleteAllRead(userId) {
  try {
    const result = await Notification.deleteMany({
      userId,
      read: true,
    });

    logger.info('✅ All read notifications deleted', {
      userId,
      deletedCount: result.deletedCount,
    });

    return result;
  } catch (error) {
    logger.error('❌ Failed to delete read notifications:', error);
    throw error;
  }
}

/**
 * Get notification statistics for user
 */
async function getNotificationStats(userId) {
  try {
    const [total, unread, byType, byCategory] = await Promise.all([
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, read: false }),
      Notification.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Notification.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total,
      unread,
      read: total - unread,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  } catch (error) {
    logger.error('❌ Failed to get notification stats:', error);
    throw error;
  }
}

/**
 * Cleanup old notifications (cron job)
 */
async function cleanupOldNotifications(days = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      read: true, // Only delete read notifications
    });

    logger.info('✅ Old notifications cleaned up', {
      deletedCount: result.deletedCount,
      cutoffDate,
    });

    return result;
  } catch (error) {
    logger.error('❌ Failed to cleanup old notifications:', error);
    throw error;
  }
}

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getNotificationStats,
  cleanupOldNotifications,
};