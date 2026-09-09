import { Request, Response } from 'express';
import Project from '../models/Project.model';
import Skill from '../models/Skill.model';
import Testimonial from '../models/testimonial.model';
import Contact from "../models/Contact.model";

// Helper function for responses
const apiResponse = (res: Response, success: boolean, message: string, data?: any, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// ==================== PROJECTS ====================
export const getPublicProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, limit = '12' } = req.query;
    
    console.log('🔍 [PUBLIC] Query params:', { category, featured, limit });
    
    let filter: any = { isPublic: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    console.log('🔍 [PUBLIC] MongoDB filter:', JSON.stringify(filter, null, 2));
    
    // Get count first
    const totalCount = await Project.countDocuments(filter);
    console.log(`📊 [PUBLIC] Total projects in DB: ${totalCount}`);
    
    // Get all projects with this filter
    const allProjects = await Project.find(filter)
      .select('_id title isPublic isFeatured status');
    
    console.log('📦 [PUBLIC] All matching projects:', 
      allProjects.map(p => ({
        id: p._id,
        title: p.title,
        isPublic: p.isPublic,
        isFeatured: p.isFeatured,
        status: p.status
      }))
    );
    
    const projects = await Project.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(parseInt(limit as string))
      .select('_id title shortDescription featuredImage techStack category status liveUrl isPublic isFeatured');
    
    console.log(`✅ [PUBLIC] Found ${projects.length} projects`);
    console.log('✅ [PUBLIC] Projects to return:', 
      projects.map(p => ({ 
        id: p._id, 
        title: p.title,
        isPublic: p.isPublic,
        isFeatured: p.isFeatured
      }))
    );
    
    apiResponse(res, true, 'Projects fetched successfully', { 
      projects,
      total: totalCount,
      filterApplied: filter
    });
  } catch (error: any) {
    console.error('❌ [PUBLIC] Get projects error:', error);
    apiResponse(res, false, 'Failed to fetch projects', null, 500);
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 [PUBLIC] Fetching project by ID: ${id}`);
    
    const project = await Project.findOne({ 
      _id: id, 
      isPublic: true 
    }).select('-__v -updatedAt');
    
    if (!project) {
      console.log(`❌ [PUBLIC] Project not found or not public: ${id}`);
      return apiResponse(res, false, 'Project not found or not public', null, 404);
    }
    
    console.log(`✅ [PUBLIC] Found project: ${project.title} (ID: ${project._id})`);
    
    // Increment view count
    await Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    
    apiResponse(res, true, 'Project fetched successfully', { project });
  } catch (error: any) {
    console.error('[PUBLIC] Get project error:', error);
    apiResponse(res, false, 'Failed to fetch project', null, 500);
  }
};

export const getFeaturedProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 [PUBLIC] Fetching featured projects');
    
    const projects = await Project.find({ 
      isPublic: true, 
      isFeatured: true,
      status: 'completed'
    })
      .sort({ displayOrder: 1 })
      .limit(4)
      .select('_id title shortDescription featuredImage techStack liveUrl isPublic isFeatured');
    
    console.log(`✅ [PUBLIC] Found ${projects.length} featured projects`);
    console.log('✅ [PUBLIC] Featured projects:', 
      projects.map(p => ({
        id: p._id,
        title: p.title,
        isPublic: p.isPublic,
        isFeatured: p.isFeatured
      }))
    );
    
    apiResponse(res, true, 'Featured projects fetched', { projects });
  } catch (error: any) {
    console.error('[PUBLIC] Get featured projects error:', error);
    apiResponse(res, false, 'Failed to fetch featured projects', null, 500);
  }
};

// ==================== SKILLS ====================
export const getPublicSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 [PUBLIC] Fetching public skills');
    
    const skills = await Skill.find({ isPublic: true })
      .sort({ order: 1, proficiency: -1 })
      .select('_id name category proficiency icon color isPublic');
    
    console.log(`✅ [PUBLIC] Found ${skills.length} public skills`);
    
    apiResponse(res, true, 'Skills fetched successfully', { skills });
  } catch (error: any) {
    console.error('[PUBLIC] Get skills error:', error);
    apiResponse(res, false, 'Failed to fetch skills', null, 500);
  }
};

export const getSkillsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    
    console.log(`🔍 [PUBLIC] Fetching skills by category: ${category}`);
    
    const skills = await Skill.find({ 
      isPublic: true,
      category: category 
    })
      .sort({ proficiency: -1 })
      .select('_id name proficiency icon isPublic');
    
    console.log(`✅ [PUBLIC] Found ${skills.length} skills in category: ${category}`);
    
    apiResponse(res, true, `Skills in ${category} fetched`, { skills });
  } catch (error: any) {
    console.error('[PUBLIC] Get skills by category error:', error);
    apiResponse(res, false, 'Failed to fetch skills by category', null, 500);
  }
};

// ==================== TESTIMONIALS ====================
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 [PUBLIC] Fetching testimonials');
    
    const testimonials = await Testimonial.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .select('_id clientName clientRole clientCompany content rating clientImage isPublic');
    
    console.log(`✅ [PUBLIC] Found ${testimonials.length} testimonials`);
    
    apiResponse(res, true, 'Testimonials fetched successfully', { testimonials });
  } catch (error: any) {
    console.error('[PUBLIC] Get testimonials error:', error);
    apiResponse(res, false, 'Failed to fetch testimonials', null, 500);
  }
};

export const getFeaturedTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 [PUBLIC] Fetching featured testimonials');
    
    const testimonials = await Testimonial.find({ 
      isPublic: true,
      rating: { $gte: 4 }
    })
      .sort({ rating: -1 })
      .limit(3)
      .select('clientName clientRole content rating clientImage isPublic');
    
    console.log(`✅ [PUBLIC] Found ${testimonials.length} featured testimonials`);
    
    apiResponse(res, true, 'Featured testimonials fetched', { testimonials });
  } catch (error: any) {
    console.error('[PUBLIC] Get featured testimonials error:', error);
    apiResponse(res, false, 'Failed to fetch featured testimonials', null, 500);
  }
};

// ==================== CONTACT ====================
export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log('📨 [PUBLIC] Contact form submission:', { name, email, subject });
    
    // Validation
    if (!name || !email || !subject || !message) {
      console.log('❌ [PUBLIC] Missing required fields');
      return apiResponse(res, false, 'All fields are required', null, 400);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ [PUBLIC] Invalid email format:', email);
      return apiResponse(res, false, 'Invalid email format', null, 400);
    }
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    await newContact.save();
    
    console.log('✅ [PUBLIC] Contact saved successfully');
    
    apiResponse(res, true, 'Message sent successfully. I will get back to you soon!');
  } catch (error: any) {
    console.error('[PUBLIC] Contact form error:', error);
    apiResponse(res, false, 'Failed to send message', null, 500);
  }
};

// ==================== STATS ====================
export const getPortfolioStats = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 [PUBLIC] Fetching portfolio stats');
    
    const [projectsCount, skillsCount, testimonialsCount] = await Promise.all([
      Project.countDocuments({ isPublic: true }),
      Skill.countDocuments({ isPublic: true }),
      Testimonial.countDocuments({ isPublic: true })
    ]);
    
    console.log(`📊 [PUBLIC] Stats: ${projectsCount} projects, ${skillsCount} skills, ${testimonialsCount} testimonials`);
    
    apiResponse(res, true, 'Portfolio stats fetched', {
      stats: {
        projects: projectsCount,
        skills: skillsCount,
        testimonials: testimonialsCount
      }
    });
  } catch (error: any) {
    console.error('[PUBLIC] Get stats error:', error);
    apiResponse(res, false, 'Failed to fetch stats', null, 500);
  }
};

// ==================== HEALTH CHECK ====================
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🏥 [PUBLIC] Health check');
    
    // Check database connection
    await Promise.all([
      Project.findOne(),
      Skill.findOne(),
      Testimonial.findOne()
    ]);
    
    apiResponse(res, true, 'Public API is healthy', {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error: any) {
    console.error('[PUBLIC] Health check error:', error);
    apiResponse(res, false, 'API is experiencing issues', null, 503);
  }
};