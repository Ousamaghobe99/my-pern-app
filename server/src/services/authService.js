import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken  } from '../config/jwt.js';
import { ERROR_MESSAGES  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class AuthService {
  // User login
  static async login(email, password) {
  try {
    // Find user with role and permissions
    const user = await prisma.user.findUnique({
      where: { email },
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
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // ===== NEW: Check if password is temporary =====
    if (user.isTemporaryPassword) {
      // Check if temporary password expired
      

      // Return special flag indicating password change required
      const tempToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role.name,
        isTemporary: true
        
      }, '15m' ); // Short-lived token for password change  
      return {
        requirePasswordChange: true,
        token: tempToken,
        userId: user.id,
        email: user.email,
        message: 'Password change required. Please set a new password.'
      };
    }
    // =============================================

    // Generate JWT token (only if password is not temporary)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role.name
    });

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      matricule: user.matricule,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        permissions: user.role.permissions.map(rp => ({
          id: rp.permission.id,
          name: rp.permission.name,
          description: rp.permission.description
        }))
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    Logger.info(`User logged in: ${user.email}`);

    return {
      user: userData,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  } catch (error) {
    Logger.error('Login error', error);
    throw error;
  }
  }

  // Register new user
  static async register(userData) {
    try {
      const { matricule, email, password, firstName, lastName, phoneNumber, roleId } = userData;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { matricule }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        if (existingUser.matricule === matricule) {
          throw new Error(ERROR_MESSAGES.MATRICULE_ALREADY_EXISTS);
        }
      }

      // Verify role exists
      const role = await prisma.role.findUnique({
        where: { id: roleId }
      });

      if (!role) {
        throw new Error('Invalid role specified');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          matricule,
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phoneNumber,
          roleId
        },
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

      // Generate JWT token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role.name
      });

      // Prepare user data (exclude password)
      const responseUser = {
        id: newUser.id,
        matricule: newUser.matricule,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        role: {
          id: newUser.role.id,
          name: newUser.role.name,
          description: newUser.role.description,
          permissions: newUser.role.permissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            description: rp.permission.description
          }))
        },
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      Logger.info(`New user registered: ${newUser.email}`);

      return {
        user: responseUser,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      };
    } catch (error) {
      Logger.error('Registration error', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      Logger.info(`Password changed for user: ${user.email}`);

      return { success: true };
    } catch (error) {
      Logger.error('Change password error', error);
      throw error;
    }
  }

  // Get user profile
  static async getProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Prepare user data (exclude password)
      const userData = {
        id: user.id,
        matricule: user.matricule,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
          permissions: user.role.permissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            description: rp.permission.description
          }))
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return userData;
    } catch (error) {
      Logger.error('Get profile error', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const { firstName, lastName, phoneNumber } = updateData;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phoneNumber
        },
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

      // Prepare user data (exclude password)
      const userData = {
        id: updatedUser.id,
        matricule: updatedUser.matricule,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        role: {
          id: updatedUser.role.id,
          name: updatedUser.role.name,
          description: updatedUser.role.description,
          permissions: updatedUser.role.permissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            description: rp.permission.description
          }))
        },
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      };

      Logger.info(`Profile updated for user: ${updatedUser.email}`);

      return userData;
    } catch (error) {
      Logger.error('Update profile error', error);
      throw error;
    }
  }
  // Change password on first login

static async changePasswordFirstLogin(userId, currentPassword, newPassword) {
  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.isTemporaryPassword) {
            // User not found, or they already changed their password
            throw new Error('Invalid user ID or password change already completed.', HTTP_STATUS.FORBIDDEN);
        }

    // Check if password is temporary
    if (!user.isTemporaryPassword) {
      throw new Error('Password change not required. Use regular password change endpoint.');
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current(temporary password) is incorrect.', HTTP_STATUS.UNAUTHORIZED);
    }
   

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear temporary flags
    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        isTemporaryPassword: false,
        passwordExpiresAt: null
      }
    });

    Logger.info(`First login password changed for user: ${user.email}`);

    return { success: true, message: 'Password changed successfully. You can now use your new password.' };
  } catch (error) {
    Logger.error('Change password first login error', error);
    throw error;
  }
}
}
export default AuthService;

