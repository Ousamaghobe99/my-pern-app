import prisma from '../config/database.js';
import { ERROR_MESSAGES, PAGINATION  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class MaintenanceService {
  // Get all maintenance tickets with pagination and filtering
  static async getAllMaintenanceTickets(options = {}) {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search,
        status,
        type,
        priority,
        assignedToId,
        reportedById,
        interfaceId,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const skip = (page - 1) * Math.min(limit, PAGINATION.MAX_LIMIT);
      const take = Math.min(limit, PAGINATION.MAX_LIMIT);

      // Build where clause
      const where = {};
      
      if (search) {
        where.OR = [
          { description: { contains: search, mode: 'insensitive' } },
          { interface: { interfaceName: { contains: search, mode: 'insensitive' } } },
          { interface: { serialNumber: { equals: parseInt(search) || undefined } } }
        ];
      }

      if (status) {
        where.status = status;
      }

      if (type) {
        where.type = type;
      }

      if (priority) {
        where.priority = priority;
      }

      if (assignedToId) {
        where.assignedToId = assignedToId;
      }

      if (reportedById) {
        where.reportedById = reportedById;
      }

      if (interfaceId) {
        where.interfaceId = interfaceId;
      }

      // Build orderBy clause
      const orderBy = {};
      orderBy[sortBy] = sortOrder;

      const [tickets, total] = await Promise.all([
        prisma.maintenanceTicket.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            interface: {
              select: {
                id: true,
                interfaceName: true,
                serialNumber: true,
                type: true,
                status: true
              }
            },
            reportedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                matricule: true,
                email: true
              }
            },
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                matricule: true,
                email: true
              }
            },
            _count: {
              select: {
                logs: true
              }
            }
          }
        }),
        prisma.maintenanceTicket.count({ where })
      ]);

      return {
        tickets,
        pagination: {
          page,
          limit: take,
          total,
          totalPages: Math.ceil(total / take)
        }
      };
    } catch (error) {
      Logger.error('Get all maintenance tickets error', error);
      throw error;
    }
  }

  // Get maintenance ticket by ID
  static async getMaintenanceTicketById(id) {
    try {
      const ticket = await prisma.maintenanceTicket.findUnique({
        where: { id },
        include: {
          interface: {
            select: {
              id: true,
              interfaceName: true,
              serialNumber: true,
              type: true,
              status: true,
              currentLocation: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true,
              email: true
            }
          },
          logs: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  matricule: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!ticket) {
        throw new Error(ERROR_MESSAGES.MAINTENANCE_TICKET_NOT_FOUND);
      }

      return ticket;
    } catch (error) {
      Logger.error('Get maintenance ticket by ID error', error);
      throw error;
    }
  }

  // Create new maintenance ticket
  static async createMaintenanceTicket(ticketData) {
    try {
      const {
        interfaceId,
        type,
        description,
        priority,
        reportedById,
        assignedToId,
        scheduledDate
      } = ticketData;

      // Verify interface exists
      const interfaceData = await prisma.interface.findUnique({
        where: { id: interfaceId }
      });

      if (!interfaceData) {
        throw new Error(ERROR_MESSAGES.INTERFACE_NOT_FOUND);
      }

      // Verify reported by user exists
      const reportedBy = await prisma.user.findUnique({
        where: { id: reportedById }
      });

      if (!reportedBy) {
        throw new Error('Reported by user not found');
      }

      // Verify assigned to user exists (if provided)
      if (assignedToId) {
        const assignedTo = await prisma.user.findUnique({
          where: { id: assignedToId }
        });

        if (!assignedTo) {
          throw new Error('Assigned to user not found');
        }
      }

      const newTicket = await prisma.maintenanceTicket.create({
        data: {
          interfaceId,
          type,
          description,
          priority,
          reportedById,
          assignedToId,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null
        },
        include: {
          interface: {
            select: {
              id: true,
              interfaceName: true,
              serialNumber: true,
              type: true,
              status: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true,
              email: true
            }
          }
        }
      });

      Logger.info(`Maintenance ticket created: ${newTicket.id}`);

      return newTicket;
    } catch (error) {
      Logger.error('Create maintenance ticket error', error);
      throw error;
    }
  }

  // Update maintenance ticket
  static async updateMaintenanceTicket(id, updateData) {
    try {
      const {
        type,
        status,
        description,
        priority,
        assignedToId,
        scheduledDate,
        completedDate
      } = updateData;

      // Check if ticket exists
      const existingTicket = await prisma.maintenanceTicket.findUnique({
        where: { id }
      });

      if (!existingTicket) {
        throw new Error(ERROR_MESSAGES.MAINTENANCE_TICKET_NOT_FOUND);
      }

      // Verify assigned to user exists (if provided)
      if (assignedToId && assignedToId !== existingTicket.assignedToId) {
        const assignedTo = await prisma.user.findUnique({
          where: { id: assignedToId }
        });

        if (!assignedTo) {
          throw new Error('Assigned to user not found');
        }
      }

      const updatedTicket = await prisma.maintenanceTicket.update({
        where: { id },
        data: {
          type,
          status,
          description,
          priority,
          assignedToId,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
          completedDate: completedDate ? new Date(completedDate) : undefined
        },
        include: {
          interface: {
            select: {
              id: true,
              interfaceName: true,
              serialNumber: true,
              type: true,
              status: true
            }
          },
          reportedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true,
              email: true
            }
          }
        }
      });

      Logger.info(`Maintenance ticket updated: ${updatedTicket.id}`);

      return updatedTicket;
    } catch (error) {
      Logger.error('Update maintenance ticket error', error);
      throw error;
    }
  }

  // Delete maintenance ticket
  static async deleteMaintenanceTicket(id) {
    try {
      // Check if ticket exists
      const existingTicket = await prisma.maintenanceTicket.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              logs: true
            }
          }
        }
      });

      if (!existingTicket) {
        throw new Error(ERROR_MESSAGES.MAINTENANCE_TICKET_NOT_FOUND);
      }

      // Check if ticket has logs
      if (existingTicket._count.logs > 0) {
        throw new Error('Cannot delete maintenance ticket with existing logs');
      }

      await prisma.maintenanceTicket.delete({
        where: { id }
      });

      Logger.info(`Maintenance ticket deleted: ${id}`);

      return { success: true };
    } catch (error) {
      Logger.error('Delete maintenance ticket error', error);
      throw error;
    }
  }

  // Add log to maintenance ticket
  static async addMaintenanceLog(ticketId, logData) {
    try {
      const { userId, description, actionTaken } = logData;

      // Verify ticket exists
      const ticket = await prisma.maintenanceTicket.findUnique({
        where: { id: ticketId }
      });

      if (!ticket) {
        throw new Error(ERROR_MESSAGES.MAINTENANCE_TICKET_NOT_FOUND);
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const newLog = await prisma.maintenanceLog.create({
        data: {
          ticketId,
          userId,
          description,
          actionTaken
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              matricule: true
            }
          }
        }
      });

      Logger.info(`Maintenance log added to ticket: ${ticketId}`);

      return newLog;
    } catch (error) {
      Logger.error('Add maintenance log error', error);
      throw error;
    }
  }

  // Get maintenance statistics
  static async getMaintenanceStatistics() {
    try {
      const [
        totalTickets,
        statusCounts,
        typeCounts,
        priorityCounts,
        overdueCounts
      ] = await Promise.all([
        prisma.maintenanceTicket.count(),
        prisma.maintenanceTicket.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        prisma.maintenanceTicket.groupBy({
          by: ['type'],
          _count: { type: true }
        }),
        prisma.maintenanceTicket.groupBy({
          by: ['priority'],
          _count: { priority: true }
        }),
        prisma.maintenanceTicket.count({
          where: {
            scheduledDate: {
              lt: new Date()
            },
            status: {
              in: ['Open', 'InProgress']
            }
          }
        })
      ]);

      return {
        total: totalTickets,
        overdue: overdueCounts,
        byStatus: statusCounts.map(sc => ({
          status: sc.status,
          count: sc._count.status
        })),
        byType: typeCounts.map(tc => ({
          type: tc.type,
          count: tc._count.type
        })),
        byPriority: priorityCounts.map(pc => ({
          priority: pc.priority,
          count: pc._count.priority
        }))
      };
    } catch (error) {
      Logger.error('Get maintenance statistics error', error);
      throw error;
    }
  }
}

export default MaintenanceService;

