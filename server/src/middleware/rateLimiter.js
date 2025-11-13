import rateLimit from 'express-rate-limit';
import config from '../config/env.js';
import { ERROR_MESSAGES  } from '../utils/constants.js';

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  skip: (req) => req.method === 'OPTIONS', // Skip OPTIONS preflight requests
  message: {
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.id || req.ip;
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    return req.ip; // Use IP for auth attempts
  }
});

// Moderate rate limiter for write operations
const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 write operations per window
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many write operations, please slow down',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

// Lenient rate limiter for read operations
const readLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 read operations per window
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many read operations, please slow down',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

// Very strict rate limiter for password change
const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password changes per hour
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many password change attempts, please try again later',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 uploads per window
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many file uploads, please try again later',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

export default {
  generalLimiter,
  authLimiter,
  writeLimiter,
  readLimiter,
  passwordChangeLimiter,
  uploadLimiter
};

