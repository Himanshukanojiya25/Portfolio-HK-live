import { config, isProduction, isDevelopment } from './config/environment.js';
import corsConfig from './config/cors.js';
import cloudinaryUtils from './config/cloudinary.js';

console.log('🚀 Testing Phase 2 Configuration...\n');

// 1. Environment Config Test
console.log('📋 1. Environment Configuration:');
console.log('   - NODE_ENV:', config.server.env);
console.log('   - PORT:', config.server.port);
console.log('   - Client URL:', config.server.clientUrl);
console.log('   - MongoDB:', config.database.uri ? '✅ Configured' : '❌ Missing');
console.log('   - JWT Secret:', config.auth.jwtSecret ? '✅ Configured' : '❌ Missing');
console.log('   - Email:', config.email.user ? '✅ Configured' : '❌ Missing');
console.log('   - Cloudinary:', config.cloudinary.isConfigured ? '✅ Configured' : '❌ Not Configured');
console.log('   - Analytics Retention:', config.analytics.retentionDays + ' days');

// 2. CORS Config Test
console.log('\n🌐 2. CORS Configuration:');
console.log('   - CORS Config:', corsConfig.origin ? '✅ Loaded' : '❌ Failed');

// 3. Cloudinary Test
console.log('\n☁️ 3. Cloudinary Configuration:');
console.log('   - Cloudinary:', cloudinaryUtils.isConfigured ? '✅ Configured' : '❌ Not Configured');

// 4. Environment Helpers Test
console.log('\n🔧 4. Environment Helpers:');
console.log('   - isProduction:', isProduction);
console.log('   - isDevelopment:', isDevelopment);

console.log('\n✅ Configuration Test Completed!');