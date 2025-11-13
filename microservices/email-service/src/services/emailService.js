import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import EmailLog from '../models/EmailLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.initTransporter();
  }

  initTransporter() {
    // SMTP Configuration (Gmail example)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    logger.info('✓ Email transporter initialized');
  }

  async loadTemplate(templateName) {
    if (this.templates.has(templateName)) {
      return this.templates.get(templateName);
    }

    const templatePath = join(__dirname, '../templates', `${templateName}.hbs`);
    try {
      const templateContent = await readFile(templatePath, 'utf-8');
      const template = handlebars.compile(templateContent);
      this.templates.set(templateName, template);
      return template;
    } catch (error) {
      logger.error(`Template ${templateName} not found:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  async sendEmail({ to, subject, templateName, templateData, html, text, from, metadata }) {
    const emailLog = new EmailLog({
      to,
      from: from || process.env.FROM_EMAIL,
      subject,
      templateName,
      templateData,
      metadata,
      status: 'pending'
    });

    try {
      let emailHtml = html;
      let emailText = text;

      // If template is specified, render it
      if (templateName) {
        const template = await this.loadTemplate(templateName);
        emailHtml = template(templateData || {});
      }

      // Send email
      const info = await this.transporter.sendMail({
        from: from || `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html: emailHtml,
        text: emailText
      });

      // Update log
      emailLog.status = 'sent';
      emailLog.sentAt = new Date();
      emailLog.metadata = { ...emailLog.metadata, messageId: info.messageId };
      await emailLog.save();

      logger.info(`✓ Email sent successfully to ${to}`);
      return { success: true, messageId: info.messageId, logId: emailLog._id };

    } catch (error) {
      logger.error(`✗ Failed to send email to ${to}:`, error);
      
      emailLog.status = 'failed';
      emailLog.error = error.message;
      await emailLog.save();

      throw error;
    }
  }

  // Send welcome email with credentials
  async sendWelcomeWithCredentials(emailData) {
  const { to, firstName, lastName, matricule, temporaryPassword } = emailData;

    return await this.sendEmail({
      to,
      subject: `Welcome to ${process.env.APP_NAME}`,
      templateName: 'welcome-credentials',
      templateData: {
        firstName,
        lastName,
        matricule,
        email: to,
        temporaryPassword,
        loginUrl: `${process.env.APP_URL}/login`,
        appName: process.env.APP_NAME,
        year: new Date().getFullYear()
      },
      metadata: {
        type: 'welcome-credentials',
        matricule
      }
    });
  }
}

export default new EmailService();