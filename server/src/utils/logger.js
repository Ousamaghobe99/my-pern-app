import config from '../config/env.js';

class Logger {
  static info(message, meta = {}) {
    if (config.nodeEnv === 'development') {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
    }
  }

  static error(message, error = null, meta = {}) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, {
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null,
      ...meta
    });
  }

  static warn(message, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta);
  }

  static debug(message, meta = {}) {
    if (config.nodeEnv === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta);
    }
  }

  static http(req, res, responseTime) {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`;
    if (res.statusCode >= 400) {
      this.error(message, null, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    } else {
      this.info(message, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }
  }
}

export default Logger;

