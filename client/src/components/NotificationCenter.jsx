import React, { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";

const NotificationCenter = () => {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show toast for new notifications
  useEffect(() => {
    const newNotifications = notifications.filter(
      (n) => !toasts.some((t) => t.id === n.id)
    );

    if (newNotifications.length > 0) {
      setToasts((prev) => [...prev, ...newNotifications]);
      newNotifications.forEach((n) => {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== n.id));
        }, 4000);
      });
    }
  }, [notifications, toasts]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markAsRead(n.id);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2 font-bold border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span>Notifications ({unreadCount})</span>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-400 dark:text-gray-400 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex justify-between items-start p-3 border-b cursor-pointer ${
                    n.read ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {n.time}
                    </span>
                  </div>
                  <button
                    className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => markAsRead(n.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-16 right-4 flex flex-col gap-2 z-50">
        {toasts.map((n) => (
          <div
            key={n.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg w-72 flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{n.message}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">{n.time}</span>
            </div>
            <button
              className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== n.id))}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
