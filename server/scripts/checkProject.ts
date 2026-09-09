import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkProject() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');
    
    const projectsCollection = db.collection('projects');
    
    // Find all projects with their fields
    const projects = await projectsCollection.find({}).toArray();
    
    console.log(`📊 Found ${projects.length} projects:\n`);
    
    projects.forEach((project, index) => {
      console.log(`=== Project ${index + 1} ===`);
      console.log(`ID: ${project._id}`);
      console.log(`Title: ${project.title}`);
      console.log(`isPublic: ${project.isPublic}`);
      console.log(`isFeatured: ${project.isFeatured}`);
      console.log(`displayOrder: ${project.displayOrder}`);
      console.log(`category: ${project.category}`);
      console.log(`status: ${project.status}`);
      console.log(`techStack: ${JSON.stringify(project.techStack)}`);
      console.log('---\n');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
  }
}

checkProject();