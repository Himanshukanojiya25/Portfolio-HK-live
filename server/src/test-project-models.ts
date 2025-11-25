import mongoose from 'mongoose';
import { connectDB } from './config/database.js';

// ✅ CORRECT PATHS - src/models se import karo
import './models/Project.model.js';
import './models/Skill.model.js';
import './models/Resume.model.js';
import './models/Experience.model.js';
import './models/Education.model.js';

async function testProjectModels() {
  console.log('🧪 Testing Project Models with Correct Imports...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Check registered models
    console.log('📋 1. Checking registered models:');
    
    const modelNames = mongoose.modelNames();
    console.log('   ✅ Registered models:', modelNames);
    
    if (modelNames.length === 0) {
      console.log('   ❌ No models registered');
      return;
    }

    // 2. Test Project Model
    console.log('\n🚀 2. Testing Project Model:');
    
    if (modelNames.includes('Project')) {
      const Project = mongoose.model('Project');
      
      const testProject = {
        title: 'Test Project',
        description: 'Test description',
        shortDescription: 'Test short',
        category: 'web',
        status: 'completed',
        techStack: ['React'],
        featuredImage: 'test.jpg',
        startDate: new Date(),
        current: false,
        features: ['Feature 1'],
        isPublic: true
      };

      const project = await Project.create(testProject);
      console.log('   ✅ Test project created');

      const projects = await Project.find({});
      console.log('   ✅ Total projects:', projects.length);

      await Project.deleteMany({});
      console.log('   ✅ Cleaned up');
    }

    console.log('\n🎉 TEST COMPLETED! ✅');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the test
testProjectModels();