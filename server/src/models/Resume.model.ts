import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
  };

  // Professional Details
  title: string;
  tagline: string;
  currentRole: string;
  
  // Resume Sections
  experiences: mongoose.Types.ObjectId[];
  educations: mongoose.Types.ObjectId[];
  skills: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  
  // Customization
  template: 'modern' | 'professional' | 'creative' | 'minimal';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  
  // Settings
  isPublic: boolean;
  isActive: boolean;
  lastUpdated: Date;
  
  // Analytics
  viewCount: number;
  downloadCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    personalInfo: {
      firstName: {
        type: String,
        required: true,
        trim: true
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      location: {
        type: String,
        required: true,
        trim: true
      },
      website: {
        type: String,
        trim: true
      },
      linkedin: {
        type: String,
        trim: true
      },
      github: {
        type: String,
        trim: true
      },
      summary: {
        type: String,
        required: true,
        maxlength: 1000
      }
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    currentRole: {
      type: String,
      required: true,
      trim: true
    },
    experiences: [{
      type: Schema.Types.ObjectId,
      ref: 'Experience'
    }],
    educations: [{
      type: Schema.Types.ObjectId,
      ref: 'Education'
    }],
    skills: [{
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }],
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }],
    template: {
      type: String,
      enum: ['modern', 'professional', 'creative', 'minimal'],
      default: 'modern'
    },
    theme: {
      primaryColor: {
        type: String,
        default: '#3B82F6'
      },
      secondaryColor: {
        type: String,
        default: '#1F2937'
      },
      fontFamily: {
        type: String,
        default: 'Inter'
      }
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    viewCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ResumeSchema.index({ isPublic: 1, isActive: 1 });
ResumeSchema.index({ 'personalInfo.email': 1 });

// ✅ SIMPLE SOLUTION: Remove pre-save middleware
// We'll handle lastUpdated in the service layer

export default mongoose.model<IResume>('Resume', ResumeSchema);