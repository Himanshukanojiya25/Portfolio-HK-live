import { Request, Response, NextFunction } from 'express';
import authUtils from '../utils/auth.utils.js';
import UserModel from '../models/User.model.js'; // ✅ Import as UserModel
import mongoose from 'mongoose';
import { IUser } from '../models/User.model.js'; // ✅ Import IUser interface

export interface AuthRequest extends Request {
  user?: IUser; // ✅ Use IUser interface
}

// Individual middleware functions
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('\n========== 🛡️ AUTH MIDDLEWARE START ==========');
    console.log('📝 Request URL:', req.url);
    console.log('📝 Request Method:', req.method);
    
    let token: string | null = null;

    // Get token from header
    if (req.headers.authorization) {
      console.log('📋 Authorization Header Present');
      token = authUtils.extractToken(req.headers.authorization);
      
      if (token) {
        console.log('✅ Token extracted successfully');
        console.log('🔐 Token length:', token.length);
        console.log('🔐 Token preview:', token.substring(0, 30) + '...');
      } else {
        console.log('❌ Failed to extract token from header');
      }
    } else {
      console.log('❌ No Authorization header found');
    }

    // Also check x-auth-token header
    if (!token && req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'] as string;
      console.log('✅ Token from x-auth-token header');
    }

    if (!token) {
      console.log('❌ NO TOKEN PROVIDED IN REQUEST');
      console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // STEP 1: Verify JWT Token
    console.log('\n🔍 STEP 1: Verifying JWT Token...');
    let decoded;
    try {
      decoded = authUtils.verifyToken(token);
      console.log('✅ JWT Token verified successfully');
      console.log('📋 Token payload:', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      });
    } catch (verifyError: any) {
      console.error('❌ JWT Token verification FAILED:', verifyError.message);
      console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
      return res.status(401).json({
        success: false,
        message: verifyError.message || 'Invalid token.'
      });
    }

    // STEP 2: Validate MongoDB ObjectId
    console.log('\n🔍 STEP 2: Validating User ID...');
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      console.log('❌ INVALID MongoDB ObjectId format:', decoded.userId);
      console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
      return res.status(401).json({
        success: false,
        message: 'Invalid user ID in token.'
      });
    }
    
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    console.log('✅ Valid ObjectId:', userId.toString());

    // STEP 3: Find User in Database
    console.log('\n🔍 STEP 3: Searching user in database...');
    console.log('📋 Searching by _id:', userId);
    
    let user = await UserModel.findById(userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found by _id, trying email...');
      console.log('📋 Searching by email:', decoded.email);
      
      // Fallback: Try to find by email
      user = await UserModel.findOne({ email: decoded.email }).select('-password');
      
      if (!user) {
        console.log('❌ User not found by email either');
        console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
        return res.status(401).json({
          success: false,
          message: 'User account not found.'
        });
      }
      
      console.log('⚠️ Found user by email but _id mismatch');
      console.log('Token userId:', userId.toString());
      console.log('Database _id:', user._id.toString());
    } else {
      console.log('✅ User found by _id:', user.email);
    }

    // STEP 4: Check Account Status
    console.log('\n🔍 STEP 4: Checking account status...');
    console.log('📋 User isActive:', user.isActive);
    console.log('📋 User role:', user.role);
    
    if (!user.isActive) {
      console.log('❌ User account is INACTIVE');
      console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    // STEP 5: Grant Access
    console.log('\n✅ STEP 5: Authentication SUCCESSFUL');
    console.log('👤 Authenticated user:', {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    
    req.user = user;
    console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
    next();
    
  } catch (error: any) {
    console.error('\n❌ AUTH MIDDLEWARE UNEXPECTED ERROR:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.log('========== 🛡️ AUTH MIDDLEWARE END ==========\n');
    return res.status(500).json({
      success: false,
      message: 'Authentication server error.'
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('\n========== 🔒 ROLE CHECK START ==========');
    
    if (!req.user) {
      console.log('❌ No user in request');
      console.log('========== 🔒 ROLE CHECK END ==========\n');
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    console.log('👤 Current user:', {
      email: req.user.email,
      role: req.user.role
    });
    console.log('🔒 Required roles:', roles);

    if (!roles.includes(req.user.role)) {
      console.log('❌ INSUFFICIENT PERMISSIONS');
      console.log('❌ User role:', req.user.role);
      console.log('❌ Required roles:', roles);
      console.log('========== 🔒 ROLE CHECK END ==========\n');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    console.log('✅ Role check PASSED');
    console.log('========== 🔒 ROLE CHECK END ==========\n');
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
      try {
        const decoded = authUtils.verifyToken(token);
        
        if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
          const userId = new mongoose.Types.ObjectId(decoded.userId);
          const user = await UserModel.findById(userId).select('-password');
          
          if (user && user.isActive) {
            req.user = user;
            console.log('✅ Optional auth - User added:', user.email);
          }
        }
      } catch (error) {
        console.log('⚠️ Optional auth token invalid, continuing without user');
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