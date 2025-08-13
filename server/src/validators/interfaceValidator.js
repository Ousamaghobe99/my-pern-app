import { body, query  } from 'express-validator';

// Validation rules for creating interface
const createInterfaceValidation = [
  body('interfaceName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Interface name must be between 2 and 100 characters'),
  
  body('serialNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Serial number must be a positive integer'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Type must be between 2 and 50 characters'),
  
  body('currentLocationId')
    .optional()
    .isUUID()
    .withMessage('Current location ID must be a valid UUID'),
  
  body('qrCodeData')
    .optional()
    .isLength({ max: 200 })
    .withMessage('QR code data must not exceed 200 characters')
];

// Validation rules for updating interface
const updateInterfaceValidation = [
  body('interfaceName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Interface name must be between 2 and 100 characters'),
  
  body('serialNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Serial number must be a positive integer'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('type')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Type must be between 2 and 50 characters'),
  
  body('status')
    .optional()
    .isIn(['Available', 'InUse', 'UnderMaintenance', 'Retired', 'Disposed'])
    .withMessage('Status must be a valid interface status'),
  
  body('currentLocationId')
    .optional()
    .isUUID()
    .withMessage('Current location ID must be a valid UUID'),
  
  body('qrCodeData')
    .optional()
    .isLength({ max: 200 })
    .withMessage('QR code data must not exceed 200 characters')
];

// Validation rules for moving interface
const moveInterfaceValidation = [
  body('toLocationId')
    .notEmpty()
    .withMessage('Destination location ID is required')
    .isUUID()
    .withMessage('Destination location ID must be a valid UUID'),
  
  body('reason')
    .optional()
    .isIn(['Deployment', 'Retrieval', 'Maintenance', 'Disposal', 'Calibration', 'TemporaryUse'])
    .withMessage('Reason must be a valid movement reason'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

// Validation rules for interface query parameters
const interfaceQueryValidation = [
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
  
  query('status')
    .optional()
    .isIn(['Available', 'InUse', 'UnderMaintenance', 'Retired', 'Disposed'])
    .withMessage('Status must be a valid interface status'),
  
  query('type')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Type filter must not exceed 50 characters'),
  
  query('locationId')
    .optional()
    .isUUID()
    .withMessage('Location ID must be a valid UUID'),
  
  query('sortBy')
    .optional()
    .isIn(['interfaceName', 'serialNumber', 'type', 'status', 'createdAt', 'updatedAt'])
    .withMessage('Sort by must be a valid field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];

export default {
  createInterfaceValidation,
  updateInterfaceValidation,
  moveInterfaceValidation,
  interfaceQueryValidation
};

