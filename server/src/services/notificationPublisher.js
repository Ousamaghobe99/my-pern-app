import rabbitmqService from './rabbitmqService.js';
import Logger from '../utils/logger.js';

class NotificationPublisher {
  constructor() {
    this.notificationQueue = process.env.NOTIFICATION_QUEUE || 'notifications';
  }

  /**
   * Publish notification event to notification microservice
   */
  async publishNotification(notificationData) {
    try {
      await rabbitmqService.publishToQueue(this.notificationQueue, notificationData);
      
      Logger.info(`✓ Notification event published: ${notificationData.type}`);
      return { 
        success: true, 
        message: 'Notification queued successfully'
      };
    } catch (error) {
      Logger.error('Failed to publish notification:', error.message);
      // Don't throw - notifications are non-critical
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send notification for new user creation
   */
  async notifyUserCreated(user) {
    return await this.publishNotification({
      type: 'USER_CREATED',
      userId: user.id,
      data: {
        title: 'Welcome to Our Platform! 🎉',
        message: `Welcome ${user.firstName}! Your account has been created. Check your email for login credentials.`,
        priority: 'normal',
        category: 'account',
        metadata: {
          matricule: user.matricule,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send notification for first login
   */
  async notifyFirstLogin(user, ipAddress, userAgent) {
    return await this.publishNotification({
      type: 'FIRST_LOGIN',
      userId: user.id,
      data: {
        title: 'Welcome Back! ✨',
        message: `Great to see you, ${user.firstName}! You've successfully logged in for the first time.`,
        priority: 'normal',
        category: 'account',
        metadata: {
          matricule: user.matricule,
          email: user.email,
          ipAddress,
          userAgent,
          loginTime: new Date().toLocaleString(),
        }
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send notification for password change
   */
  async notifyPasswordChanged(user, ipAddress) {
    return await this.publishNotification({
      type: 'PASSWORD_CHANGED',
      userId: user.id,
      data: {
        title: 'Password Changed Successfully 🔒',
        message: `Your password was changed at ${new Date().toLocaleString()}. If this wasn't you, please contact support immediately.`,
        priority: 'high',
        category: 'security',
        actionUrl: '/profile/security',
        actionText: 'Review Security',
        metadata: {
          matricule: user.matricule,
          email: user.email,
          ipAddress,
          changeTime: new Date().toLocaleString(),
        }
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send notification for profile update
   */
  async notifyProfileUpdated(user) {
    return await this.publishNotification({
      type: 'PROFILE_UPDATED',
      userId: user.id,
      data: {
        title: 'Profile Updated ✅',
        message: 'Your profile information has been updated successfully.',
        priority: 'low',
        category: 'account',
        actionUrl: '/profile',
        actionText: 'View Profile',
        metadata: {
          matricule: user.matricule,
          email: user.email,
        }
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send notification for maintenance ticket
   */
  async notifyMaintenanceTicket(user, ticket, action) {
    const titles = {
      created: '🔧 New Maintenance Ticket Created',
      updated: '🔄 Maintenance Ticket Updated',
      resolved: '✅ Maintenance Ticket Resolved',
    };

    const messages = {
      created: `Maintenance ticket #${ticket.id} has been created.`,
      updated: `Maintenance ticket #${ticket.id} has been updated.`,
      resolved: `Maintenance ticket #${ticket.id} has been resolved.`,
    };

    return await this.publishNotification({
      type: 'MAINTENANCE_TICKET',
      userId: user.id,
      data: {
        title: titles[action] || 'Maintenance Update',
        message: messages[action] || 'Maintenance ticket updated.',
        priority: action === 'created' ? 'normal' : 'low',
        category: 'system',
        actionUrl: `/maintenance/${ticket.id}`,
        actionText: 'View Ticket',
        metadata: {
          ticketId: ticket.id,
          action,
          status: ticket.status,
        }
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send system alert notification
   */
  async notifySystemAlert(userIds, title, message) {
    const notifications = userIds.map(userId => 
      this.publishNotification({
        type: 'SYSTEM_ALERT',
        userId,
        data: {
          title: title || 'System Alert 🔔',
          message,
          priority: 'urgent',
          category: 'system',
          metadata: {
            alertTime: new Date().toLocaleString(),
          }
        },
        timestamp: new Date().toISOString(),
      })
    );

    return await Promise.allSettled(notifications);
  }
}

// Create and export singleton instance
const notificationPublisher = new NotificationPublisher();
export default notificationPublisher;