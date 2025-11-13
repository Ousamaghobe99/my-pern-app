import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getNotifications, markNotificationAsRead } from '../services/notificationService'; // You'll need to create this service

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newNotification, setNewNotification] = useState(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: () => getNotifications(user?._id),
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', user?._id]);
    },
  });

  useEffect(() => {
    if (user) {
      const socket = io(import.meta.env.VITE_NOTIFICATION_SERVICE_URL, {
        auth: { token: localStorage.getItem('token') },
      });

      socket.on('notification:new', (notification) => {
        queryClient.setQueryData(['notifications', user?._id], (oldData) => [notification, ...oldData]);
        setNewNotification(notification);
        setTimeout(() => setNewNotification(null), 5000);
      });

      socket.on('notification:updated', (updatedNotification) => {
        queryClient.setQueryData(['notifications', user?._id], (oldData) =>
          oldData.map((n) => (n._id === updatedNotification.id ? { ...n, read: updatedNotification.read } : n))
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, queryClient]);

  const markAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  return (
    <NotificationContext.Provider value={{ notifications, newNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
