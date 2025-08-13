import ResponseHelper from '../utils/responseHelper.js';
import Logger from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES  } from '../utils/constants.js';

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  Logger.error('Unhandled error', err, {
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Handle Prisma errors
  if (err.code) {
    return handlePrismaError(err, res);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseHelper.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseHelper.unauthorized(res, 'Token has expired');
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return ResponseHelper.validationError(res, err.errors);
  }

  // Handle multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return ResponseHelper.error(
      res,
      'File size too large',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return ResponseHelper.error(
      res,
      'Too many files uploaded',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Handle syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ResponseHelper.error(
      res,
      'Invalid JSON format',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Default error response
  const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  ResponseHelper.error(res, message, statusCode);
};

// Handle Prisma-specific errors
const handlePrismaError = (err, res) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target?.[0] || 'field';
      return ResponseHelper.conflict(
        res,
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      );

    case 'P2025':
      // Record not found
      return ResponseHelper.notFound(res, 'Record not found');

    case 'P2003':
      // Foreign key constraint violation
      return ResponseHelper.error(
        res,
        'Cannot perform operation due to related records',
        HTTP_STATUS.CONFLICT
      );

    case 'P2004':
      // Constraint failed
      return ResponseHelper.error(
        res,
        'Operation violates database constraints',
        HTTP_STATUS.BAD_REQUEST
      );

    case 'P2014':
      // Invalid ID
      return ResponseHelper.error(
        res,
        'Invalid ID provided',
        HTTP_STATUS.BAD_REQUEST
      );

    case 'P2021':
      // Table does not exist
      return ResponseHelper.error(
        res,
        'Database table not found',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );

    case 'P2022':
      // Column does not exist
      return ResponseHelper.error(
        res,
        'Database column not found',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );

    default:
      Logger.error('Unhandled Prisma error', err);
      return ResponseHelper.error(
        res,
        'Database operation failed',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
  }
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export {
  errorHandler,
  notFoundHandler,
  asyncHandler
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler
};

