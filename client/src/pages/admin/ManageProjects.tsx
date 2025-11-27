import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { projectsAPI, type Project } from '@/services/projects';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Search,
  Filter,
  Star,
  Zap,
  Sparkles,
  TrendingUp,
  Code2,
  Globe
} from 'lucide-react';

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, categoryFilter, featuredFilter]);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    // Featured filter
    if (featuredFilter !== 'all') {
      filtered = filtered.filter(project => 
        featuredFilter === 'featured' ? project.featured : !project.featured
      );
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsAPI.deleteProject(id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
        className: 'bg-green-500 text-white',
      });
      loadProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await projectsAPI.updateProject(project.id, {
        featured: !project.featured
      });
      toast({
        title: 'Success',
        description: `Project ${!project.featured ? 'added to' : 'removed from'} featured`,
        className: 'bg-blue-500 text-white',
      });
      loadProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    }
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      change: '+2 this month'
    },
    {
      label: 'Featured',
      value: projects.filter(p => p.featured).length,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      change: 'Showcase ready'
    },
    {
      label: 'Technologies',
      value: projects.reduce((acc, project) => acc + project.tech.length, 0),
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      change: '15+ stacks'
    },
    {
      label: 'Live Demos',
      value: projects.filter(p => p.links.demo && p.links.demo !== '#').length,
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      change: 'Active projects'
    },
  ];

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
        ease: "easeOut"
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
      >
        <div>
          <Link href="/admin/dashboard">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-white/70 hover:text-white mb-2 backdrop-blur-sm bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Code2 className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Manage Projects
              </h1>
              <p className="text-white/60 mt-1">Create, edit and manage your portfolio projects</p>
            </div>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/admin/projects/new">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
              {/* Animated gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
              <div className="absolute inset-[1px] bg-gradient-to-br from-gray-900 to-black rounded-lg" />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                    <motion.p 
                      className="text-3xl font-bold text-white mt-2"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-green-400 text-xs font-medium mt-1">{stat.change}</p>
                  </div>
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mb-6"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Featured Filter */}
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                <option value="featured">Featured Only</option>
                <option value="normal">Normal Only</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Projects ({filteredProjects.length})
            </CardTitle>
            <CardDescription className="text-white/60">
              Manage your portfolio projects and their visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-white/60">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Sparkles className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-white/60 mb-6">Get started by creating your first project</p>
                <Link href="/admin/projects/new">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5">
                      <TableHead className="text-white font-semibold">Project</TableHead>
                      <TableHead className="text-white font-semibold">Category</TableHead>
                      <TableHead className="text-white font-semibold">Technologies</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredProjects.map((project, index) => (
                        <motion.tr
                          key={project.id}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ delay: index * 0.05 }}
                          className="border-white/10 hover:bg-white/5 group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {project.image && (
                                <motion.img
                                  whileHover={{ scale: 1.1 }}
                                  src={project.image}
                                  alt={project.title}
                                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                  {project.title}
                                </div>
                                <div className="text-sm text-white/60 line-clamp-1 max-w-[200px]">
                                  {project.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant="outline" className="text-white/70 border-white/20">
                              {project.category}
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {project.tech.slice(0, 2).map((tech) => (
                                <Badge 
                                  key={tech} 
                                  variant="secondary" 
                                  className="text-xs bg-white/10 text-white/80 border-white/10"
                                >
                                  {tech}
                                </Badge>
                              ))}
                              {project.tech.length > 2 && (
                                <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                  +{project.tech.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Badge
                                variant={project.featured ? "default" : "outline"}
                                className={`cursor-pointer transition-all duration-300 ${
                                  project.featured 
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0' 
                                    : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10'
                                }`}
                                onClick={() => toggleFeatured(project)}
                              >
                                {project.featured ? (
                                  <>
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Featured
                                  </>
                                ) : (
                                  'Normal'
                                )}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              {project.links.demo && project.links.demo !== '#' && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(project.links.demo, '_blank')}
                                    className="text-white/70 hover:text-white hover:bg-white/10"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              )}
                              
                              {project.links.github && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.open(project.links.github, '_blank')}
                                    className="text-white/70 hover:text-white hover:bg-white/10"
                                  >
                                    <Github className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              )}
                              
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link href={`/admin/projects/edit/${project.id}`}>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </motion.div>
                              
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                  onClick={() => handleDelete(project.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}