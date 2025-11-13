#!/bin/sh

# Generate env.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env.js
(function (window) {
  window._env_ = window._env_ || {};

  // Inject runtime environment variables
  window._env_.VITE_API_URL = "${VITE_API_URL:-http://localhost:5000/api}";
  window._env_.VITE_NOTIFICATION_API_URL = "${VITE_NOTIFICATION_API_URL:-http://localhost:3002}";
  window._env_.VITE_NOTIFICATION_WS_URL = "${VITE_NOTIFICATION_WS_URL:-http://localhost:3002}";

  console.log("🌍 Runtime Environment Configuration:");
  console.log("  - API URL:", window._env_.VITE_API_URL);
  console.log("  - Notification API URL:", window._env_.VITE_NOTIFICATION_API_URL);
  console.log("  - Notification WS URL:", window._env_.VITE_NOTIFICATION_WS_URL);
})(this);
EOF

echo "✅ Environment variables injected into env.js"
cat /usr/share/nginx/html/env.js

# Start nginx
exec nginx -g 'daemon off;'