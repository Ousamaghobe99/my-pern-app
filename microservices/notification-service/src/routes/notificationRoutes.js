const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /api/notifications
 * Get user notifications with pagination and filters
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = {
      limit: parseInt(req.query.limit) || 50,
      skip: parseInt(req.query.skip) || 0,
      read: req.query.read === 'true' ? true : req.query.read === 'false' ? false : null,
      type: req.query.type,
      category: req.query.category,
    };

    const result = await notificationService.getUserNotifications(userId, options);
    const unreadCount = await notificationService.getUnreadCount(userId);

    res.json({
      ...result,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
router.get('/unread-count', async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/notifications/stats
 * Get notification statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await notificationService.getNotificationStats(req.user.userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/notifications/:id
 * Get specific notification
 */
router.get('/:id', async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id,
      req.user.userId
    );
    res.json(notification);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.userId
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read
 */
router.patch('/mark-all-read', async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', async (req, res) => {
  try {
    await notificationService.deleteNotification(
      req.params.id,
      req.user.userId
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/notifications/read/all
 * Delete all read notifications
 */
router.delete('/read/all', async (req, res) => {
  try {
    const result = await notificationService.deleteAllRead(req.user.userId);
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
