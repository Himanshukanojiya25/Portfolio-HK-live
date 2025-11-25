// Auth Constants
export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d'
};

// Role Constants
export const ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
} as const;

// Response Messages
export const MESSAGES = {
  AUTH: {
    NO_TOKEN: 'Access denied. No token provided.',
    INVALID_TOKEN: 'Invalid token.',
    USER_NOT_FOUND: 'User no longer exists.',
    ACCOUNT_LOCKED: 'Account is temporarily locked. Please try again later.',
    INSUFFICIENT_PERMISSIONS: 'Access denied. Insufficient permissions.',
    LOGIN_SUCCESS: 'Login successful.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    ACCOUNT_DEACTIVATED: 'Account has been deactivated.'
  }
};