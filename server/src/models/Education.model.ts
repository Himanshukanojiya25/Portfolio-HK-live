import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  // Institution Information
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  institutionWebsite?: string;
  institutionLogo?: string;
  
  // Education Details
  startDate: Date;
  endDate?: Date;
  current: boolean;
  grade?: string;
  scale?: string;
  
  // Description
  description?: string;
  courses: string[];
  achievements: string[];
  
  // Metadata
  isActive: boolean;
  displayOrder: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema: Schema = new Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    institutionWebsite: {
      type: String,
      trim: true
    },
    institutionLogo: {
      type: String, // URL to logo image
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
    grade: {
      type: String,
      trim: true
    },
    scale: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    courses: [{
      type: String,
      trim: true
    }],
    achievements: [{
      type: String,
      trim: true
    }],
    isActive: {
      type: Boolean,
      default: true
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

// Indexes
EducationSchema.index({ startDate: -1 });
EducationSchema.index({ institution: 1 });

export default mongoose.model<IEducation>('Education', EducationSchema);