import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  // Basic Information
  title: string;
  description: string;
  shortDescription: string;
  
  // Project Details
  category: 'web' | 'mobile' | 'desktop' | 'ai-ml' | 'iot' | 'other';
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'showcase';
  
  // Technical Details
  technologies: mongoose.Types.ObjectId[];
  techStack: string[]; // Simple array for quick filtering
  repositoryUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  
  // Media
  featuredImage: string;
  images: string[];
  videoUrl?: string;
  
  // Timeline
  startDate: Date;
  endDate?: Date;
  current: boolean;
  
  // Team & Collaboration
  teamSize?: number;
  teamMembers?: string[];
  client?: string;
  
  // Content
  features: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
  
  // Metrics
  viewCount: number;
  likeCount: number;
  downloadCount: number;
  
  // Settings
  isPublic: boolean;
  isFeatured: boolean;
  displayOrder: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200
    },
    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'ai-ml', 'iot', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned', 'archived'],
      default: 'completed'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'showcase'],
      default: 'medium'
    },
    technologies: [{
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }],
    techStack: [{
      type: String,
      trim: true
    }],
    repositoryUrl: {
      type: String,
      trim: true
    },
    liveUrl: {
      type: String,
      trim: true
    },
    documentationUrl: {
      type: String,
      trim: true
    },
    featuredImage: {
      type: String,
      required: true
    },
    images: [{
      type: String
    }],
    videoUrl: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    teamSize: {
      type: Number,
      min: 1
    },
    teamMembers: [{
      type: String,
      trim: true
    }],
    client: {
      type: String,
      trim: true
    },
    features: [{
      type: String,
      trim: true
    }],
    challenges: [{
      type: String,
      trim: true
    }],
    solutions: [{
      type: String,
      trim: true
    }],
    learnings: [{
      type: String,
      trim: true
    }],
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ isFeatured: 1, displayOrder: 1 });
ProjectSchema.index({ priority: 1, createdAt: -1 });
ProjectSchema.index({ isPublic: 1 });
ProjectSchema.index({ techStack: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);