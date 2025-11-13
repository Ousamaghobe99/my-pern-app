// public/env.js
(function (window) {
  window._env_ = window._env_ || {};

  // Always use relative URL - Nginx will proxy it
  window._env_.VITE_API_URL = window._env_.VITE_API_URL || "/api";
})(this);