import { Request, Response, NextFunction } from 'express';
import authUtils from '../utils/auth.utils.js';
import User from '../models/User.model.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = {
  // Protect routes - require authentication
  protect: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let token: string | null = null;

      // Get token from header
      if (req.headers.authorization) {
        token = authUtils.extractToken(req.headers.authorization);
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      // Verify token
      const decoded = authUtils.verifyToken(token);

      // Check if user still exists
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated.'
        });
      }

      // ✅ FIXED: Simple lock check without isLocked method
      if (user.lockUntil && user.lockUntil > new Date()) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked. Please try again later.'
        });
      }

      // Grant access to protected route
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  },

  // Restrict to specific roles
  restrictTo: (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Please log in.'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }

      next();
    };
  },

  // Optional auth - doesn't fail if no token, but adds user if available
  optional: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let token: string | null = null;

      if (req.headers.authorization) {
        token = authUtils.extractToken(req.headers.authorization);
      }

      if (token) {
        const decoded = authUtils.verifyToken(token);
        const user = await User.findById(decoded.userId).select('-password');
        
        // ✅ FIXED: Simple lock check without isLocked method
        if (user && user.isActive && (!user.lockUntil || user.lockUntil <= new Date())) {
          req.user = user;
        }
      }

      next();
    } catch (error) {
      // Don't fail for optional auth, just continue without user
      next();
    }
  }
};

export default authMiddleware;