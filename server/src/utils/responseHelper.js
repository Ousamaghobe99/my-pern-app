import { HTTP_STATUS } from './constants.js';

class ResponseHelper {
  static success(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static validationError(res, errors) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static conflict(res, message = 'Resource conflict') {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1
      },
      timestamp: new Date().toISOString()
    });
  }
}

export default ResponseHelper;

