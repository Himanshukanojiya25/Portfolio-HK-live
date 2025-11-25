import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Environment variables validation schema
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  
  // Database
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT Secret must be at least 32 characters'),
  JWT_EXPIRE: z.string().default('7d'),
  
  // Email
  EMAIL_SERVICE: z.string().default('gmail'),
  EMAIL_USER: z.string().email('Valid email required'),
  EMAIL_PASS: z.string().min(1, 'Email password required'),
  CONTACT_EMAIL: z.string().email().optional(),
  
  // Cloudinary (for file uploads)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Analytics
  ANALYTICS_RETENTION_DAYS: z.string().default('30'),
});

// Validate environment variables
const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
  console.error('❌ Environment variables validation failed:');
  envValidation.error.errors.forEach((error) => {
    console.error(`   - ${error.path}: ${error.message}`);
  });
  throw new Error('Environment variables validation failed');
}

// Export validated environment variables
export const env = envValidation.data;

// Environment check helper
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Configuration object
export const config = {
  server: {
    env: env.NODE_ENV,
    port: env.PORT,
    clientUrl: env.CLIENT_URL,
  },
  database: {
    uri: env.MONGODB_URI,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpire: env.JWT_EXPIRE,
  },
  email: {
    service: env.EMAIL_SERVICE,
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    contactEmail: env.CONTACT_EMAIL || env.EMAIL_USER,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    isConfigured: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
  },
  analytics: {
    retentionDays: parseInt(env.ANALYTICS_RETENTION_DAYS),
  },
};

export default config;