import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { connectDB } from './config/database.js';

// Route imports
import analyticsRoutes from './routes/analytics.routes.js';
import { analyticsMiddleware } from './middleware/analytics.middleware.js';
import authRoutes from './routes/auth.routes.js';
import filesRoutes from './routes/files.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import adminRoutes from './routes/admin.routes.js';
import publicRoutes from './routes/publicRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch(console.error);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(limiter);
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(analyticsMiddleware.trackVisit);
app.use(analyticsMiddleware.trackEngagement);
// Removed: app.use(analyticsMiddleware.trackAdvancedEvents);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Removed: app.use('/api/analytics/advanced', advancedAnalyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Portfolio Backend API',
    version: '1.0.0',
    phase: '1.3 - Authentication & Analytics',
    endpoints: {
      auth: '/api/auth',
      analytics: '/api/analytics',
      files: '/api/files',
      resume: '/api/resume',
      skills: '/api/skills',
      projects: '/api/projects',
      comments: '/api/comments',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Error handling for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});

export default app;