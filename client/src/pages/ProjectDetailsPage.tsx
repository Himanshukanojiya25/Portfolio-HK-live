import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { projectApi } from '../services/publicApi';
import { 
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Code2,
  Users,
  Target,
  Award,
  Zap,
  Clock,
  Layers,
  CheckCircle,
  Star
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await projectApi.getById(projectId);
      setProject(response.data.project);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container-mobile text-center py-20">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-mobile">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="aspect-video rounded-2xl overflow-hidden mb-6">
            <img
              src={project.featuredImage || 'https://via.placeholder.com/1200x600'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
                {project.isFeatured && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                )}
              </div>
              <p className="text-xl text-muted-foreground mb-6">{project.shortDescription}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'completed'
                      ? 'bg-green-500/10 text-green-500'
                      : project.status === 'in-progress'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(project.startDate)}</span>
                  {project.endDate && (
                    <>
                      <span>-</span>
                      <span>{formatDate(project.endDate)}</span>
                    </>
                  )}
                </div>
                
                {project.viewCount > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{project.viewCount} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 glass-card rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Project Overview
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </motion.section>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Technology Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.map((tech: string, index: number) => (
                    <div
                      key={`${tech}-${index}`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 rounded-lg border border-blue-500/20"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-border"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Challenges & Solutions */}
            {(project.challenges?.length > 0 || project.solutions?.length > 0) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Challenges & Solutions
                </h2>
                
                <div className="space-y-6">
                  {project.challenges?.map((challenge: string, index: number) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold">
                            ?
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">Challenge</h3>
                          <p className="text-foreground/80">{challenge}</p>
                        </div>
                      </div>
                      
                      {project.solutions?.[index] && (
                        <div className="flex items-start gap-3 ml-10">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-2">Solution</h3>
                            <p className="text-foreground/80">{project.solutions[index]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <div className="font-medium">{project.category}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Timeline</div>
                  <div className="font-medium">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                  </div>
                </div>
                
                {project.teamSize && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Team Size
                    </div>
                    <div className="font-medium">{project.teamSize} person{project.teamSize !== 1 ? 's' : ''}</div>
                  </div>
                )}
                
                {project.client && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Client</div>
                    <div className="font-medium">{project.client}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Key Learnings */}
            {project.learnings && project.learnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Key Learnings
                </h3>
                <ul className="space-y-3">
                  {project.learnings.map((learning: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
                      <span className="text-sm">{learning}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Project Stats</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Technologies Used</span>
                    <span className="font-medium">{project.techStack?.length || 0}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${Math.min((project.techStack?.length || 0) * 10, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Features Implemented</span>
                    <span className="font-medium">{project.features?.length || 0}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${Math.min((project.features?.length || 0) * 20, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Project Complexity</span>
                    <span className="font-medium">
                      {project.priority === 'showcase' ? 'High' : 
                       project.priority === 'high' ? 'Medium-High' :
                       project.priority === 'medium' ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.priority === 'showcase' || project.priority === 'high' 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                      style={{ 
                        width: project.priority === 'showcase' ? '90%' :
                               project.priority === 'high' ? '75%' :
                               project.priority === 'medium' ? '50%' : '25%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Share Project */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Share This Project</h3>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                  Twitter
                </button>
                <button className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  LinkedIn
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing Eye icon component
const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default ProjectDetailsPage;