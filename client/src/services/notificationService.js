import { io } from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('✅ Already connected to notification service');
      return;
    }

    // Get WebSocket URL from runtime config
    const wsUrl = window._env_?.VITE_NOTIFICATION_WS_URL || 
                  import.meta.env.VITE_NOTIFICATION_WS_URL || 
                  'http://localhost:3002';

    console.log('🔌 Connecting to notification service:', wsUrl);

    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to notification service');
      this.reconnectAttempts = 0;
      this.emit('connected');
    });

    this.socket.on('notification:new', (notification) => {
      console.log('📬 New notification:', notification);
      this.emit('newNotification', notification);
      this.showBrowserNotification(notification);
    });

    this.socket.on('notification:updated', (data) => {
      console.log('🔄 Notification updated:', data);
      this.emit('notificationUpdated', data);
    });

    this.socket.on('notifications:allRead', () => {
      console.log('✅ All notifications marked as read');
      this.emit('allRead');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from notification service:', reason);
      this.emit('disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error.message);
      this.reconnectAttempts++;
      this.emit('connectionError', error);
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
        this.emit('maxReconnectAttemptsReached');
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Disconnected from notification service');
    }
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: notification.id,
          requireInteraction: notification.priority === 'urgent',
        });

        n.onclick = () => {
          window.focus();
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
          n.close();
        };
      } catch (error) {
        console.error('Failed to show browser notification:', error);
      }
    }
  }

  // Event emitter pattern
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Mark as read
  markAsRead(notificationId) {
    if (this.socket?.connected) {
      this.socket.emit('notification:markAsRead', notificationId);
    }
  }

  // Mark all as read
  markAllAsRead() {
    if (this.socket?.connected) {
      this.socket.emit('notification:markAllAsRead');
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }

  // Get connection ID
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Export singleton instance
export default new NotificationService();