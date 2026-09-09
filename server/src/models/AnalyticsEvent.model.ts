import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  // Event Basics
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'click', 'scroll', 'form_submit', 'download', 'video_play', 'exit', 'session_start', 'session_end']
  },
  eventCategory: String,
  eventAction: String,
  eventLabel: String,
  eventValue: Number,
  
  // Visitor Identification
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  
  // Page Information
  pageUrl: { type: String, required: true },
  pageTitle: String,
  previousPage: String,
  
  // Engagement Metrics
  timeOnPage: Number, // milliseconds
  scrollDepth: Number, // percentage (0-100)
  clicksCount: Number,
  
  // Technical Details
  userAgent: String,
  ipAddress: String,
  browser: String,
  browserVersion: String,
  os: String,
  osVersion: String,
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'bot'] },
  screenResolution: String,
  language: String,
  
  // Location Data
  country: String,
  countryCode: String,
  region: String,
  regionName: String,
  city: String,
  zip: String,
  lat: Number,
  lon: Number,
  timezone: String,
  isp: String,
  org: String,
  asn: String,
  
  // Performance
  pageLoadTime: Number,
  domLoadTime: Number,
  networkSpeed: String, // 4g, 3g, 2g, wifi
  
  // Custom Data
  customData: mongoose.Schema.Types.Mixed,
  
  // Timestamps
  timestamp: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for faster queries
analyticsEventSchema.index({ sessionId: 1, timestamp: -1 });
analyticsEventSchema.index({ visitorId: 1, timestamp: -1 });
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ country: 1, timestamp: -1 });
analyticsEventSchema.index({ deviceType: 1, timestamp: -1 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;