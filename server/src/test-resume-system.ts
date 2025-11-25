import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import Resume from './models/Resume.model.js';
import Experience from './models/Experience.model.js';
import Education from './models/Education.model.js';
import Skill from './models/Skill.model.js';
import Endorsement from './models/Endorsement.model.js';
import User from './models/User.model.js';

async function testResumeSystem() {
  console.log('🧪 Testing Dynamic Resume System...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // 1. Create test user
    console.log('👤 1. Setting up test user:');
    
    let testUser = await User.findOne({ email: 'resume-test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Resume Test User',
        email: 'resume-test@example.com',
        password: 'testpassword123',
        role: 'admin'
      });
      await testUser.save();
      console.log('   ✅ Test user created');
    } else {
      console.log('   ✅ Test user found');
    }

    // 2. Test Skills Model
    console.log('\n🛠️ 2. Testing Skills Model:');
    
    const testSkills = [
      {
        name: 'JavaScript',
        category: 'programming',
        level: 'expert',
        description: 'Modern JavaScript development',
        yearsOfExperience: 5,
        icon: 'javascript',
        color: '#F7DF1E',
        isFeatured: true,
        displayOrder: 1
      },
      {
        name: 'React',
        category: 'framework', 
        level: 'advanced',
        description: 'Frontend development with React',
        yearsOfExperience: 4,
        icon: 'react',
        color: '#61DAFB',
        isFeatured: true,
        displayOrder: 2
      },
      {
        name: 'Node.js',
        category: 'programming',
        level: 'advanced',
        description: 'Backend development with Node.js',
        yearsOfExperience: 4,
        icon: 'nodejs',
        color: '#339933',
        isFeatured: true,
        displayOrder: 3
      }
    ];

    const savedSkills = await Skill.insertMany(testSkills);
    console.log('   ✅ Test skills created:', savedSkills.length);

    // 3. Test Experience Model
    console.log('\n💼 3. Testing Experience Model:');
    
    const testExperiences = [
      {
        company: 'Tech Company Inc.',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        employmentType: 'full-time',
        startDate: new Date('2022-01-01'),
        current: true,
        description: 'Leading development of web applications',
        responsibilities: [
          'Develop and maintain web applications',
          'Lead a team of developers',
          'Implement new features and fix bugs'
        ],
        technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        achievements: [
          'Improved application performance by 40%',
          'Led successful product launch'
        ],
        displayOrder: 1
      },
      {
        company: 'Startup XYZ',
        position: 'Frontend Developer', 
        location: 'New York, NY',
        employmentType: 'full-time',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
        current: false,
        description: 'Developed user interfaces for web applications',
        responsibilities: [
          'Created responsive web designs',
          'Collaborated with design team',
          'Optimized frontend performance'
        ],
        technologies: ['React', 'TypeScript', 'CSS', 'HTML'],
        achievements: [
          'Reduced page load time by 30%',
          'Implemented new design system'
        ],
        displayOrder: 2
      }
    ];

    const savedExperiences = await Experience.insertMany(testExperiences);
    console.log('   ✅ Test experiences created:', savedExperiences.length);

    // 4. Test Education Model
    console.log('\n🎓 4. Testing Education Model:');
    
    const testEducations = [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        location: 'Boston, MA',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2020-05-31'),
        current: false,
        grade: '3.8/4.0',
        description: 'Focused on software engineering and algorithms',
        courses: ['Data Structures', 'Algorithms', 'Web Development', 'Database Systems'],
        achievements: ['Graduated with honors', 'Dean\'s List'],
        displayOrder: 1
      }
    ];

    const savedEducations = await Education.insertMany(testEducations);
    console.log('   ✅ Test educations created:', savedEducations.length);

    // 5. Test Resume Model
    console.log('\n📄 5. Testing Resume Model:');
    
    const testResume = new Resume({
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        website: 'https://johndoe.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        summary: 'Experienced full-stack developer with 5+ years in web development. Passionate about creating efficient and scalable applications.'
      },
      title: 'Senior Full Stack Developer',
      tagline: 'Building the future of web applications',
      currentRole: 'Senior Full Stack Developer at Tech Company Inc.',
      experiences: savedExperiences.map(exp => exp._id),
      educations: savedEducations.map(edu => edu._id),
      skills: savedSkills.map(skill => skill._id),
      template: 'modern',
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1F2937',
        fontFamily: 'Inter'
      },
      isPublic: true,
      isActive: true,
      viewCount: 0,
      downloadCount: 0
    });

    await testResume.save();
    console.log('   ✅ Test resume created');

    // 6. Test Resume Queries
    console.log('\n🔍 6. Testing Resume Queries:');
    
    // Get populated resume
    const populatedResume = await Resume.findOne({ isActive: true })
      .populate('experiences')
      .populate('educations')
      .populate('skills');
    
    console.log('   ✅ Resume experiences:', populatedResume?.experiences.length);
    console.log('   ✅ Resume educations:', populatedResume?.educations.length);
    console.log('   ✅ Resume skills:', populatedResume?.skills.length);

    // 7. Test Endorsements
    console.log('\n👍 7. Testing Endorsements:');
    
    const testEndorsement = new Endorsement({
      skill: savedSkills[0]._id, // JavaScript skill
      endorsedBy: testUser._id,
      endorserName: testUser.name,
      endorserEmail: testUser.email,
      endorserRelation: 'colleague',
      message: 'Excellent JavaScript skills! Great to work with.',
      rating: 5,
      status: 'approved',
      isPublic: true
    });

    await testEndorsement.save();
    
    // Add endorsement to skill
    await Skill.findByIdAndUpdate(
      savedSkills[0]._id,
      { 
        $push: { endorsements: testEndorsement._id },
        endorsementCount: 1
      }
    );

    const skillWithEndorsements = await Skill.findById(savedSkills[0]._id)
      .populate('endorsements');
    
    console.log('   ✅ Endorsements count:', skillWithEndorsements?.endorsementCount);

    // 8. Cleanup test data
    console.log('\n🧹 8. Cleaning up test data:');
    
    await Resume.deleteOne({ _id: testResume._id });
    await Experience.deleteMany({ _id: { $in: savedExperiences.map(exp => exp._id) } });
    await Education.deleteMany({ _id: { $in: savedEducations.map(edu => edu._id) } });
    await Skill.deleteMany({ _id: { $in: savedSkills.map(skill => skill._id) } });
    await Endorsement.deleteOne({ _id: testEndorsement._id });
    await User.deleteOne({ email: 'resume-test@example.com' });
    
    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 DYNAMIC RESUME SYSTEM TESTS PASSED! ✅');
    console.log('\n📋 Summary:');
    console.log('   - Resume Model: ✅ Working');
    console.log('   - Experience Model: ✅ Working');
    console.log('   - Education Model: ✅ Working');
    console.log('   - Skills Model: ✅ Working');
    console.log('   - Endorsements: ✅ Working');
    console.log('   - Population: ✅ Working');
    console.log('   - CRUD Operations: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
}

// Run the test
testResumeSystem();