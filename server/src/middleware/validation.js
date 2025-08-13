import { validationResult  } from 'express-validator';
import ResponseHelper from '../utils/responseHelper.js';
import Logger from '../utils/logger.js';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    Logger.warn('Validation failed', {
      url: req.originalUrl,
      method: req.method,
      errors: formattedErrors,
      userId: req.user?.id
    });
    
    return ResponseHelper.validationError(res, formattedErrors);
  }
  
  next();
};

// Middleware to sanitize input data
const sanitizeInput = (req, res, next) => {
  // Remove any null bytes from string inputs
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/\0/g, '');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Middleware to validate UUID parameters
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuid || !uuidRegex.test(uuid)) {
      return ResponseHelper.error(
        res,
        `Invalid ${paramName} format. Must be a valid UUID.`,
        400
      );
    }
    
    next();
  };
};

// Middleware to validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return ResponseHelper.error(
      res,
      'Page must be a positive integer',
      400
    );
  }
  
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return ResponseHelper.error(
      res,
      'Limit must be a positive integer between 1 and 100',
      400
    );
  }
  
  next();
};

// Middleware to validate sort parameters
const validateSort = (allowedFields) => {
  return (req, res, next) => {
    const { sortBy, sortOrder } = req.query;
    
    if (sortBy && !allowedFields.includes(sortBy)) {
      return ResponseHelper.error(
        res,
        `Invalid sortBy field. Allowed fields: ${allowedFields.join(', ')}`,
        400
      );
    }
    
    if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      return ResponseHelper.error(
        res,
        'Sort order must be either "asc" or "desc"',
        400
      );
    }
    
    next();
  };
};

export default {
  handleValidationErrors,
  sanitizeInput,
  validateUUID,
  validatePagination,
  validateSort
};

