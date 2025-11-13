import React, { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markAsRead(n._id);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
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
                  key={n._id}
                  className={`flex justify-between items-start p-3 border-b cursor-pointer ${
                    n.read ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                  }`}
                  onClick={() => markAsRead(n._id)}
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {!n.read && (
                    <button
                      className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n._id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
