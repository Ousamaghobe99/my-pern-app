import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { ERROR_MESSAGES, PAGINATION  } from '../utils/constants.js';
import Logger from '../utils/logger.js';
import emailService from './emailService.js';
import crypto from 'crypto';

class UserService {
  // Get all users with pagination and filtering
  static async getAllUsers(options = {}) {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search,
        roleId,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const skip = (page - 1) * Math.min(limit, PAGINATION.MAX_LIMIT);
      const take = Math.min(limit, PAGINATION.MAX_LIMIT);

      // Build where clause
      const where = {};
      
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { matricule: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (roleId) {
        where.roleId = roleId;
      }

      // Build orderBy clause
      const orderBy = {};
      orderBy[sortBy] = sortOrder;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy,
          select: {
            id: true,
            matricule: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }),
        prisma.user.count({ where })
      ]);

      return {
        users,
        pagination: {
          page,
          limit: take,
          total,
          totalPages: Math.ceil(total / take)
        }
      };
    } catch (error) {
      Logger.error('Get all users error', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          matricule: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true,
              permissions: {
                select: {
                  permission: {
                    select: {
                      id: true,
                      name: true,
                      description: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Flatten permissions
      user.role.permissions = user.role.permissions.map(rp => rp.permission);

      return user;
    } catch (error) {
      Logger.error('Get user by ID error', error);
      throw error;
    }
  }

  // Create new user
  static async createUser(userData) {
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
        select: {
          id: true,
          matricule: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      Logger.info(`User created: ${newUser.email}`);

      return newUser;
    } catch (error) {
      Logger.error('Create user error', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id, updateData) {
    try {
      const { matricule, email, firstName, lastName, phoneNumber, roleId } = updateData;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Check if email already exists (if being updated)
      if (email && email !== existingUser.email) {
        const duplicateUser = await prisma.user.findUnique({
          where: { email }
        });

        if (duplicateUser) {
          throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        }
      }

      // Check if matricule already exists (if being updated)
      if (matricule && matricule !== existingUser.matricule) {
        const duplicateUser = await prisma.user.findUnique({
          where: { matricule }
        });

        if (duplicateUser) {
          throw new Error(ERROR_MESSAGES.MATRICULE_ALREADY_EXISTS);
        }
      }

      // Verify role exists (if being updated)
      if (roleId && roleId !== existingUser.roleId) {
        const role = await prisma.role.findUnique({
          where: { id: roleId }
        });

        if (!role) {
          throw new Error('Invalid role specified');
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          matricule,
          email,
          firstName,
          lastName,
          phoneNumber,
          roleId
        },
        select: {
          id: true,
          matricule: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      Logger.info(`User updated: ${updatedUser.email}`);

      return updatedUser;
    } catch (error) {
      Logger.error('Update user error', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              usageLogs: true,
              reportedTickets: true,
              assignedTickets: true,
              maintenanceLogs: true,
              interfaceMovementLogs: true
            }
          }
        }
      });

      if (!existingUser) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Check if user has related records
      const hasRelatedRecords = 
        existingUser._count.usageLogs > 0 ||
        existingUser._count.reportedTickets > 0 ||
        existingUser._count.assignedTickets > 0 ||
        existingUser._count.maintenanceLogs > 0 ||
        existingUser._count.interfaceMovementLogs > 0;

      if (hasRelatedRecords) {
        throw new Error('Cannot delete user with existing activity records');
      }

      await prisma.user.delete({
        where: { id }
      });

      Logger.info(`User deleted: ${id}`);

      return { success: true };
    } catch (error) {
      Logger.error('Delete user error', error);
      throw error;
    }
  }

  // Get all roles (for dropdown lists)
  static async getAllRoles() {
    try {
      const roles = await prisma.role.findMany({
        select: {
          id: true,
          name: true,
          description: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return roles;
    } catch (error) {
      Logger.error('Get all roles error', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStatistics() {
    try {
      const [
        totalUsers,
        roleDistribution,
        recentUsers
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.groupBy({
          by: ['roleId'],
          _count: { roleId: true }
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        })
      ]);

      // Get role names for distribution
      const roleIds = roleDistribution.map(rd => rd.roleId);
      const roles = await prisma.role.findMany({
        where: { id: { in: roleIds } },
        select: { id: true, name: true }
      });

      const roleDistributionWithNames = roleDistribution.map(rd => ({
        roleId: rd.roleId,
        roleName: roles.find(r => r.id === rd.roleId)?.name || 'Unknown',
        count: rd._count.roleId
      }));

      return {
        total: totalUsers,
        recentUsers,
        roleDistribution: roleDistributionWithNames
      };
    } catch (error) {
      Logger.error('Get user statistics error', error);
      throw error;
    }
  }
// Get user by matricule
static async getUserByMatricule(matricule) {
  try {
    const user = await prisma.user.findUnique({
      where: { matricule },
      select: {
        id: true,
        matricule: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    description: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Flatten permissions like in getUserById
    user.role.permissions = user.role.permissions.map(rp => rp.permission);

    return user;
  } catch (error) {
    Logger.error('Get user by matricule error', error);
    throw error;
  }
}


}

export default UserService;

