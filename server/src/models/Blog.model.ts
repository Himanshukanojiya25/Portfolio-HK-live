import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  // Basic Information
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  
  // Categorization
  category: 'technology' | 'programming' | 'web-development' | 'mobile' | 'ai-ml' | 'career' | 'tutorial' | 'other';
  tags: string[];
  
  // Media
  featuredImage: string;
  images: string[];
  
  // SEO & Metadata
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  // Author Information
  author: mongoose.Types.ObjectId;
  authorName: string;
  
  // Publishing
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  scheduledAt?: Date;
  
  // Content Statistics
  readingTime: number; // in minutes
  wordCount: number;
  
  // Engagement Metrics
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // Social Media
  socialMediaLinks: {
    twitter?: string;
    linkedin?: string;
    devTo?: string;
    medium?: string;
  };
  
  // Settings
  isFeatured: boolean;
  allowComments: boolean;
  isPublic: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['technology', 'programming', 'web-development', 'mobile', 'ai-ml', 'career', 'tutorial', 'other'],
      required: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    featuredImage: {
      type: String,
      required: true
    },
    images: [{
      type: String
    }],
    metaTitle: {
      type: String,
      maxlength: 200
    },
    metaDescription: {
      type: String,
      maxlength: 300
    },
    keywords: [{
      type: String,
      trim: true
    }],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: {
      type: Date
    },
    scheduledAt: {
      type: Date
    },
    readingTime: {
      type: Number,
      default: 0
    },
    wordCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    socialMediaLinks: {
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      devTo: { type: String, trim: true },
      medium: { type: String, trim: true }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isFeatured: 1, publishedAt: -1 });
BlogSchema.index({ author: 1, publishedAt: -1 });

// // Calculate reading time and word count before save
// BlogSchema.pre('save', function(next) {
//   // Calculate word count
//   this.wordCount = this.content.split(/\s+/).length;
  
//   // Calculate reading time (average 200 words per minute)
//   this.readingTime = Math.ceil(this.wordCount / 200);
  
//   // Set publishedAt if status changes to published
//   if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
//     this.publishedAt = new Date();
//   }
  
//   next();
// });

export default mongoose.model<IBlog>('Blog', BlogSchema);