import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress: string;
  userAgent: string;
  status: 'pending' | 'replied' | 'spam';
  isRead: boolean;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [5000, 'Message cannot be more than 5000 characters']
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'replied', 'spam'],
      default: 'pending'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    repliedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

// ✅ TEMPORARY FIX: Pre-save middleware comment karo
// ContactSchema.pre('save', function (next) {
//   if (this.isModified('status') && this.status === 'replied' && !this.repliedAt) {
//     this.repliedAt = new Date();
//   }
//   next();
// });

export default mongoose.model<IContact>('Contact', ContactSchema);