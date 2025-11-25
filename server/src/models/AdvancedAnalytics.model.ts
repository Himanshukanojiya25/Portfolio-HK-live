import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvancedAnalytics extends Document {
  // Date reference
  date: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  
  // Enhanced Visitor Metrics
  totalVisits: number;
  uniqueVisitors: number;
  returningVisitors: number;
  newVisitors: number;
  
  // Engagement Metrics
  avgSessionDuration: number; // in seconds
  bounceRate: number; // percentage
  pagesPerSession: number;
  conversionRate: number;
  
  // Traffic Sources
  trafficSources: {
    direct: number;
    organic: number;
    referral: number;
    social: number;
    email: number;
    paid: number;
  };
  
  // Geographic Data
  topCountries: Array<{
    country: string;
    visits: number;
    uniqueVisitors: number;
  }>;
  
  topCities: Array<{
    city: string;
    country: string;
    visits: number;
  }>;
  
  // Device & Technology
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
    other: number;
  };
  
  browsers: Array<{
    browser: string;
    version: string;
    visits: number;
    marketShare: number;
  }>;
  
  operatingSystems: Array<{
    os: string;
    version: string;
    visits: number;
  }>;
  
  // Page Performance
  topPages: Array<{
    url: string;
    title: string;
    visits: number;
    avgTimeOnPage: number;
    exitRate: number;
  }>;
  
  entryPages: Array<{
    url: string;
    title: string;
    visits: number;
  }>;
  
  exitPages: Array<{
    url: string;
    title: string;
    exits: number;
  }>;
  
  // User Behavior
  userFlow: Array<{
    path: string[];
    visits: number;
    dropOffRate: number;
  }>;
  
  // Custom Events
  customEvents: Array<{
    category: string;
    action: string;
    label?: string;
    value?: number;
    count: number;
  }>;
  
  // Performance Metrics
  performance: {
    avgPageLoadTime: number;
    avgServerResponseTime: number;
    errors: number;
    uptime: number;
  };
  
  // Business Metrics
  businessMetrics: {
    leads: number;
    contacts: number;
    projectViews: number;
    blogViews: number;
    resumeDownloads: number;
    socialShares: number;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AdvancedAnalyticsSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      required: true,
      index: true
    },
    totalVisits: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    returningVisitors: {
      type: Number,
      default: 0
    },
    newVisitors: {
      type: Number,
      default: 0
    },
    avgSessionDuration: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    pagesPerSession: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    trafficSources: {
      direct: { type: Number, default: 0 },
      organic: { type: Number, default: 0 },
      referral: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      email: { type: Number, default: 0 },
      paid: { type: Number, default: 0 }
    },
    topCountries: [{
      country: String,
      visits: Number,
      uniqueVisitors: Number
    }],
    topCities: [{
      city: String,
      country: String,
      visits: Number
    }],
    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    browsers: [{
      browser: String,
      version: String,
      visits: Number,
      marketShare: Number
    }],
    operatingSystems: [{
      os: String,
      version: String,
      visits: Number
    }],
    topPages: [{
      url: String,
      title: String,
      visits: Number,
      avgTimeOnPage: Number,
      exitRate: Number
    }],
    entryPages: [{
      url: String,
      title: String,
      visits: Number
    }],
    exitPages: [{
      url: String,
      title: String,
      exits: Number
    }],
    userFlow: [{
      path: [String],
      visits: Number,
      dropOffRate: Number
    }],
    customEvents: [{
      category: String,
      action: String,
      label: String,
      value: Number,
      count: Number
    }],
    performance: {
      avgPageLoadTime: { type: Number, default: 0 },
      avgServerResponseTime: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      uptime: { type: Number, default: 100 }
    },
    businessMetrics: {
      leads: { type: Number, default: 0 },
      contacts: { type: Number, default: 0 },
      projectViews: { type: Number, default: 0 },
      blogViews: { type: Number, default: 0 },
      resumeDownloads: { type: Number, default: 0 },
      socialShares: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for efficient querying
AdvancedAnalyticsSchema.index({ date: 1, period: 1 });
AdvancedAnalyticsSchema.index({ period: 1, date: -1 });

export default mongoose.model<IAdvancedAnalytics>('AdvancedAnalytics', AdvancedAnalyticsSchema);