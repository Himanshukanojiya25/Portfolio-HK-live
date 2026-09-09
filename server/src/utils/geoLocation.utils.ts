import axios from 'axios';
import geoip from 'geoip-lite';
import { Request } from 'express';

export interface GeoLocation {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export class GeoLocationService {
  private static cache = new Map<string, GeoLocation>();
  
  static async getLocation(ip: string): Promise<Partial<GeoLocation>> {
    try {
      // Check cache first
      if (this.cache.has(ip)) {
        return this.cache.get(ip)!;
      }

      // Local IPs or localhost
      if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        const localData = {
          country: 'Local',
          countryCode: 'LOCAL',
          city: 'Local Network',
          lat: 0,
          lon: 0,
          timezone: 'UTC',
          isp: 'Local Network'
        };
        this.cache.set(ip, localData as GeoLocation);
        return localData;
      }

      // Try geoip-lite first (offline, fast)
      const geo = geoip.lookup(ip);
      if (geo) {
        const geoData = {
          country: geo.country,
          countryCode: geo.country,
          region: geo.region,
          city: geo.city,
          lat: geo.ll?.[0] || 0,
          lon: geo.ll?.[1] || 0,
          timezone: geo.timezone,
          metro: geo.metro,
          area: geo.area,
          range: geo.range
        };
        this.cache.set(ip, geoData as GeoLocation);
        return geoData;
      }

      // Fallback to IP-API (free service)
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, {
        timeout: 5000
      });

      if (response.data.status === 'success') {
        const apiData: GeoLocation = {
          country: response.data.country,
          countryCode: response.data.countryCode,
          region: response.data.region,
          regionName: response.data.regionName,
          city: response.data.city,
          zip: response.data.zip,
          lat: response.data.lat,
          lon: response.data.lon,
          timezone: response.data.timezone,
          isp: response.data.isp,
          org: response.data.org,
          as: response.data.as,
          query: response.data.query
        };
        this.cache.set(ip, apiData);
        return apiData;
      }

      // Return minimal data if all fails
      const fallbackData = {
        country: 'Unknown',
        countryCode: 'UNK',
        city: 'Unknown'
      };
      this.cache.set(ip, fallbackData as GeoLocation);
      return fallbackData;

    } catch (error) {
      console.error('Geo location error:', error);
      return {
        country: 'Unknown',
        countryCode: 'UNK',
        city: 'Unknown'
      };
    }
  }

  static getClientIP(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    } else if (Array.isArray(xForwardedFor)) {
      return xForwardedFor[0].trim();
    }
    return req.socket.remoteAddress || req.ip || '127.0.0.1';
  }

  static getUserAgentInfo(userAgent: string): {
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    deviceType: string;
    platform: string;
  } {
    const ua = userAgent.toLowerCase();
    
    // Browser detection
    let browser = 'Unknown';
    let browserVersion = '';
    
    if (ua.includes('chrome') && !ua.includes('chromium')) {
      browser = 'Chrome';
      const match = ua.match(/chrome\/([\d.]+)/);
      browserVersion = match ? match[1] : '';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
      const match = ua.match(/firefox\/([\d.]+)/);
      browserVersion = match ? match[1] : '';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      browser = 'Safari';
      const match = ua.match(/version\/([\d.]+)/);
      browserVersion = match ? match[1] : '';
    } else if (ua.includes('edge')) {
      browser = 'Edge';
      const match = ua.match(/edge\/([\d.]+)/);
      browserVersion = match ? match[1] : '';
    } else if (ua.includes('opera') || ua.includes('opr')) {
      browser = 'Opera';
      const match = ua.match(/(?:opera|opr)\/([\d.]+)/);
      browserVersion = match ? match[1] : '';
    }
    
    // OS detection
    let os = 'Unknown';
    let osVersion = '';
    let deviceType = 'desktop';
    
    if (ua.includes('windows')) {
      os = 'Windows';
      const match = ua.match(/windows nt ([\d.]+)/);
      osVersion = match ? match[1] : '';
    } else if (ua.includes('mac os')) {
      os = 'macOS';
      const match = ua.match(/mac os x ([\d._]+)/);
      osVersion = match ? match[1].replace(/_/g, '.') : '';
    } else if (ua.includes('linux')) {
      os = 'Linux';
    } else if (ua.includes('android')) {
      os = 'Android';
      deviceType = 'mobile';
      const match = ua.match(/android ([\d.]+)/);
      osVersion = match ? match[1] : '';
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
      os = 'iOS';
      deviceType = ua.includes('ipad') ? 'tablet' : 'mobile';
      const match = ua.match(/os ([\d_]+)/);
      osVersion = match ? match[1].replace(/_/g, '.') : '';
    }
    
    // Platform
    const platform = ua.includes('mobile') ? 'mobile' : 'desktop';
    
    // Check for bots
    if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
      deviceType = 'bot';
    }
    
    return {
      browser,
      browserVersion,
      os,
      osVersion,
      deviceType,
      platform
    };
  }
}