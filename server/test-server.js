import express from 'express';
import cors from 'cors';
import config from './src/config/env.js';
import ResponseHelper from './src/utils/responseHelper.js';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  ResponseHelper.success(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  }, 'Server is healthy');
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const { default: prisma } = await import('./src/config/database.js');
    await prisma.$connect();
    const userCount = await prisma.user.count();
    
    ResponseHelper.success(res, {
      connected: true,
      userCount
    }, 'Database connection successful');
  } catch (error) {
    ResponseHelper.error(res, `Database connection failed: ${error.message}`, 500);
  }
});

// Start server
const port = config.port || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${port}`);
});

