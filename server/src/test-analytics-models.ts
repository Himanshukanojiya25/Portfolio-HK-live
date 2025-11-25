import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import Visitor from './models/Visitor.model.js';
import Analytics from './models/Analytics.model.js';

async function testAnalyticsModels() {
  console.log('🧪 Testing Analytics Models...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Test Visitor Model
    console.log('📊 1. Testing Visitor Model:');
    
    // Create a test visitor
    const testVisitor = new Visitor({
      sessionId: 'test-session-123',
      visitorId: 'test-visitor-456',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Test)',
      url: '/test-page',
      timeOnPage: 30,
      scrollDepth: 75,
      firstVisit: true
    });

    await testVisitor.save();
    console.log('   ✅ Test visitor created');

    // Test static method
    const stats = await Visitor.getVisitorStats();
    console.log('   ✅ Visitor stats:', stats);

    // 2. Test Analytics Model
    console.log('\n📈 2. Testing Analytics Model:');
    
    const testAnalytics = new Analytics({
      date: new Date(),
      totalVisits: 100,
      uniqueVisitors: 75,
      returningVisitors: 25,
      devices: {
        desktop: 60,
        mobile: 35,
        tablet: 5,
        bot: 0
      },
      avgTimeOnSite: 120,
      bounceRate: 45
    });

    await testAnalytics.save();
    console.log('   ✅ Test analytics created');

    // Cleanup test data
    await Visitor.deleteOne({ sessionId: 'test-session-123' });
    await Analytics.deleteOne({ _id: testAnalytics._id });
    console.log('\   ✅ Test data cleaned up');

    console.log('\n🎉 All analytics model tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
}

// Run the test
testAnalyticsModels();