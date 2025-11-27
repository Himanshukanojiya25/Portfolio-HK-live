import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

console.log('🔐 JWT Secret loaded:', JWT_SECRET ? 'Yes' : 'No');

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
    
    try {
      // @ts-ignore
      const token = jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRE,
        issuer: 'portfolio-admin',
        audience: 'portfolio-app'
      });
      
      console.log('✅ Token generated successfully for:', payload.email);
      return token;
    } catch (error) {
      console.error('❌ Token generation error:', error);
      throw new Error('Failed to generate token');
    }
  },

  verifyToken: (token: string): JwtPayload => {
    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      
      if (!token || token === 'null' || token === 'undefined') {
        throw new Error('Token is empty or invalid');
      }

      console.log('🔍 Verifying token:', token.substring(0, 20) + '...');
      
      // @ts-ignore
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'portfolio-admin',
        audience: 'portfolio-app'
      }) as JwtPayload;
      
      console.log('✅ Token verified successfully for:', decoded.email);
      return decoded;
    } catch (error: any) {
      console.error('❌ Token verification failed:', {
        error: error.message,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 10)
      });
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token format');
      } else {
        throw new Error('Token verification failed: ' + error.message);
      }
    }
  },

  extractToken: (authHeader: string | undefined): string | null => {
    try {
      if (!authHeader) {
        console.log('❌ No authorization header provided');
        return null;
      }

      console.log('🔍 Authorization header:', authHeader.substring(0, 50) + '...');

      // ✅ SUPPORT MULTIPLE TOKEN FORMATS:
      
      // 1. Bearer Token format: "Bearer eyJhbGciOiJ..."
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token && token !== 'null' && token !== 'undefined') {
          console.log('✅ Extracted Bearer token');
          return token;
        }
      }
      
      // 2. Direct Token format: "eyJhbGciOiJ..."
      if (authHeader.length > 20 && !authHeader.includes(' ')) {
        console.log('✅ Using direct token format');
        return authHeader;
      }

      console.log('❌ No valid token found in header');
      return null;
    } catch (error) {
      console.error('❌ Token extraction error:', error);
      return null;
    }
  }
};

export default authUtils;