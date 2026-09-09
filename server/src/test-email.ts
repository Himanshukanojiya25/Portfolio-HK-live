import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Simple config load
dotenv.config();

async function testGmail() {
  console.log('🚀 Testing Gmail from server/src...\n');
  
  const emailUser = process.env.EMAIL_USER;
  let emailPass = process.env.EMAIL_PASS || '';
  
  console.log('📧 Email User:', emailUser);
  console.log('🔑 Original Password:', emailPass ? '****' + emailPass.slice(-4) : 'NOT SET');
  console.log('🔑 Original Length:', emailPass.length);
  
  // Remove spaces
  emailPass = emailPass.replace(/\s/g, '');
  console.log('🔑 Clean Password Length:', emailPass.length);
  
  if (emailPass.length !== 16) {
    console.log(`❌ ERROR: Need 16 chars, got ${emailPass.length}`);
    console.log('💡 Generate: https://myaccount.google.com/apppasswords');
    console.log('💡 Example: abcd efgh ijkl mnop → abcdefghijklmnop');
    return;
  }
  
  console.log('🔑 First 4 chars:', emailPass.substring(0, 4));
  
  try {
    // Test with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
    
    console.log('\n1. Testing connection...');
    await transporter.verify();
    console.log('✅ Connected to Gmail');
    
    console.log('\n2. Sending test...');
    const info = await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      subject: '✅ Portfolio Test',
      text: 'Test successful!',
      html: '<h2>Test Passed!</h2>'
    });
    
    console.log('🎉 SUCCESS! Email sent!');
    console.log('Message ID:', info.messageId);
    
  } catch (error: any) {
    console.error('\n❌ FAILED:', error.message);
    console.log('Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 PASSWORD ISSUE!');
      console.log('Current password length:', emailPass.length);
      console.log('\nSTEPS:');
      console.log('1. DELETE old password: https://myaccount.google.com/apppasswords');
      console.log('2. Generate NEW for "Mail"');
      console.log('3. Select "Windows Computer"');
      console.log('4. Copy 16-char code');
      console.log('5. Remove spaces, update .env');
    }
  }
}

// Run
testGmail();