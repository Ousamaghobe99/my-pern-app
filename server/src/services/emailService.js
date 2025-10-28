import rabbitmqService from './rabbitmqService.js';
import Logger from '../utils/logger.js';

class EmailService {
  constructor() {
    this.useQueue = process.env.USE_EMAIL_QUEUE !== 'false'; // Default to true
  }

  async queueEmail(emailData) {
    try {
      await rabbitmqService.publishEmail(emailData);
      Logger.info(`✓ Email queued to ${emailData.to}`);
      return { 
        success: true, 
        method: 'queue',
        message: 'Email queued successfully'
      };
    } catch (error) {
      Logger.error('Failed to queue email:', error.message);
      throw error;
    }
  }

  async sendWelcomeWithCredentials(user, temporaryPassword) {
    return await this.queueEmail({
      type: 'welcome-credentials',
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      matricule: user.matricule,
      temporaryPassword,
      userId: user.id,
      metadata: {
        userId: user.id,
        matricule: user.matricule,
        type: 'welcome-credentials',
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Create and export singleton instance
const emailService = new EmailService();

export default emailService;