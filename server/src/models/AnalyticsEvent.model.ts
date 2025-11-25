import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  // Event Identification
  eventType: 'page_view' | 'click' | 'scroll' | 'form_submit' | 'download' | 'share' | 'custom';
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  
  // Session & User Context
  sessionId: string;
  visitorId: string;
  userId?: mongoose.Types.ObjectId;
  
  // Page Context
  pageUrl: string;
  pageTitle: string;
  previousPage?: string;
  nextPage?: string;
  
  // User Context
  userAgent: string;
  ipAddress: string;
  country?: string;
  city?: string;
  language?: string;
  
  // Device Information
  screenResolution?: string;
  viewportSize?: string;
  colorDepth?: number;
  
  // Technical Data
  connectionType?: string;
  platform?: string;
  plugins?: string[];
  
  // Event Specific Data
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  scrollDepth?: number;
  formData?: any;
  
  // Performance Data
  pageLoadTime?: number;
  domReadyTime?: number;
  redirectTime?: number;
  
  // Timestamps
  createdAt: Date;
}

const AnalyticsEventSchema: Schema = new Schema(
  {
    eventType: {
      type: String,
      enum: ['page_view', 'click', 'scroll', 'form_submit', 'download', 'share', 'custom'],
      required: true
    },
    eventCategory: {
      type: String,
      required: true
    },
    eventAction: {
      type: String,
      required: true
    },
    eventLabel: {
      type: String
    },
    eventValue: {
      type: Number
    },
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    visitorId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    pageUrl: {
      type: String,
      required: true
    },
    pageTitle: {
      type: String,
      required: true
    },
    previousPage: {
      type: String
    },
    nextPage: {
      type: String
    },
    userAgent: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      required: true
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    language: {
      type: String
    },
    screenResolution: {
      type: String
    },
    viewportSize: {
      type: String
    },
    colorDepth: {
      type: Number
    },
    connectionType: {
      type: String
    },
    platform: {
      type: String
    },
    plugins: [{
      type: String
    }],
    elementId: {
      type: String
    },
    elementClass: {
      type: String
    },
    elementText: {
      type: String
    },
    scrollDepth: {
      type: Number,
      min: 0,
      max: 100
    },
    formData: {
      type: Schema.Types.Mixed
    },
    pageLoadTime: {
      type: Number
    },
    domReadyTime: {
      type: Number
    },
    redirectTime: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
AnalyticsEventSchema.index({ sessionId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ visitorId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ eventType: 1, createdAt: -1 });
AnalyticsEventSchema.index({ eventCategory: 1, eventAction: 1 });
AnalyticsEventSchema.index({ createdAt: -1 });

// TTL index to automatically remove old events (keep 6 months)
AnalyticsEventSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 6 * 30 * 24 * 60 * 60 // 6 months
});

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);