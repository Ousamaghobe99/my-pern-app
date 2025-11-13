import React from "react";
import { useNotifications } from "../contexts/NotificationContext";

const NotificationToast = () => {
  const { newNotification } = useNotifications();

  if (!newNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-lg p-3 z-50 animate-slide-in">
      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
        {newNotification.message}
      </p>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {newNotification.time}
      </span>
    </div>
  );
};

export default NotificationToast;
