import mongoose, { Schema, Document } from 'mongoose';

export interface IEndorsement extends Document {
  // Endorsement Details
  skill: mongoose.Types.ObjectId;
  endorsedBy: mongoose.Types.ObjectId;
  endorserName: string;
  endorserEmail: string;
  endorserRelation: 'colleague' | 'manager' | 'client' | 'peer' | 'other';
  
  // Endorsement Content
  message?: string;
  rating: number; // 1-5 stars
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const EndorsementSchema: Schema = new Schema(
  {
    skill: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },
    endorsedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    endorserName: {
      type: String,
      required: true,
      trim: true
    },
    endorserEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    endorserRelation: {
      type: String,
      enum: ['colleague', 'manager', 'client', 'peer', 'other'],
      required: true
    },
    message: {
      type: String,
      maxlength: 500
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
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

// Indexes
EndorsementSchema.index({ skill: 1, status: 1 });
EndorsementSchema.index({ endorsedBy: 1 });
EndorsementSchema.index({ status: 1, createdAt: -1 });

// Compound index for unique endorsements per skill by user
EndorsementSchema.index({ skill: 1, endorsedBy: 1 }, { unique: true });

export default mongoose.model<IEndorsement>('Endorsement', EndorsementSchema);