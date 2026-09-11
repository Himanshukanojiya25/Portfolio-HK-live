import React, { useEffect, useState } from 'react';
import { Link } from "wouter";
import { motion } from 'framer-motion';
import { projectApi } from '../services/publicApi';
import { 
  ExternalLink, 
  Github, 
  Calendar, 
  Code2, 
  Filter,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [filter, featuredOnly]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter !== 'all') params.category = filter;
      if (featuredOnly) params.featured = true;
      
      const response = await projectApi.getAll(params);
      console.log('📦 ProjectsPage API Response:', response);
      
      // ✅ FIX: Backend sends { success, data: [...], pagination }
      let projectsData: any[] = [];
      
      if (Array.isArray(response.data)) {
        projectsData = response.data;
      } else if (response.data && Array.isArray((response.data as any).projects)) {
        projectsData = (response.data as any).projects;
      } else if (Array.isArray(response)) {
        projectsData = response as any;
      }
      
      // ✅ FIX: Only show public projects
      const publicProjects = projectsData.filter((p: any) => p.isPublic === true);
      
      console.log(`✅ ProjectsPage: ${publicProjects.length} public projects`);
      setProjects(publicProjects);
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'web', 'mobile', 'desktop', 'ai-ml', 'iot', 'other'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-mobile">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <Code2 className="w-12 h-12 text-cyan-400" />
            </div>
          </motion.div>
          <h1 className="heading-responsive font-bold mb-4">
            <span className="text-gradient">Portfolio Projects</span>
          </h1>
          <p className="text-muted-foreground text-responsive max-w-2xl mx-auto">
            Showcasing my work across various technologies and domains. Each project tells a story of challenges, solutions, and learnings.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">
              {[...new Set(projects.flatMap(p => p.techStack || []))].length}
            </div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      filter === category
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'glass-card hover:bg-accent text-foreground'
                    }`}
                  >
                    {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  featuredOnly
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'glass-card hover:bg-accent text-foreground'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Featured Only
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-2xl"
          >
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {filter !== 'all' 
                ? `No ${filter} projects available yet`
                : 'No projects available yet'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View Count Stats */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-muted-foreground">
                Total project views:{' '}
                <span className="font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const techStack = project.techStack || [];
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group relative">
      {/* Featured Badge */}
      {project.isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'completed'
            ? 'bg-green-500/10 text-green-500'
            : project.status === 'in-progress'
            ? 'bg-blue-500/10 text-blue-500'
            : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {project.status?.replace('-', ' ') || 'completed'}
        </div>
      </div>

      {/* Image */}
      <div className="aspect-video overflow-hidden relative">
        <img
          src={project.featuredImage || 'https://via.placeholder.com/600x400'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.shortDescription || project.description?.substring(0, 100)}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.slice(0, 4).map((tech: string, idx: number) => (
            <span
              key={`${project._id}-${tech}-${idx}`}
              className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{techStack.length - 4}
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(project.startDate)}</span>
          {project.endDate && (
            <>
              <span>—</span>
              <span>{formatDate(project.endDate)}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between">
          <Link
            to={`/projects/${project._id}`}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
          >
            View Details
            <ExternalLink className="w-4 h-4" />
          </Link>
          
          <div className="flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                title="Source Code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;