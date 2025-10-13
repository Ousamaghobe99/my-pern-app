// public/env.js
(function (window) {
  window._env_ = window._env_ || {};

  // Dev = localhost, Prod = Docker backend
  window._env_.VITE_API_URL =
    window._env_.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "http://backend:5000/api");
})(this);
// This file is used to inject environment variables into the frontend application at runtime.
// It allows you to configure the application without rebuilding it, which is especially useful in containerized environments.