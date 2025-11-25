import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
  // Date reference
  date: Date;
  
  // Visitor counts
  totalVisits: number;
  uniqueVisitors: number;
  returningVisitors: number;
  
  // Geographic data
  countries: Map<string, number>;
  cities: Map<string, number>;
  
  // Device data
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
    bot: number;
  };
  
  // Browser data
  browsers: Map<string, number>;
  
  // Page views
  pageViews: Map<string, number>;
  
  // Referrer data
  referrers: Map<string, number>;
  
  // Engagement metrics
  avgTimeOnSite: number;
  bounceRate: number;
  
  // Timestamp
  updatedAt: Date;
  createdAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    //   index: true
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
    countries: {
      type: Map,
      of: Number,
      default: {}
    },
    cities: {
      type: Map,
      of: Number,
      default: {}
    },
    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
      bot: { type: Number, default: 0 }
    },
    browsers: {
      type: Map,
      of: Number,
      default: {}
    },
    pageViews: {
      type: Map,
      of: Number,
      default: {}
    },
    referrers: {
      type: Map,
      of: Number,
      default: {}
    },
    avgTimeOnSite: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for date-based queries
AnalyticsSchema.index({ date: 1 });

// ✅ SIMPLE WORKING SOLUTION: Remove pre-save middleware temporarily
// We'll handle date normalization in the service layer

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);