import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function updateAllProjects() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const db = mongoose.connection.db;
        if (!db)
            throw new Error('Database connection not established');
        const projectsCollection = db.collection('projects');
        // Check total projects
        const totalProjects = await projectsCollection.countDocuments();
        console.log(`📊 Total projects in database: ${totalProjects}`);
        // Add isPublic: true to all projects where it doesn't exist
        const updateResult = await projectsCollection.updateMany({ isPublic: { $exists: false } }, { $set: { isPublic: true } });
        console.log(`✅ Updated ${updateResult.modifiedCount} projects with isPublic: true`);
        // Add isFeatured: false where missing
        const featuredResult = await projectsCollection.updateMany({ isFeatured: { $exists: false } }, { $set: { isFeatured: false } });
        console.log(`⭐ Updated ${featuredResult.modifiedCount} projects with isFeatured: false`);
        // Add displayOrder: 0 where missing
        const orderResult = await projectsCollection.updateMany({ displayOrder: { $exists: false } }, { $set: { displayOrder: 0 } });
        console.log(`🔢 Updated ${orderResult.modifiedCount} projects with displayOrder: 0`);
        // Verify
        const publicProjects = await projectsCollection.countDocuments({ isPublic: true });
        const nonPublicProjects = await projectsCollection.countDocuments({ isPublic: false });
        console.log('\n📋 Final Stats:');
        console.log(`   ✅ Public projects: ${publicProjects}`);
        console.log(`   ❌ Non-public projects: ${nonPublicProjects}`);
        console.log(`   📝 Total: ${publicProjects + nonPublicProjects}`);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
    finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
}
updateAllProjects();
//# sourceMappingURL=updateProjects.js.map