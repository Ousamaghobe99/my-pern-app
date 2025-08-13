import AuthService from '../services/authService.js';
import ResponseHelper from '../utils/responseHelper.js';
import { SUCCESS_MESSAGES, HTTP_STATUS  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class AuthController {
  // POST /api/auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      ResponseHelper.success(
        res,
        result,
        SUCCESS_MESSAGES.LOGIN_SUCCESS,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Login controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  // POST /api/auth/register
  static async register(req, res) {
    try {
      const userData = req.body;

      const result = await AuthService.register(userData);

      ResponseHelper.success(
        res,
        result,
        SUCCESS_MESSAGES.USER_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      Logger.error('Register controller error', error);
      
      if (error.message.includes('already exists')) {
        ResponseHelper.error(res, error.message, HTTP_STATUS.CONFLICT);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/auth/change-password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      await AuthService.changePassword(userId, currentPassword, newPassword);

      ResponseHelper.success(
        res,
        null,
        'Password changed successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Change password controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/auth/profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const profile = await AuthService.getProfile(userId);

      ResponseHelper.success(
        res,
        profile,
        'Profile retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get profile controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // PUT /api/auth/profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const updatedProfile = await AuthService.updateProfile(userId, updateData);

      ResponseHelper.success(
        res,
        updatedProfile,
        'Profile updated successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Update profile controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // POST /api/auth/logout
  static async logout(req, res) {
    try {
      // For JWT, logout is handled client-side by removing the token
      // Server-side logout would require token blacklisting (not implemented here)
      
      Logger.info(`User logged out: ${req.user.email}`);

      ResponseHelper.success(
        res,
        null,
        SUCCESS_MESSAGES.LOGOUT_SUCCESS,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Logout controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/auth/verify
  static async verifyToken(req, res) {
    try {
      // If we reach here, the token is valid (middleware already verified it)
      ResponseHelper.success(
        res,
        {
          valid: true,
          user: req.user
        },
        'Token is valid',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Verify token controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export default AuthController;

