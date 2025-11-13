import cors from 'cors';
import config from '../config/env.js';

// Parse the comma-separated string from config.corsOrigin into an array.
// This allows supporting multiple origins (e.g., default port 80 and a specific dev port).
const allowedOrigins = config.corsOrigin
  .split(',')
  .map(s => s.trim()) // Remove any whitespace
  .filter(s => s.length > 0); // Remove empty strings

const corsOptions = {
  origin: (origin, callback) => {
    // 1️⃣ Allow requests with no origin (e.g., same-origin from Nginx/Docker, curl, Postman)
    if (!origin) return callback(null, true);

    // 2️⃣ Allow if the requested origin is found in the list of allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // 3️⃣ Reject all other origins (this is where your error was thrown)
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // 4️⃣ Handle preflight requests properly
  preflightContinue: false,      // respond immediately to OPTIONS
  optionsSuccessStatus: 204      // ensures older browsers get correct response
};

export default cors(corsOptions);
