const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'USER_CREATED',
      'FIRST_LOGIN',
      'PASSWORD_CHANGED',
      'PROFILE_UPDATED',
      'MAINTENANCE_TICKET',
      'SYSTEM_ALERT',
      'PASSWORD_RESET',
      'USER_REGISTERED'
    ],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  category: {
    type: String,
    enum: ['account', 'security', 'system', 'other'],
    default: 'other',
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  actionUrl: String,
  actionText: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  expiresAt: Date,
}, {
  timestamps: true,
});

// Indexes for performance
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);