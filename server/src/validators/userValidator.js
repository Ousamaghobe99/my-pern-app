import { body, query  } from 'express-validator';

// Validation rules for creating user
const createUserValidation = [
  body('matricule')
    .notEmpty()
    .withMessage('Matricule is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Matricule must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Matricule must contain only uppercase letters and numbers'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters and spaces'),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters and spaces'),
  
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('roleId')
    .notEmpty()
    .withMessage('Role ID is required')
    .isUUID()
    .withMessage('Role ID must be a valid UUID')
];

// Validation rules for updating user
const updateUserValidation = [
  body('matricule')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Matricule must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Matricule must contain only uppercase letters and numbers'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters and spaces'),
  
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters and spaces'),
  
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('roleId')
    .optional()
    .isUUID()
    .withMessage('Role ID must be a valid UUID')
];

// Validation rules for user query parameters
const userQueryValidation = [
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
  
  query('roleId')
    .optional()
    .isUUID()
    .withMessage('Role ID must be a valid UUID'),
  
  query('sortBy')
    .optional()
    .isIn(['firstName', 'lastName', 'email', 'matricule', 'createdAt', 'updatedAt'])
    .withMessage('Sort by must be a valid field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];

export default {
  createUserValidation,
  updateUserValidation,
  userQueryValidation
};

