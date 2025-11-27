import { Request, Response } from 'express';
import User from '../models/User.model.js';
import authUtils from '../utils/auth.utils.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const authController = {
  // Register new admin
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      console.log('👤 Registration attempt:', { email, name: name?.substring(0, 10) + '...' });

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: 'admin'
      });

      console.log('✅ User created:', user.email);

      // Generate token
      const token = authUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });

      console.log('✅ Token generated for:', user.email);

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          user: {
            id: user._id.toString(), // ✅ Ensure string ID
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });

    } catch (error: any) {
      console.error('❌ Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  },

  // Login admin
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      console.log('🔐 Login attempt:', email);

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log('✅ User found:', user.email);

      // Password check
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log('✅ Password valid for:', email);

      // Generate token
      const token = authUtils.generateToken({
        userId: user._id.toString(), // ✅ Convert to string
        email: user.email,
        role: user.role
      });

      console.log('✅ Token generated successfully');

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id.toString(), // ✅ Ensure string ID
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });

    } catch (error: any) {
      console.error('❌ Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  },

  // Get current user profile
  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      console.log('✅ Profile fetched for:', user.email);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('❌ Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile'
      });
    }
  },

  // Verify token endpoint
  verifyToken: async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required'
        });
      }

      const decoded = authUtils.verifyToken(token);
      
      res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: decoded
        }
      });
    } catch (error) {
      res.status(200).json({
        success: true,
        data: {
          valid: false,
          error: error.message
        }
      });
    }
  }
};

export default authController;