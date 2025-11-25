import { Request } from 'express';

// Get client IP address
export const getClientIP = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string) || 
         (req.headers['x-real-ip'] as string) || 
         req.socket.remoteAddress || 
         'unknown';
};

// Get user agent
export const getUserAgent = (req: Request): string => {
  return req.headers['user-agent'] || 'unknown';
};

// Parse user agent string
export const parseUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  let version = 'Unknown';
  
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome';
    const match = ua.match(/chrome\/([\d.]+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    const match = ua.match(/firefox\/([\d.]+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = ua.match(/version\/([\d.]+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.includes('edg')) {
    browser = 'Edge';
    const match = ua.match(/edg\/([\d.]+)/);
    version = match ? match[1] : 'Unknown';
  }

  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone')) {
    os = 'iOS';
  }

  // Device type detection
  let deviceType: 'desktop' | 'mobile' | 'tablet' | 'bot' = 'desktop';
  if (ua.includes('mobile')) {
    deviceType = 'mobile';
  } else if (ua.includes('tablet')) {
    deviceType = 'tablet';
  } else if (ua.includes('bot') || ua.includes('crawler')) {
    deviceType = 'bot';
  }

  // Platform
  let platform = 'Unknown';
  if (ua.includes('win')) {
    platform = 'Windows';
  } else if (ua.includes('mac')) {
    platform = 'Mac';
  } else if (ua.includes('linux')) {
    platform = 'Linux';
  } else if (ua.includes('android')) {
    platform = 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    platform = 'iOS';
  }

  return {
    browser,
    version,
    os,
    deviceType,
    platform
  };
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};