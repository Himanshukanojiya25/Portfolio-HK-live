import mongoose from 'mongoose';
import User from '../src/models/User.model.ts';
import dotenv from 'dotenv';
dotenv.config();
async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'himanshukanojiya27@gmail.com' });
        if (existingAdmin) {
            console.log('✅ Admin already exists:', existingAdmin.email);
            return;
        }
        // Create admin
        const admin = await User.create({
            name: 'Himanshu',
            email: 'himanshukanojiya27@gmail.com',
            password: 'Himanshu@2500',
            role: 'admin'
        });
        console.log('✅ Admin user created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: Himanshu@2500');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}
createAdmin();
//# sourceMappingURL=createAdmin.js.map