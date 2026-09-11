import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { projectApi } from "@/services/publicApi";

// Types
interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  shortDescription: string;
  techStack: string[];
  featuredImage: string;
  liveUrl?: string;
  repositoryUrl?: string;
  isPublic: boolean;
  isFeatured: boolean;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UIProject {
  title: string;
  category: string;
  description: string;
  tech: string[];
  links: {
    demo: string;
    github: string;
  };
  gradient: string;
  isPublic: boolean;
  isFeatured: boolean;
  status: string;
}

// Magnetic card component - Mobile friendly
function MagneticCard({ children, index }: { children: React.ReactNode; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.1;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMobile ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// 3D Flip Card Component - Mobile optimized
function FlipCard({ project, index }: { project: Project; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
    }
  };

  // Color gradient based on category
  const getGradient = (category: string): string => {
    switch(category?.toLowerCase()) {
      case 'web': return 'from-blue-500 to-purple-600';
      case 'mobile': return 'from-green-500 to-cyan-600';
      case 'ai-ml': return 'from-purple-500 to-pink-600';
      case 'iot': return 'from-yellow-500 to-orange-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  // Map API project to UI format
  const uiProject: UIProject = {
    title: project.title,
    category: project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || 'Project',
    description: project.shortDescription || project.description?.substring(0, 150) + '...',
    tech: project.techStack || [],
    links: { 
      demo: project.liveUrl || '#', 
      github: project.repositoryUrl || '#' 
    },
    gradient: getGradient(project.category),
    isPublic: project.isPublic,
    isFeatured: project.isFeatured,
    status: project.status || 'completed'
  };

  return (
    <div className="flip-card w-full h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px]" onClick={isMobile ? handleFlip : undefined}>
      <motion.div
        className="flip-card-inner w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 360 }}
        transition={{ duration: 0.6, animationDirection: "normal" }}
        onAnimationComplete={() => setIsAnimating(false)}
        onMouseEnter={!isMobile ? handleFlip : undefined}
        onMouseLeave={!isMobile ? () => setIsFlipped(false) : undefined}
      >
        {/* Front of Card */}
        <div className="flip-card-front w-full h-full">
          <MagneticCard index={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${uiProject.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Visibility Badge */}
              {!project.isPublic && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-2 py-1 rounded-full text-xs border border-gray-600">
                    <span>🔒</span>
                    Private
                  </div>
                </div>
              )}

              {/* Featured badge */}
              {project.isFeatured && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs">
                    <span>⭐</span>
                    Featured
                  </div>
                </div>
              )}

              {/* Floating elements */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-500 delay-100" />

              {/* Content */}
              <div className="relative z-10 flex-1">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="text-xs font-semibold text-primary px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {uiProject.category}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-white/5 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ArrowUpRight size={14} className="sm:w-4 sm:h-4 text-white/60" />
                  </motion.div>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                  {uiProject.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                  {uiProject.description}
                </p>
              </div>

              {/* Tech stack */}
              <div className="relative z-10">
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {uiProject.tech.slice(0, 3).map((tech: string, techIndex: number) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + techIndex * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="text-xs text-white/60 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      #{tech}
                    </motion.span>
                  ))}
                  {uiProject.tech.length > 3 && (
                    <span className="text-xs text-white/40 px-2 py-1">
                      +{uiProject.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* Flip hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className="text-center"
                >
                  <p className="text-xs text-white/40 group-hover:text-primary/60 transition-colors duration-300">
                    {isMobile ? "Tap to flip ↻" : "Hover to flip ↻"}
                  </p>
                </motion.div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </motion.div>
          </MagneticCard>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 flex flex-col justify-between">
            {/* Back content */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Project Details</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4 sm:mb-6">
                {uiProject.description}
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-primary text-sm font-semibold">Technologies</p>
                  <p className="text-white/60 text-sm">{uiProject.tech.slice(0, 5).join(", ")}</p>
                </div>
                <div>
                  <p className="text-primary text-sm font-semibold">Status</p>
                  <p className="text-white/60 text-sm capitalize">{project.status || 'Completed'}</p>
                </div>
                <div>
                  <p className="text-primary text-sm font-semibold">Visibility</p>
                  <p className="text-white/60 text-sm">
                    {project.isPublic ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Private (Admin Only)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {uiProject.links.demo !== '#' && (
                <motion.a
                  href={uiProject.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 sm:py-3 px-4 rounded-xl text-center hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  Live Demo
                </motion.a>
              )}
              {uiProject.links.github !== '#' && (
                <motion.a
                  href={uiProject.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-white/5 text-white text-sm font-semibold py-2 sm:py-3 px-4 rounded-xl text-center border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Github size={14} className="sm:w-4 sm:h-4" />
                  Code
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Fetch projects from API
    fetchProjects();
    
    // Check for updates every 30 seconds
    const updateInterval = setInterval(() => {
      console.log('🔄 Checking for project updates...');
      fetchProjects();
    }, 30000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(updateInterval);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('🔍 [FRONTEND] Fetching projects...');
      
      const response = await projectApi.getAll();
      console.log('📦 Projects API Response:', response);
      
      let projectsData: Project[] = [];
      
      // ✅ FIX: Backend sends { success, data: [...], pagination }
      if (Array.isArray(response.data)) {
        projectsData = response.data;
        console.log('✅ Extracted from response.data (array)');
      } else if (response.data && Array.isArray((response.data as any).projects)) {
        projectsData = (response.data as any).projects;
        console.log('✅ Extracted from response.data.projects');
      } else if (Array.isArray(response)) {
        projectsData = response as any;
        console.log('✅ Extracted from response (array)');
      }
      
      console.log(`📊 Total projects from API: ${projectsData.length}`);
      console.log('📋 Projects:', projectsData.map(p => ({
        id: p._id,
        title: p.title,
        isPublic: p.isPublic,
        isFeatured: p.isFeatured
      })));
      
      // ✅ FIX: Filter only public projects
      const publicProjects = projectsData.filter((project: Project) => project.isPublic === true);
      console.log(`🔐 Public projects: ${publicProjects.length}/${projectsData.length}`);
      
      // ✅ FIX: If featured exist, show featured. Otherwise show all public.
      const featured = publicProjects.filter((p: Project) => p.isFeatured === true);
      const finalProjects = featured.length > 0 ? featured : publicProjects;
      
      console.log(`🎯 Showing ${finalProjects.length} projects (featured: ${featured.length > 0})`);
      
      setProjects(finalProjects);
      setError('');
      setDebugInfo({
        lastFetched: new Date().toISOString(),
        publicProjects: publicProjects.length,
        totalProjects: projectsData.length
      });
      
    } catch (err: any) {
      console.error('❌ Error fetching projects:', err);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manually refreshing projects...');
    fetchProjects();
  };

  return (
    <section id="projects" className="py-12 sm:py-20 md:py-28 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-60 sm:h-60 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50">
            <details className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs border border-gray-700 max-w-xs">
              <summary className="cursor-pointer font-semibold text-primary">🔧 Debug Info</summary>
              <div className="mt-2 space-y-1">
                <p>Last fetched: {debugInfo.lastFetched ? new Date(debugInfo.lastFetched).toLocaleTimeString() : 'Never'}</p>
                <p>Public projects: {debugInfo.publicProjects || 0}</p>
                <p>Total from API: {debugInfo.totalProjects || 0}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 text-xs bg-primary/20 hover:bg-primary/30 px-2 py-1 rounded"
                >
                  Refresh
                </button>
              </div>
            </details>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold text-primary tracking-widest uppercase mb-3 sm:mb-4"
          >
            Featured Work
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            Creative <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Projects</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto px-4"
          >
            {projects.length} projects from my portfolio. 
            {process.env.NODE_ENV === 'development' && (
              <span className="block text-xs text-primary/70 mt-1">
                Only public projects (isPublic: true) are shown here.
              </span>
            )}
          </motion.p>
        </motion.div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading projects from backend...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-semibold">⚠️ {error}</p>
              <p className="text-white/60 text-sm mt-2">
                Make sure backend server is running on port 5000
              </p>
              <button 
                onClick={handleRefresh}
                className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className={`
            grid gap-4 sm:gap-6 md:gap-8
            ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}
            max-w-7xl mx-auto
          `}>
            {projects.map((project, index) => (
              <div key={project._id} className="w-full h-full">
                <FlipCard project={project} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-white/60 mb-2">No public projects found</p>
              <p className="text-white/40 text-sm mb-4">
                Add projects from admin panel and make sure to set "isPublic: true"
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleRefresh}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  ↻ Refresh
                </button>
                <a 
                  href="/admin" 
                  className="text-secondary hover:text-secondary/80 text-sm"
                >
                  Go to Admin Panel →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base sm:text-xl text-white/60 mb-6 sm:mb-8"
          >
            Want to see more of my work?
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => window.location.href = '/projects'}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-2xl shadow-primary/25"
            >
              View All Projects
              <ArrowUpRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}