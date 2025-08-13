import { body, query  } from 'express-validator';

// Validation rules for creating location
const createLocationValidation = [
  body('name')
    .notEmpty()
    .withMessage('Location name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Location name can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters')
];

// Validation rules for updating location
const updateLocationValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Location name can only contain letters, numbers, spaces, hyphens, and underscores'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters')
];

// Validation rules for location query parameters
const locationQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'description', 'address', 'createdAt', 'updatedAt'])
    .withMessage('Sort by must be a valid field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];

export default {
  createLocationValidation,
  updateLocationValidation,
  locationQueryValidation
};

