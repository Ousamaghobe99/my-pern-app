import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import limiter from './middleware/rateLimiter.js';
import Logger from './utils/logger.js';
import ResponseHelper from './utils/responseHelper.js';


// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import interfaceRoutes from './routes/interfaces.js';
import locationRoutes from './routes/locations.js';
import maintenanceRoutes from './routes/maintenance.js';
import scheduleRoutes from './routes/scheduleRoutes.js';

const app = express();

// Trust proxy for IP detection
app.set('trust proxy', 1);

// Security and CORS
app.use(helmet());
app.use(corsMiddleware);

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('combined'));
}
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    Logger.http(req, res, responseTime);
  });
  next();
});

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check - skip rate limiter for testing
app.get('/health', (req, res) => {
  ResponseHelper.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  }, 'Server is healthy');
});

// Routes with specific rate limiters
app.use('/api/auth', limiter.authLimiter, authRoutes);          // strict auth limiter
app.use('/api/users/change-password', limiter.passwordChangeLimiter); // very strict for password changes
app.use('/api/users', limiter.readLimiter, userRoutes);          // lenient for GET, add writeLimiter inside route for POST/PUT/DELETE
app.use('/api/interfaces', limiter.readLimiter, interfaceRoutes);
app.use('/api/locations', limiter.readLimiter, locationRoutes);
app.use('/api/maintenance', limiter.writeLimiter, maintenanceRoutes);
app.use('/api/schedules', limiter.writeLimiter, scheduleRoutes);

// Optional: apply general limiter to all remaining routes
app.use(limiter.generalLimiter);

// 404 handler
app.use('*', (req, res) => {
  ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
});

// Global error handler
app.use(errorHandler);

export default app;
