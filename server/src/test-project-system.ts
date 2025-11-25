import mongoose from 'mongoose';
import { connectDB } from './config/database.js';

async function simpleProjectTest() {
  console.log('🧪 Simple Project System Test...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Simple check - see if we can access models directly
    console.log('📊 1. Checking database connection:');
    
    // Get database instance
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }
    
    console.log('   ✅ Database instance available');

    // 2. Check collections (simple way)
    console.log('\n📁 2. Checking collections:');
    
    try {
      // Simple way to check collections
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

    // 3. Test basic operations
    console.log('\n🚀 3. Testing basic operations:');
    
    // Check if models are registered
    const modelNames = mongoose.modelNames();
    console.log('   ✅ Registered models:', modelNames);

    if (modelNames.includes('Project')) {
      console.log('   ✅ Project model is registered');
    } else {
      console.log('   ❌ Project model not registered');
    }
    
    if (modelNames.includes('Skill')) {
      console.log('   ✅ Skill model is registered');
    } else {
      console.log('   ❌ Skill model not registered');
    }

    console.log('\n🎉 BASIC PROJECT SYSTEM CHECK COMPLETED! ✅');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
}

// Run the test
simpleProjectTest();