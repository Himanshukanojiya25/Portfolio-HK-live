import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisitor extends Document {
  // Basic identification
  sessionId: string;
  visitorId: string;
  
  // Location data
  ipAddress: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  
  // Device & Browser info
  userAgent: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet' | 'bot';
  platform?: string;
  
  // Page visit data
  url: string;
  referrer?: string;
  pageTitle?: string;
  
  // Engagement metrics
  timeOnPage: number;
  scrollDepth: number; // 0-100 percentage
  firstVisit: boolean;
  
  // Technical data
  screenResolution?: string;
  language?: string;
  
  // Timestamps
  visitTime: Date;
  leaveTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for static methods
interface IVisitorModel extends Model<IVisitor> {
  getVisitorStats(): Promise<{
    totalVisitors: number;
    uniqueVisitors: number;
    todayVisitors: number;
  }>;
}

const VisitorSchema: Schema<IVisitor> = new Schema(
  {
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
    region: {
      type: String
    },
    timezone: {
      type: String
    },
    userAgent: {
      type: String,
      required: true
    },
    browser: {
      type: String
    },
    browserVersion: {
      type: String
    },
    os: {
      type: String
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'bot'],
      default: 'desktop'
    },
    platform: {
      type: String
    },
    url: {
      type: String,
      required: true
    },
    referrer: {
      type: String
    },
    pageTitle: {
      type: String
    },
    timeOnPage: {
      type: Number,
      default: 0
    },
    scrollDepth: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    firstVisit: {
      type: Boolean,
      default: true
    },
    screenResolution: {
      type: String
    },
    language: {
      type: String
    },
    visitTime: {
      type: Date,
      default: Date.now
    },
    leaveTime: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
VisitorSchema.index({ visitorId: 1, visitTime: -1 });
VisitorSchema.index({ ipAddress: 1, visitTime: -1 });
VisitorSchema.index({ country: 1, visitTime: -1 });
VisitorSchema.index({ deviceType: 1, visitTime: -1 });
VisitorSchema.index({ visitTime: -1 });

// ✅ FIXED: Static method with proper typing
VisitorSchema.statics.getVisitorStats = async function (): Promise<{
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
}> {
  const totalVisitors = await this.countDocuments();
  
  // Use aggregation for unique visitors (more reliable)
  const uniqueVisitorsResult = await this.aggregate([
    {
      $group: {
        _id: '$visitorId'
      }
    },
    {
      $count: 'uniqueVisitors'
    }
  ]);
  
  const uniqueVisitors = uniqueVisitorsResult[0]?.uniqueVisitors || 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayVisitors = await this.countDocuments({
    visitTime: { $gte: today }
  });
  
  return {
    totalVisitors,
    uniqueVisitors,
    todayVisitors
  };
};

// ✅ FIXED: Export with proper Model typing
const Visitor: IVisitorModel = mongoose.model<IVisitor, IVisitorModel>('Visitor', VisitorSchema);
export default Visitor;