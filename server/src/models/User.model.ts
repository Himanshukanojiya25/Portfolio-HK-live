import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean; // ✅ ADD THIS
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  isActive: { // ✅ ADD THIS FIELD
    type: Boolean,
    default: true // ✅ Automatically active
  }
}, {
  timestamps: true
});

// Password hashing
UserSchema.pre('save', async function(this: IUser) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;