// public/env.js
(function (window) {
  window._env_ = window._env_ || {};

  const isLocalhost = window.location.hostname === "localhost";

  // Main API URL
  window._env_.VITE_API_URL =
    window._env_.VITE_API_URL ||
    (isLocalhost
      ? "http://localhost:5000/api"
      : "http://backend:5000/api");

  // 🆕 Notification Service URL
  window._env_.VITE_NOTIFICATION_API_URL =
    window._env_.VITE_NOTIFICATION_API_URL ||
    (isLocalhost
      ? "http://localhost:3002"
      : "http://notification-service:3002");

  // 🆕 Notification WebSocket URL (for Socket.IO)
  window._env_.VITE_NOTIFICATION_WS_URL =
    window._env_.VITE_NOTIFICATION_WS_URL ||
    (isLocalhost
      ? "http://localhost:3002"
      : "http://notification-service:3002");

  console.log("🌍 Environment Configuration:");
  console.log("  - API URL:", window._env_.VITE_API_URL);
  console.log("  - Notification API URL:", window._env_.VITE_NOTIFICATION_API_URL);
  console.log("  - Notification WS URL:", window._env_.VITE_NOTIFICATION_WS_URL);
})(this);
// This file is used to inject environment variables into the frontend application at runtime.
// It allows you to configure the application without rebuilding it, which is especially useful in containerized environments.