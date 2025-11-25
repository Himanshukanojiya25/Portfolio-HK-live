import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  // Company Information
  company: string;
  position: string;
  location: string;
  companyWebsite?: string;
  companyLogo?: string;
  
  // Employment Details
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  startDate: Date;
  endDate?: Date;
  current: boolean;
  
  // Role Description
  description: string;
  responsibilities: string[];
  technologies: string[];
  
  // Achievements
  achievements: string[];
  
  // Metadata
  isActive: boolean;
  displayOrder: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    companyWebsite: {
      type: String,
      trim: true
    },
    companyLogo: {
      type: String, // URL to logo image
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      default: 'full-time'
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
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    responsibilities: [{
      type: String,
      trim: true
    }],
    technologies: [{
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
ExperienceSchema.index({ startDate: -1 });
ExperienceSchema.index({ company: 1 });

// Validate end date if not current
// ExperienceSchema.pre('save', function(next) {
//   if (!this.current && !this.endDate) {
//     return next(new Error('End date is required for past experiences'));
//   }
//   if (this.current && this.endDate) {
//     return next(new Error('Current experiences cannot have an end date'));
//   }
//   next();
// });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);