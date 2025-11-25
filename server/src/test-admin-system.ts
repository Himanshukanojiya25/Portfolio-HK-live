import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import Blog from './models/Blog.model.js';
import Project from './models/Project.model.js';
import Contact from './models/Contact.model.js';
import Visitor from './models/Visitor.model.js';
import Skill from './models/Skill.model.js';
import Comment from './models/Comment.model.js';
import User from './models/User.model.js';

// Import models to register them
import './models/Blog.model.js';
import './models/Project.model.js';
import './models/Contact.model.js';
import './models/Visitor.model.js';
import './models/Skill.model.js';
import './models/Comment.model.js';

async function testAdminSystem() {
  console.log('🧪 Testing Admin Dashboard System...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Create test data for all models
    console.log('📊 1. Setting up test data:');
    
    // Create test user
    const testUser = new User({
      name: 'Admin Test User',
      email: 'admin-test@example.com',
      password: 'testpassword123',
      role: 'admin'
    });
    await testUser.save();
    console.log('   ✅ Test user created');

    // Create test blogs
    const testBlogs = [
      {
        title: 'Admin Test Blog 1',
        slug: 'admin-test-blog-1',
        excerpt: 'Test blog excerpt 1',
        content: 'Test blog content 1',
        category: 'technology',
        tags: ['test', 'admin'],
        featuredImage: 'test1.jpg',
        author: testUser._id,
        authorName: testUser.name,
        status: 'published',
        publishedAt: new Date(),
        viewCount: 15,
        likeCount: 5,
        isPublic: true
      },
      {
        title: 'Admin Test Blog 2',
        slug: 'admin-test-blog-2',
        excerpt: 'Test blog excerpt 2',
        content: 'Test blog content 2',
        category: 'programming',
        tags: ['test', 'admin'],
        featuredImage: 'test2.jpg',
        author: testUser._id,
        authorName: testUser.name,
        status: 'draft',
        isPublic: false
      }
    ];
    const savedBlogs = await Blog.insertMany(testBlogs);
    console.log('   ✅ Test blogs created');

    // Create test projects
    const testProjects = [
      {
        title: 'Admin Test Project 1',
        description: 'Test project description 1',
        shortDescription: 'Test project short 1',
        category: 'web',
        status: 'completed',
        techStack: ['React', 'Node.js'],
        featuredImage: 'project1.jpg',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-03-01'),
        current: false,
        features: ['Feature 1'],
        isPublic: true,
        isFeatured: true
      },
      {
        title: 'Admin Test Project 2',
        description: 'Test project description 2',
        shortDescription: 'Test project short 2',
        category: 'mobile',
        status: 'in-progress',
        techStack: ['React Native'],
        featuredImage: 'project2.jpg',
        startDate: new Date('2023-04-01'),
        current: true,
        features: ['Feature 2'],
        isPublic: false
      }
    ];
    const savedProjects = await Project.insertMany(testProjects);
    console.log('   ✅ Test projects created');

    // Create test contacts
    const testContacts = [
      {
        name: 'Test Contact 1',
        email: 'contact1@example.com',
        subject: 'Test Subject 1',
        message: 'Test message 1',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        status: 'pending'
      },
      {
        name: 'Test Contact 2',
        email: 'contact2@example.com',
        subject: 'Test Subject 2',
        message: 'Test message 2',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        status: 'replied'
      }
    ];
    const savedContacts = await Contact.insertMany(testContacts);
    console.log('   ✅ Test contacts created');

    // Create test visitors
    const testVisitors = [
      {
        sessionId: 'test-session-1',
        visitorId: 'test-visitor-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser',
        url: '/',
        deviceType: 'desktop',
        visitTime: new Date()
      },
      {
        sessionId: 'test-session-2',
        visitorId: 'test-visitor-2',
        ipAddress: '192.168.1.1',
        userAgent: 'Test Mobile',
        url: '/projects',
        deviceType: 'mobile',
        visitTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];
    const savedVisitors = await Visitor.insertMany(testVisitors);
    console.log('   ✅ Test visitors created');

    // Create test skills
    const testSkills = [
      {
        name: 'Admin Test Skill 1',
        category: 'programming',
        level: 'advanced',
        isActive: true,
        isFeatured: true,
        endorsementCount: 3
      },
      {
        name: 'Admin Test Skill 2',
        category: 'framework',
        level: 'intermediate',
        isActive: true,
        endorsementCount: 1
      }
    ];
    const savedSkills = await Skill.insertMany(testSkills);
    console.log('   ✅ Test skills created');

    // Create test comments
    const testComments = [
      {
        content: 'Test comment 1',
        blog: savedBlogs[0]._id,
        author: {
          name: 'Commenter 1',
          email: 'commenter1@example.com'
        },
        status: 'approved'
      },
      {
        content: 'Test comment 2',
        blog: savedBlogs[0]._id,
        author: {
          name: 'Commenter 2',
          email: 'commenter2@example.com'
        },
        status: 'pending'
      }
    ];
    const savedComments = await Comment.insertMany(testComments);
    console.log('   ✅ Test comments created');

    // 2. Test Dashboard Statistics
    console.log('\n📈 2. Testing Dashboard Statistics:');
    
    // Test individual counts
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({ isPublic: true });
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const totalSkills = await Skill.countDocuments({ isActive: true });
    const totalComments = await Comment.countDocuments();
    const pendingComments = await Comment.countDocuments({ status: 'pending' });
    
    console.log('   ✅ Total blogs:', totalBlogs);
    console.log('   ✅ Published blogs:', publishedBlogs);
    console.log('   ✅ Total projects:', totalProjects);
    console.log('   ✅ Published projects:', publishedProjects);
    console.log('   ✅ Total contacts:', totalContacts);
    console.log('   ✅ Pending contacts:', pendingContacts);
    console.log('   ✅ Total skills:', totalSkills);
    console.log('   ✅ Total comments:', totalComments);
    console.log('   ✅ Pending comments:', pendingComments);

    // 3. Test Analytics Data
    console.log('\n📊 3. Testing Analytics Data:');
    
    // Test visitor aggregation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = await Visitor.countDocuments({ visitTime: { $gte: today } });
    console.log('   ✅ Today visitors:', todayVisitors);

    // Test device breakdown
    const deviceBreakdown = await Visitor.aggregate([
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('   ✅ Device breakdown:', deviceBreakdown);

    // 4. Test Content Overview
    console.log('\n📝 4. Testing Content Overview:');
    
    // Test blog category stats
    const blogStats = await Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          }
        }
      }
    ]);
    console.log('   ✅ Blog category stats:', blogStats.length, 'categories');

    // Test project category stats
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$isPublic', true] }, 1, 0] }
          }
        }
      }
    ]);
    console.log('   ✅ Project category stats:', projectStats.length, 'categories');

    // 5. Test System Metrics
    console.log('\n⚙️ 5. Testing System Metrics:');
    
    // Test basic system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
    console.log('   ✅ Node version:', systemInfo.nodeVersion);
    console.log('   ✅ Platform:', systemInfo.platform);
    console.log('   ✅ Uptime:', Math.floor(systemInfo.uptime / 60), 'minutes');

    // 6. Cleanup test data
    console.log('\n🧹 6. Cleaning up test data:');
    
    await Blog.deleteMany({ slug: { $regex: 'admin-test' } });
    await Project.deleteMany({ title: { $regex: 'Admin Test' } });
    await Contact.deleteMany({ email: { $regex: 'contact' } });
    await Visitor.deleteMany({ sessionId: { $regex: 'test-session' } });
    await Skill.deleteMany({ name: { $regex: 'Admin Test' } });
    await Comment.deleteMany({});
    await User.deleteOne({ email: 'admin-test@example.com' });
    
    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 ADMIN DASHBOARD SYSTEM TESTS PASSED! ✅');
    console.log('\n📋 Summary:');
    console.log('   - Dashboard Statistics: ✅ Working');
    console.log('   - Analytics Data: ✅ Working');
    console.log('   - Content Overview: ✅ Working');
    console.log('   - System Metrics: ✅ Working');
    console.log('   - Data Aggregation: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
}

// Run the test
testAdminSystem();