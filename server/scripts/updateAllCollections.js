import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function updateAllCollections() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const db = mongoose.connection.db;
        if (!db)
            throw new Error('Database connection failed');
        // Update Projects
        const projects = await db.collection('projects').updateMany({ isPublic: { $exists: false } }, { $set: { isPublic: true, isFeatured: false, displayOrder: 0 } });
        console.log(`✅ Projects updated: ${projects.modifiedCount}`);
        // Update Skills
        const skills = await db.collection('skills').updateMany({ isPublic: { $exists: false } }, { $set: { isPublic: true, order: 0 } });
        console.log(`💡 Skills updated: ${skills.modifiedCount}`);
        // Update Testimonials
        const testimonials = await db.collection('testimonials').updateMany({ isPublic: { $exists: false } }, { $set: { isPublic: true } });
        console.log(`🌟 Testimonials updated: ${testimonials.modifiedCount}`);
        console.log('\n🎉 All collections updated successfully!');
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await mongoose.disconnect();
        console.log('🔌 Connection closed');
        process.exit(0);
    }
}
updateAllCollections();
//# sourceMappingURL=updateAllCollections.js.map