import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const parseIntEnv = (value, defaultValue) => (value ? parseInt(value, 10) : defaultValue);
const parseBoolEnv = (value, defaultValue) => (value ? value.toLowerCase() === 'true' : defaultValue);

const config = {
 nodeEnv: process.env.NODE_ENV || 'development',
 port: parseIntEnv(process.env.PORT, 5000),

 // Database
 database: {
 url: process.env.DATABASE_URL,
 user: process.env.DB_USER || 'postgres',
 password: process.env.DB_PASSWORD || '123456',
 name: process.env.DB_NAME || 'intrf',
 },

 // JWT
 jwt: {
 secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
 expiresIn: process.env.JWT_EXPIRES_IN || '7d',
 },

 // Rate limiting
 rateLimit: {
 windowMs: parseIntEnv(process.env.RATE_LIMIT_WINDOW_MS, 5 * 60 * 1000), // 5 min default
 maxRequests: parseIntEnv(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
 },

 // CORS - This must now be a comma-separated list of allowed origins
 corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5174', //

 // RabbitMQ
 rabbitmq: {
 url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
 emailQueue: process.env.EMAIL_QUEUE || 'email_queue',
 useQueue: parseBoolEnv(process.env.USE_EMAIL_QUEUE, true),
 },

 // App-specific
 app: {
 name: process.env.APP_NAME || 'Interface Management System',
 url: process.env.APP_URL || 'http://localhost:3000',
 },
};

export default config;
