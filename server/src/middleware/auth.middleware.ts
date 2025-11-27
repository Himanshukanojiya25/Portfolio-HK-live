import { Request, Response, NextFunction } from 'express';
import authUtils from '../utils/auth.utils.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  user?: any;
}

// Individual middleware functions
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('🛡️ Auth Middleware - Checking authentication...');
    
    let token: string | null = null;

    // Get token from header
    if (req.headers.authorization) {
      token = authUtils.extractToken(req.headers.authorization);
      console.log('🔐 Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');
    }

    // Also check x-auth-token header
    if (!token && req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'] as string;
      console.log('🔐 Token from x-auth-token:', token.substring(0, 20) + '...');
    }

    if (!token) {
      console.log('❌ No token provided in request');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    console.log('🔍 Verifying token...');
    const decoded = authUtils.verifyToken(token);
    console.log('✅ Token decoded:', { userId: decoded.userId, email: decoded.email });

    // Convert string userId to ObjectId for MongoDB query
    let userId;
    try {
      if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
        userId = new mongoose.Types.ObjectId(decoded.userId);
      } else {
        console.log('❌ Invalid user ID format in token');
        return res.status(401).json({
          success: false,
          message: 'Invalid token format.'
        });
      }
    } catch (error) {
      console.log('❌ User ID conversion error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid user ID in token.'
      });
    }

    // Check if user still exists
    console.log('👤 Finding user by ID:', userId);
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    // Grant access to protected route
    req.user = user;
    console.log('✅ Authentication successful for:', user.email);
    next();
  } catch (error: any) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token.'
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log('❌ Insufficient permissions:', req.user.role, 'needed:', roles);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    console.log('✅ Role check passed:', req.user.role);
    next();
  };
};

export const optional = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | null = null;

    if (req.headers.authorization) {
      token = authUtils.extractToken(req.headers.authorization);
    }

    if (token) {
      const decoded = authUtils.verifyToken(token);
      
      if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
        const userId = new mongoose.Types.ObjectId(decoded.userId);
        const user = await User.findById(userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
          console.log('✅ Optional auth - User added:', user.email);
        }
      }
    }

    next();
  } catch (error) {
    console.log('⚠️ Optional auth failed, continuing without user');
    next();
  }
};

// Combined middleware object
export const authMiddleware = {
  protect,
  restrictTo,
  optional
};

export default authMiddleware;