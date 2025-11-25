import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  // Comment Content
  content: string;
  
  // Relationships
  blog: mongoose.Types.ObjectId;
  author: {
    name: string;
    email: string;
    website?: string;
  };
  
  // Parent comment for replies
  parentComment?: mongoose.Types.ObjectId;
  replies: mongoose.Types.ObjectId[];
  
  // Moderation
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  isEdited: boolean;
  
  // Engagement
  likeCount: number;
  
  // Metadata
  userAgent?: string;
  ipAddress?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    },
    author: {
      name: {
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
      website: {
        type: String,
        trim: true
      }
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'spam', 'rejected'],
      default: 'pending'
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    likeCount: {
      type: Number,
      default: 0
    },
    userAgent: {
      type: String
    },
    ipAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CommentSchema.index({ blog: 1, createdAt: -1 });
CommentSchema.index({ status: 1 });
CommentSchema.index({ parentComment: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);