import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env file'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB Connected Successfully');
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
}

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('📊 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📊 Mongoose disconnected');
});

// Close connection when app is terminated
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📊 MongoDB connection closed through app termination');
  process.exit(0);
});

export { connectDB, mongoose };