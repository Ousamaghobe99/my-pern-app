
import prisma from '../config/database.js';
import Logger from '../utils/logger.js';

class ScheduleService {
  /**
   * Get calendar events (maintenance and movements) for a given date range.
   * @param {Date} startDate - The start of the date range.
   * @param {Date} endDate - The end of the date range.
   * @returns {Promise<Array>} A formatted list of calendar events.
   */
  static async getScheduleEvents(startDate, endDate) {
    try {
      // Fetch both maintenance tickets and movement logs in parallel
      const [maintenanceTickets, movementLogs] = await Promise.all([
        // Fetch maintenance tickets with a scheduledDate in the range
        prisma.maintenanceTicket.findMany({
          where: {
            scheduledDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
            description: true,
            status: true,
            priority: true,
            scheduledDate: true,
            interface: {
              select: { interfaceName: true, serialNumber: true },
            },
          },
        }),
        // Fetch interface movements with a movementDate in the range
        prisma.interfaceMovementLog.findMany({
          where: {
            movementDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
            reason: true,
            movementDate: true,
            interface: {
              select: { interfaceName: true, serialNumber: true },
            },
            fromLocation: { select: { name: true } },
            toLocation: { select: { name: true } },
          },
        }),
      ]);

      // Format maintenance tickets into a standard event structure
      const maintenanceEvents = maintenanceTickets.map(ticket => ({
        id: `maint-${ticket.id}`,
        title: `Maintenance: ${ticket.interface.interfaceName || ticket.interface.serialNumber}`,
        start: ticket.scheduledDate,
        end: ticket.scheduledDate, // Or calculate an end time if applicable
        type: 'maintenance',
        details: {
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
        },
      }));

      // Format movement logs into a standard event structure
      const movementEvents = movementLogs.map(log => ({
        id: `move-${log.id}`,
        title: `Move: ${log.interface.interfaceName || log.interface.serialNumber}`,
        start: log.movementDate,
        end: log.movementDate,
        type: 'movement',
        details: {
          reason: log.reason,
          from: log.fromLocation.name,
          to: log.toLocation.name,
        },
      }));

      // Combine and return the events
      return [...maintenanceEvents, ...movementEvents];

    } catch (error) {
      Logger.error('Get schedule events error', error);
      throw error;
    }
  }
}

export default ScheduleService;