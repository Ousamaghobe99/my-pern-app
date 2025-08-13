import { body, query  } from 'express-validator';

// Validation rules for creating maintenance ticket
const createMaintenanceTicketValidation = [
  body('interfaceId')
    .notEmpty()
    .withMessage('Interface ID is required')
    .isUUID()
    .withMessage('Interface ID must be a valid UUID'),
  
  body('type')
    .optional()
    .isIn(['Corrective', 'Preventive', 'Calibration', 'Upgrade', 'Inspection'])
    .withMessage('Type must be a valid maintenance type'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be a valid priority level'),
  
  body('reportedById')
    .notEmpty()
    .withMessage('Reported by user ID is required')
    .isUUID()
    .withMessage('Reported by user ID must be a valid UUID'),
  
  body('assignedToId')
    .optional()
    .isUUID()
    .withMessage('Assigned to user ID must be a valid UUID'),
  
  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error('Scheduled date cannot be in the past');
      }
      return true;
    })
];

// Validation rules for updating maintenance ticket
const updateMaintenanceTicketValidation = [
  body('type')
    .optional()
    .isIn(['Corrective', 'Preventive', 'Calibration', 'Upgrade', 'Inspection'])
    .withMessage('Type must be a valid maintenance type'),
  
  body('status')
    .optional()
    .isIn(['Open', 'InProgress', 'Resolved', 'Closed', 'OnHold'])
    .withMessage('Status must be a valid maintenance status'),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be a valid priority level'),
  
  body('assignedToId')
    .optional()
    .isUUID()
    .withMessage('Assigned to user ID must be a valid UUID'),
  
  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
  
  body('completedDate')
    .optional()
    .isISO8601()
    .withMessage('Completed date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && req.body.scheduledDate) {
        const completedDate = new Date(value);
        const scheduledDate = new Date(req.body.scheduledDate);
        if (completedDate < scheduledDate) {
          throw new Error('Completed date cannot be before scheduled date');
        }
      }
      return true;
    })
];

// Validation rules for adding maintenance log
const addMaintenanceLogValidation = [
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Description must be between 5 and 1000 characters'),
  
  body('actionTaken')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Action taken must not exceed 1000 characters')
];

// Validation rules for maintenance query parameters
const maintenanceQueryValidation = [
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
    .isIn(['Open', 'InProgress', 'Resolved', 'Closed', 'OnHold'])
    .withMessage('Status must be a valid maintenance status'),
  
  query('type')
    .optional()
    .isIn(['Corrective', 'Preventive', 'Calibration', 'Upgrade', 'Inspection'])
    .withMessage('Type must be a valid maintenance type'),
  
  query('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be a valid priority level'),
  
  query('assignedToId')
    .optional()
    .isUUID()
    .withMessage('Assigned to user ID must be a valid UUID'),
  
  query('reportedById')
    .optional()
    .isUUID()
    .withMessage('Reported by user ID must be a valid UUID'),
  
  query('interfaceId')
    .optional()
    .isUUID()
    .withMessage('Interface ID must be a valid UUID'),
  
  query('sortBy')
    .optional()
    .isIn(['type', 'status', 'priority', 'scheduledDate', 'completedDate', 'createdAt', 'updatedAt'])
    .withMessage('Sort by must be a valid field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];

export default {
  createMaintenanceTicketValidation,
  updateMaintenanceTicketValidation,
  addMaintenanceLogValidation,
  maintenanceQueryValidation
};

