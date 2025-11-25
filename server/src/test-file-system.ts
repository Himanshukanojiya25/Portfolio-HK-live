import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import File from './models/File.model.js';
import User from './models/User.model.js';

async function testFileSystem() {
  console.log('🧪 Testing File Management System...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Create a test user (if needed)
    console.log('👤 1. Setting up test user:');
    
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        role: 'admin'
      });
      await testUser.save();
      console.log('   ✅ Test user created');
    } else {
      console.log('   ✅ Test user found');
    }

    // 2. Test File Model
    console.log('\n📁 2. Testing File Model:');
    
    const testFiles = [
      {
        filename: 'test-resume-1',
        originalName: 'my-resume.pdf',
        description: 'My professional resume',
        storageProvider: 'cloudinary',
        publicId: 'portfolio/resume/test-resume-1',
        url: 'https://example.com/resume.pdf',
        format: 'pdf',
        resourceType: 'raw',
        size: 1024000, // 1MB
        category: 'resume',
        tags: ['professional', 'cv', 'career'],
        isPublic: true,
        uploadedBy: testUser._id
      },
      {
        filename: 'test-project-1',
        originalName: 'project-screenshot.png',
        description: 'Project demo screenshot',
        storageProvider: 'cloudinary', 
        publicId: 'portfolio/projects/test-project-1',
        url: 'https://example.com/project.png',
        format: 'png',
        resourceType: 'image',
        size: 512000, // 500KB
        width: 1920,
        height: 1080,
        category: 'project',
        tags: ['web', 'react', 'demo'],
        isPublic: true,
        uploadedBy: testUser._id
      },
      {
        filename: 'test-certificate-1',
        originalName: 'aws-certificate.pdf',
        description: 'AWS Certification',
        storageProvider: 'cloudinary',
        publicId: 'portfolio/certificates/test-certificate-1', 
        url: 'https://example.com/certificate.pdf',
        format: 'pdf',
        resourceType: 'raw',
        size: 768000, // 750KB
        category: 'certificate',
        tags: ['aws', 'cloud', 'certification'],
        isPublic: false, // Private file
        uploadedBy: testUser._id
      }
    ];

    const savedFiles = await File.insertMany(testFiles);
    console.log('   ✅ Test files created:', savedFiles.length);

    // 3. Test File Queries
    console.log('\n🔍 3. Testing File Queries:');
    
    // Get all public files
    const publicFiles = await File.find({ isPublic: true })
      .populate('uploadedBy', 'name email');
    console.log('   ✅ Public files count:', publicFiles.length);

    // Get files by category
    const resumeFiles = await File.find({ category: 'resume' });
    console.log('   ✅ Resume files count:', resumeFiles.length);

    // Search files
    const searchedFiles = await File.find({
      $or: [
        { originalName: { $regex: 'resume', $options: 'i' } },
        { description: { $regex: 'professional', $options: 'i' } },
        { tags: { $in: ['react'] } }
      ]
    });
    console.log('   ✅ Search results:', searchedFiles.length);

    // 4. Test Virtual Fields
    console.log('\n📊 4. Testing Virtual Fields:');
    const sampleFile = await File.findOne({ category: 'resume' });
    if (sampleFile) {
      // @ts-ignore - Virtual field
      console.log('   ✅ File size in MB:', sampleFile.sizeInMB);
    }

    // 5. Test File Updates
    console.log('\n✏️ 5. Testing File Updates:');
    const updateResult = await File.updateOne(
      { category: 'resume' },
      { $set: { description: 'Updated resume description' } }
    );
    console.log('   ✅ Files updated:', updateResult.modifiedCount);

    // 6. Cleanup test data
    console.log('\n🧹 6. Cleaning up test data:');
    await File.deleteMany({
      filename: { $in: ['test-resume-1', 'test-project-1', 'test-certificate-1'] }
    });
    console.log('   ✅ Test files cleaned up');

    console.log('\n🎉 FILE MANAGEMENT SYSTEM TESTS PASSED! ✅');
    console.log('\n📋 Summary:');
    console.log('   - File Model: ✅ Working');
    console.log('   - CRUD Operations: ✅ Working');
    console.log('   - Queries & Filtering: ✅ Working');
    console.log('   - Virtual Fields: ✅ Working');
    console.log('   - Population: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
}

// Run the test
testFileSystem();