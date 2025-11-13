import api from './api';

export const getNotifications = async (userId) => {
  const { data } = await api.get(`/notifications/${userId}`);
  return data;
};

export const markNotificationAsRead = async (notificationId) => {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
};
