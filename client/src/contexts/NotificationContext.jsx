import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null); // for toast

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setNewNotification(notification); // trigger toast
    // auto clear toast after 3s
    setTimeout(() => setNewNotification(null), 3000);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, newNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
