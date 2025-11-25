import { Request, Response } from 'express';
import User from '../models/User.model.js';
import authUtils from '../utils/auth.utils.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import bcrypt from 'bcryptjs';

export const authController = {
  // Register new admin
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

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

      // Generate token
      const token = authUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  },

  // Login admin - ULTRA SIMPLE VERSION
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

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
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // ✅ SIMPLE PASSWORD CHECK - Direct bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate token
      const token = authUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });

    } catch (error: any) {
      console.error('Login error:', error);
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
      res.status(200).json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile'
      });
    }
  }
};

export default authController;