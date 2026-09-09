import express from 'express';
import {
  getPublicProjects,
  getProjectById,
  getFeaturedProjects,
  getPublicSkills,
  getSkillsByCategory,
  getTestimonials,
  getFeaturedTestimonials,
  submitContactForm,
  getPortfolioStats,
  healthCheck
} from '../controllers/public.controller'; 

const router = express.Router();

// ========== PROJECT ROUTES ==========
router.get('/projects', getPublicProjects);           // GET all public projects
router.get('/projects/featured', getFeaturedProjects); // GET featured projects
router.get('/projects/:id', getProjectById);          // GET single project

// ========== SKILL ROUTES ==========
router.get('/skills', getPublicSkills);               // GET all public skills
router.get('/skills/category/:category', getSkillsByCategory); // GET skills by category

// ========== TESTIMONIAL ROUTES ==========
router.get('/testimonials', getTestimonials);         // GET all testimonials
router.get('/testimonials/featured', getFeaturedTestimonials); // GET featured testimonials

// ========== CONTACT ROUTE ==========
router.post('/contact', submitContactForm);           // POST contact form

// ========== STATS ROUTE ==========
router.get('/stats', getPortfolioStats);              // GET portfolio stats

// ========== HEALTH CHECK ==========
router.get('/health', healthCheck);                   // GET API health

export default router;