// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  MATRICULE_ALREADY_EXISTS: 'Matricule already exists',
  INTERFACE_NOT_FOUND: 'Interface not found',
  LOCATION_NOT_FOUND: 'Location not found',
  MAINTENANCE_TICKET_NOT_FOUND: 'Maintenance ticket not found',
  INVALID_TOKEN: 'Invalid or expired token',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INTERFACE_CREATED: 'Interface created successfully',
  INTERFACE_UPDATED: 'Interface updated successfully',
  INTERFACE_DELETED: 'Interface deleted successfully',
  LOCATION_CREATED: 'Location created successfully',
  LOCATION_UPDATED: 'Location updated successfully',
  LOCATION_DELETED: 'Location deleted successfully',
  MAINTENANCE_TICKET_CREATED: 'Maintenance ticket created successfully',
  MAINTENANCE_TICKET_UPDATED: 'Maintenance ticket updated successfully',
  MAINTENANCE_TICKET_CLOSED: 'Maintenance ticket closed successfully'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Interface Status
export const INTERFACE_STATUS = {
  AVAILABLE: 'Available',
  IN_USE: 'InUse',
  UNDER_MAINTENANCE: 'UnderMaintenance',
  RETIRED: 'Retired',
  DISPOSED: 'Disposed'
};

// Movement Reasons
export const MOVEMENT_REASON = {
  DEPLOYMENT: 'Deployment',
  RETRIEVAL: 'Retrieval',
  MAINTENANCE: 'Maintenance',
  DISPOSAL: 'Disposal',
  CALIBRATION: 'Calibration',
  TEMPORARY_USE: 'TemporaryUse'
};

// Maintenance Types
export const MAINTENANCE_TYPE = {
  CORRECTIVE: 'Corrective',
  PREVENTIVE: 'Preventive',
  CALIBRATION: 'Calibration',
  UPGRADE: 'Upgrade',
  INSPECTION: 'Inspection'
};

// Maintenance Status
export const MAINTENANCE_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'InProgress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  ON_HOLD: 'OnHold'
};

// Priority Status
export const PRIORITY_STATUS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

