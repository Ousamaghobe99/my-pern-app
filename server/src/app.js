import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import config from './config/env.js';
import Logger from './utils/logger.js';
import ResponseHelper from './utils/responseHelper.js';
import { ERROR_MESSAGES  } from './utils/constants.js';

// Import middleware
import { errorHandler  } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import interfaceRoutes from './routes/interfaces.js';
import locationRoutes from './routes/locations.js';
import maintenanceRoutes from './routes/maintenance.js';

const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Security middleware
app.use(helmet());
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('combined'));
}

// Custom logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    Logger.http(req, res, responseTime);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  ResponseHelper.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  }, 'Server is healthy');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interfaces', interfaceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// 404 handler
app.use('*', (req, res) => {
  ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
});

// Global error handler
app.use(errorHandler);

export default app;

