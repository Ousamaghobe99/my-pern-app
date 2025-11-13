import { body, validationResult  } from 'express-validator';
import ResponseHelper from '../utils/responseHelper.js';

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation rules for registration
const registerValidation = [
  body('matricule')
    .isLength({ min: 3, max: 20 })
    .withMessage('Matricule must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Matricule must contain only uppercase letters and numbers'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters and spaces'),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters and spaces'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('roleId')
    .isUUID()
    .withMessage('Please provide a valid role ID')
];
// Validation rules for first login password change
const changePasswordFirstLoginValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  
  body('currentPassword')
    .notEmpty()
    .withMessage('Current (temporary) password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Validation rules for change password
const changePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Validation rules for profile update
const updateProfileValidation = [
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
    .withMessage('Please provide a valid phone number')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return ResponseHelper.validationError(res, formattedErrors);
  }
  
  next();
};



export {
  loginValidation,
  registerValidation,
  changePasswordValidation,
  updateProfileValidation,
  handleValidationErrors,
  changePasswordFirstLoginValidation
};

export default {
  loginValidation,
  registerValidation,
  changePasswordValidation,
  updateProfileValidation,
  handleValidationErrors,
  changePasswordFirstLoginValidation
};

