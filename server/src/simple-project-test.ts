import mongoose from 'mongoose';
import { connectDB } from './config/database.js';

async function simpleProjectTest() {
  console.log('🧪 Simple Project System Test...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Simple check
    console.log('📊 1. Checking database connection:');
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }
    
    console.log('   ✅ Database instance available');

    // 2. Check collections
    console.log('\n📁 2. Checking collections:');
    
    try {
      const projectsCount = await mongoose.connection.collection('projects').countDocuments();
      console.log('   ✅ Projects collection - Count:', projectsCount);
    } catch (error) {
      console.log('   ❌ Projects collection not found');
    }
    
    try {
      const skillsCount = await mongoose.connection.collection('skills').countDocuments();
      console.log('   ✅ Skills collection - Count:', skillsCount);
    } catch (error) {
      console.log('   ❌ Skills collection not found');
    }

    // 3. Test models
    console.log('\n🚀 3. Testing models:');
    
    const modelNames = mongoose.modelNames();
    console.log('   ✅ Registered models:', modelNames);

    console.log('\n🎉 BASIC CHECK COMPLETED! ✅');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the test
simpleProjectTest();