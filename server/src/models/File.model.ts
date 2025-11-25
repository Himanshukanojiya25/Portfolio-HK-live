import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  // File identification
  filename: string;
  originalName: string;
  description?: string;
  
  // Storage info
  storageProvider: 'cloudinary' | 'local' | 's3';
  publicId: string; // Cloudinary public ID or file path
  url: string;
  format: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  
  // File metadata
  size: number;
  width?: number;
  height?: number;
  duration?: number; // for videos
  
  // Categorization
  category: 'resume' | 'project' | 'certificate' | 'avatar' | 'other';
  tags: string[];
  
  // Access control
  isPublic: boolean;
  uploadedBy: mongoose.Types.ObjectId;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true
    },
    originalName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    storageProvider: {
      type: String,
      enum: ['cloudinary', 'local', 's3'],
      default: 'cloudinary'
    },
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw', 'auto'],
      default: 'image'
    },
    size: {
      type: Number,
      required: true
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    duration: {
      type: Number
    },
    category: {
      type: String,
      enum: ['resume', 'project', 'certificate', 'avatar', 'other'],
      required: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    isPublic: {
      type: Boolean,
      default: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better performance
FileSchema.index({ category: 1, createdAt: -1 });
FileSchema.index({ tags: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ isPublic: 1 });

// Virtual for file size in MB
FileSchema.virtual('sizeInMB').get(function() {
  return (this.size / (1024 * 1024)).toFixed(2);
});

// Ensure virtual fields are serialized
FileSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IFile>('File', FileSchema);