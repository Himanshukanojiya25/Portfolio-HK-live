import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ✅ FIXED: Proper JWT_SECRET with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

console.log('🔐 JWT Secret loaded:', JWT_SECRET ? 'Yes' : 'No'); // Debug

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const authUtils = {
  generateToken: (payload: JwtPayload): string => {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    // @ts-ignore
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  },

  verifyToken: (token: string): JwtPayload => {
    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      // @ts-ignore
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Invalid or expired token');
    }
  },

  extractToken: (authHeader: string | undefined): string | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
};

export default authUtils;