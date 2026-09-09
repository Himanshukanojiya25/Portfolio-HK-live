// fixProjects.js (ES Module version)
import { MongoClient } from 'mongodb';

async function fixProjects() {
  const uri = 'mongodb://localhost:27017/portfolio';
  const client = new MongoClient(uri);

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));

    const projectsCollection = db.collection('projects');
    const allProjects = await projectsCollection.find({}).toArray();
    
    console.log(`📊 Total projects: ${allProjects.length}`);
    
    // Fix missing isPublic
    const result = await projectsCollection.updateMany(
      { isPublic: { $exists: false } },
      { $set: { isPublic: true } }
    );
    
    console.log(`✅ Fixed ${result.modifiedCount} projects`);
    
    // Show all projects
    const updatedProjects = await projectsCollection.find({}).toArray();
    console.log('\n📋 ALL PROJECTS:');
    updatedProjects.forEach(p => {
      console.log(`- ${p.title}: isPublic = ${p.isPublic}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

fixProjects();