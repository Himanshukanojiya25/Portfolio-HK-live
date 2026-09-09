import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  isApproved: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Role/Position is required'],
      trim: true,
      maxlength: [100, 'Role cannot be more than 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [100, 'Company cannot be more than 100 characters']
    },
    avatar: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
      maxlength: [1000, 'Testimonial cannot be more than 1000 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 5
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
TestimonialSchema.index({ isApproved: 1, featured: 1, createdAt: -1 });
TestimonialSchema.index({ rating: -1 });

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);