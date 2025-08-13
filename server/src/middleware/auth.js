import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import ResponseHelper from '../utils/responseHelper.js';
import { ERROR_MESSAGES  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user with role and permissions
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Add user info to request
    req.user = {
      id: user.id,
      matricule: user.matricule,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
      permissions: user.role.permissions.map(rp => rp.permission.name)
    };

    next();
  } catch (error) {
    Logger.error('Authentication error', error);
    
    if (error.name === 'JsonWebTokenError') {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
    }
    
    if (error.name === 'TokenExpiredError') {
      return ResponseHelper.unauthorized(res, 'Token has expired');
    }
    
    return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
  }
};

// Check if user has specific permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!req.user.permissions.includes(permission) && !req.user.permissions.includes('admin:all')) {
      return ResponseHelper.forbidden(res, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

// Check if user has any of the specified permissions
const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const hasPermission = permissions.some(permission => 
      req.user.permissions.includes(permission)
    ) || req.user.permissions.includes('admin:all');

    if (!hasPermission) {
      return ResponseHelper.forbidden(res, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

// Check if user has specific role
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (req.user.role !== role && req.user.role !== 'Administrator') {
      return ResponseHelper.forbidden(res, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

// Check if user has any of the specified roles
const requireAnyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const hasRole = roles.includes(req.user.role) || req.user.role === 'Administrator';

    if (!hasRole) {
      return ResponseHelper.forbidden(res, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (user) {
      req.user = {
        id: user.id,
        matricule: user.matricule,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        permissions: user.role.permissions.map(rp => rp.permission.name)
      };
    }

    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};

export {
  authenticateToken,
  requirePermission,
  requireAnyPermission,
  requireRole,
  requireAnyRole,
  optionalAuth
};

export default {
  authenticateToken,
  requirePermission,
  requireAnyPermission,
  requireRole,
  requireAnyRole,
  optionalAuth
};

