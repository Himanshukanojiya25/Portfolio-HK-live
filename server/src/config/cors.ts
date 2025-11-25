import { CorsOptions } from 'cors';
import { config } from './environment.js';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.server.clientUrl,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://yourdomain.com', // Replace with your actual domain
    ];

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Auth-Token',
    'X-API-Key',
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'X-Total-Count',
  ],
  maxAge: 86400, // 24 hours
};

// Development CORS options (more permissive)
const devCorsOptions: CorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

// ✅ FIXED: Use isProduction from config.server
export const corsConfig = config.server.env === 'production' ? corsOptions : devCorsOptions;
export default corsConfig;