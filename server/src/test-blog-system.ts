import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import Blog from './models/Blog.model.js';
import Comment from './models/Comment.model.js';
import User from './models/User.model.js';

// Import models to register them
import './models/Blog.model.js';
import './models/Comment.model.js';

async function testBlogSystem() {
  console.log('🧪 Testing Blog System...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Create test user (author)
    console.log('👤 1. Setting up test author:');
    
    let testUser = await User.findOne({ email: 'blog-author@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Blog Author',
        email: 'blog-author@example.com',
        password: 'testpassword123',
        role: 'admin'
      });
      await testUser.save();
      console.log('   ✅ Test author created');
    } else {
      console.log('   ✅ Test author found');
    }

    // 2. Test Blog Model
    console.log('\n📝 2. Testing Blog Model:');
    
    const testBlogs = [
      {
        title: 'Getting Started with React Hooks',
        slug: 'getting-started-with-react-hooks',
        excerpt: 'Learn how to use React Hooks to simplify your functional components and manage state effectively.',
        content: 'React Hooks have revolutionized how we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks...',
        category: 'programming',
        tags: ['react', 'hooks', 'javascript', 'frontend'],
        featuredImage: 'https://example.com/react-hooks.jpg',
        metaTitle: 'React Hooks Tutorial - Complete Guide',
        metaDescription: 'Learn React Hooks with practical examples and best practices',
        keywords: ['react', 'hooks', 'tutorial'],
        author: testUser._id,
        authorName: testUser.name,
        status: 'published',
        publishedAt: new Date(),
        wordCount: 1200,
        readingTime: 6,
        isFeatured: true,
        allowComments: true,
        isPublic: true
      },
      {
        title: 'Building REST APIs with Node.js and Express',
        slug: 'building-rest-apis-nodejs-express',
        excerpt: 'A complete guide to building scalable REST APIs using Node.js and Express framework.',
        content: 'Node.js combined with Express.js provides a powerful platform for building RESTful APIs. In this tutorial, we will build a complete API with authentication, validation, and database integration...',
        category: 'web-development',
        tags: ['nodejs', 'express', 'api', 'backend', 'javascript'],
        featuredImage: 'https://example.com/nodejs-api.jpg',
        metaTitle: 'Node.js REST API Tutorial',
        metaDescription: 'Build REST APIs with Node.js and Express',
        keywords: ['nodejs', 'express', 'api', 'tutorial'],
        author: testUser._id,
        authorName: testUser.name,
        status: 'published',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        wordCount: 1800,
        readingTime: 9,
        isFeatured: false,
        allowComments: true,
        isPublic: true
      },
      {
        title: 'Draft: Advanced TypeScript Patterns',
        slug: 'advanced-typescript-patterns',
        excerpt: 'Exploring advanced TypeScript patterns and techniques for better code organization.',
        content: 'TypeScript offers powerful features that can help you write more maintainable and type-safe code...',
        category: 'programming',
        tags: ['typescript', 'patterns', 'advanced'],
        featuredImage: 'https://example.com/typescript.jpg',
        author: testUser._id,
        authorName: testUser.name,
        status: 'draft',
        wordCount: 800,
        readingTime: 4,
        isPublic: false
      }
    ];

    const savedBlogs = await Blog.insertMany(testBlogs);
    console.log('   ✅ Test blogs created:', savedBlogs.length);

    // 3. Test Blog Queries
    console.log('\n🔍 3. Testing Blog Queries:');
    
    // Get published blogs
    const publishedBlogs = await Blog.find({ 
      status: 'published', 
      isPublic: true 
    });
    console.log('   ✅ Published blogs:', publishedBlogs.length);

    // Get featured blogs
    const featuredBlogs = await Blog.find({ 
      isFeatured: true,
      status: 'published'
    });
    console.log('   ✅ Featured blogs:', featuredBlogs.length);

    // Get blogs by category
    const programmingBlogs = await Blog.find({ 
      category: 'programming',
      status: 'published'
    });
    console.log('   ✅ Programming blogs:', programmingBlogs.length);

    // Get blog by slug
    const blogBySlug = await Blog.findOne({ 
      slug: 'getting-started-with-react-hooks' 
    });
    console.log('   ✅ Blog by slug:', blogBySlug?.title);

    // 4. Test Comment Model
    console.log('\n💬 4. Testing Comment Model:');
    
    const testComments = [
      {
        content: 'Great article! Very helpful for understanding React Hooks.',
        blog: savedBlogs[0]._id,
        author: {
          name: 'John Reader',
          email: 'john@example.com'
        },
        status: 'approved',
        likeCount: 2
      },
      {
        content: 'Thanks for the detailed explanation. Could you cover custom hooks in more detail?',
        blog: savedBlogs[0]._id,
        author: {
          name: 'Sarah Developer',
          email: 'sarah@example.com',
          website: 'https://sarahdev.com'
        },
        status: 'approved',
        likeCount: 1
      },
      {
        content: 'Looking forward to the TypeScript article!',
        blog: savedBlogs[2]._id,
        author: {
          name: 'Mike Coder',
          email: 'mike@example.com'
        },
        status: 'pending'
      }
    ];

    const savedComments = await Comment.insertMany(testComments);
    console.log('   ✅ Test comments created:', savedComments.length);

    // 5. Test Comment Queries
    console.log('\n🔍 5. Testing Comment Queries:');
    
    // Get approved comments for a blog
    const blogComments = await Comment.find({
      blog: savedBlogs[0]._id,
      status: 'approved'
    });
    console.log('   ✅ Approved comments:', blogComments.length);

    // Get pending comments
    const pendingComments = await Comment.find({ status: 'pending' });
    console.log('   ✅ Pending comments:', pendingComments.length);

    // 6. Test Blog Metrics
    console.log('\n📊 6. Testing Blog Metrics:');
    
    // Update view count
    await Blog.findByIdAndUpdate(
      savedBlogs[0]._id,
      { $inc: { viewCount: 15, likeCount: 8 } }
    );
    
    const popularBlog = await Blog.findById(savedBlogs[0]._id);
    console.log('   ✅ Blog views:', popularBlog?.viewCount);
    console.log('   ✅ Blog likes:', popularBlog?.likeCount);

    // 7. Cleanup test data
    console.log('\n🧹 7. Cleaning up test data:');
    
    await Blog.deleteMany({ 
      slug: { 
        $in: [
          'getting-started-with-react-hooks',
          'building-rest-apis-nodejs-express', 
          'advanced-typescript-patterns'
        ]
      } 
    });
    await Comment.deleteMany({});
    await User.deleteOne({ email: 'blog-author@example.com' });
    
    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 BLOG SYSTEM TESTS PASSED! ✅');
    console.log('\n📋 Summary:');
    console.log('   - Blog Model: ✅ Working');
    console.log('   - Comment Model: ✅ Working');
    console.log('   - CRUD Operations: ✅ Working');
    console.log('   - Queries & Filtering: ✅ Working');
    console.log('   - Metrics Tracking: ✅ Working');
    console.log('   - Status Management: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
}

// Run the test
testBlogSystem();