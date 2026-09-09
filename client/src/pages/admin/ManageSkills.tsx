import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { skillsAPI, type Skill } from '@/services/skills';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Star, 
  Search, 
  Zap,
  Code2,
  Layers,
  TrendingUp,
  Sparkles,
  Crown,
  Target,
  Loader2
} from 'lucide-react';

export default function ManageSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchTerm, selectedCategory]);

const loadSkills = async () => {
  try {
    console.log('🔄 [DEBUG] Loading skills started...');
    setIsLoading(true);
    
    // METHOD 1: Try direct fetch with detailed logging
    console.log('🔧 [DEBUG] Trying direct fetch...');
    const token = localStorage.getItem('admin_token');
    console.log('🔑 [DEBUG] Token exists:', !!token);
    
    const response = await fetch('http://localhost:5000/api/skills', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 [DEBUG] Response status:', response.status);
    console.log('📡 [DEBUG] Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [DEBUG] API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    console.log('📦 [DEBUG] RAW API RESPONSE:', rawData);
    console.log('📦 [DEBUG] Type of rawData:', typeof rawData);
    console.log('📦 [DEBUG] Is Array?', Array.isArray(rawData));
    
    if (rawData && typeof rawData === 'object') {
      console.log('🔍 [DEBUG] Object keys:', Object.keys(rawData));
      
      // Check if there's a success property
      if ('success' in rawData) {
        console.log('✅ [DEBUG] success:', rawData.success);
      }
      
      // Check if there's a data property
      if ('data' in rawData) {
        console.log('📊 [DEBUG] data type:', typeof rawData.data);
        console.log('📊 [DEBUG] data is array?', Array.isArray(rawData.data));
        if (Array.isArray(rawData.data)) {
          console.log('📊 [DEBUG] data length:', rawData.data.length);
          console.log('📊 [DEBUG] first item:', rawData.data[0]);
        }
      }
      
      // Check if there's a skills property
      if ('skills' in rawData) {
        console.log('💼 [DEBUG] skills type:', typeof rawData.skills);
        console.log('💼 [DEBUG] skills is array?', Array.isArray(rawData.skills));
      }
    }
    
    // PROCESS THE DATA
    let skillsArray: Skill[] = [];
    
    if (Array.isArray(rawData)) {
      // Case 1: Direct array
      console.log('✅ Case 1: Direct array response');
      skillsArray = rawData;
    } 
    else if (rawData && rawData.data && Array.isArray(rawData.data)) {
      // Case 2: { data: [...] }
      console.log('✅ Case 2: data array response');
      skillsArray = rawData.data;
    }
    else if (rawData && rawData.skills && Array.isArray(rawData.skills)) {
      // Case 3: { skills: [...] }
      console.log('✅ Case 3: skills array response');
      skillsArray = rawData.skills;
    }
    else if (rawData && rawData.success && rawData.data && Array.isArray(rawData.data)) {
      // Case 4: { success: true, data: [...] }
      console.log('✅ Case 4: success.data array response');
      skillsArray = rawData.data;
    }
    else {
      console.error('❌ [DEBUG] Unknown response format');
      console.error('❌ [DEBUG] Full response:', JSON.stringify(rawData, null, 2));
    }
    
    console.log('✨ [DEBUG] Final skills array:', skillsArray);
    console.log('✨ [DEBUG] Skills count:', skillsArray.length);
    
    // Set the skills
    setSkills(skillsArray);
    
    if (skillsArray.length > 0) {
      toast({
        title: 'Success',
        description: `Loaded ${skillsArray.length} skills`,
        className: 'bg-green-500 text-white',
      });
    } else {
      toast({
        title: 'Info',
        description: 'No skills found in database',
        variant: 'default',
      });
    }
    
  } catch (error: any) {
    console.error('❌ [DEBUG] Error in loadSkills:', error);
    console.error('❌ [DEBUG] Error stack:', error.stack);
    
    toast({
      title: 'Error',
      description: error.message || 'Failed to load skills',
      variant: 'destructive',
    });
    
    // Set empty array on error
    setSkills([]);
  } finally {
    console.log('🏁 [DEBUG] loadSkills finished');
    setIsLoading(false);
  }
};

  const filterSkills = () => {
    let filtered = skills;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    setFilteredSkills(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const success = await skillsAPI.deleteSkill(id);
      if (success) {
        toast({
          title: 'Success',
          description: 'Skill deleted successfully',
          className: 'bg-green-500 text-white',
        });
        loadSkills();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete skill',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (skill: Skill) => {
    try {
      const updatedSkill = await skillsAPI.toggleFeatured(skill.id);
      if (updatedSkill) {
        toast({
          title: 'Success',
          description: `Skill ${!skill.featured ? 'added to' : 'removed from'} featured`,
          className: 'bg-blue-500 text-white',
        });
        loadSkills();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update skill',
        variant: 'destructive',
      });
    }
  };

  const updateSkillLevel = async (skill: Skill, newLevel: number) => {
    try {
      const updatedSkill = await skillsAPI.updateSkill(skill.id, {
        level: newLevel
      });
      if (updatedSkill) {
        toast({
          title: 'Success',
          description: 'Skill level updated',
          className: 'bg-purple-500 text-white',
        });
        loadSkills();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update skill level',
        variant: 'destructive',
      });
    }
  };

  const safeSkills = Array.isArray(skills) ? skills : [];
  const categories = ['All', ...new Set(safeSkills.map(skill => skill.category).filter(Boolean))];

  const getSkillsByCategory = () => {
    const categoriesMap: Record<string, Skill[]> = {};
    
    filteredSkills.forEach(skill => {
      if (!categoriesMap[skill.category]) {
        categoriesMap[skill.category] = [];
      }
      categoriesMap[skill.category].push(skill);
    });

    return categoriesMap;
  };

  const stats = [
    {
      label: 'Total Skills',
      value: safeSkills.length,
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      change: `${safeSkills.length} skills`
    },
    {
      label: 'Featured',
      value: safeSkills.filter(s => s.featured).length,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      change: 'Showcase skills'
    },
    {
      label: 'Categories',
      value: new Set(safeSkills.map(s => s.category)).size,
      icon: Layers,
      color: 'from-purple-500 to-pink-500',
      change: 'Diverse stack'
    },
    {
      label: 'Avg. Level',
      value: safeSkills.length > 0 
        ? Math.round(safeSkills.reduce((acc, skill) => acc + skill.level, 0) / safeSkills.length)
        : 0,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: 'Growing expertise'
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

  const skillCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6 relative overflow-hidden">
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
              <Zap className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Manage Skills
              </h1>
              <p className="text-white/60 mt-1 text-sm sm:text-base">Organize and showcase your technical expertise</p>
            </div>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/admin/skills/new">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 relative z-10"
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
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
              <div className="absolute inset-[1px] bg-gradient-to-br from-gray-900 to-black rounded-lg" />
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                    <motion.p 
                      className="text-2xl sm:text-3xl font-bold text-white mt-2"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {stat.value}{stat.label === 'Avg. Level' ? '%' : ''}
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
                    className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
                  placeholder="Search skills by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        {isLoading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-white/60">Loading skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {safeSkills.length === 0 ? 'No skills found' : 'No matching skills'}
            </h3>
            <p className="text-white/60 mb-6">
              {safeSkills.length === 0 
                ? 'Start building your skills portfolio' 
                : 'Try a different search term'}
            </p>
            <Link href="/admin/skills/new">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Skill
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {Object.entries(getSkillsByCategory()).map(([category, categorySkills]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Layers className="w-5 h-5 text-blue-400" />
                        </div>
                        {category}
                        <Badge variant="outline" className="ml-2 bg-white/10 text-white/80 border-white/20">
                          {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                          {categorySkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              variants={skillCardVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              whileHover={{ 
                                scale: 1.02,
                                y: -2,
                                transition: { duration: 0.2 }
                              }}
                              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-lg shadow-lg"
                                      style={{ backgroundColor: skill.color }}
                                    >
                                      {skill.icon || skill.name.charAt(0)}
                                    </motion.div>
                                    <div>
                                      <h3 className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                        {skill.name}
                                      </h3>
                                      <p className="text-white/60 text-sm">{skill.category}</p>
                                    </div>
                                  </div>
                                  
                                  <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => toggleFeatured(skill)}
                                      className={`p-1 ${
                                        skill.featured 
                                          ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10' 
                                          : 'text-white/40 hover:text-white/60 hover:bg-white/10'
                                      }`}
                                    >
                                      <Star className={`w-4 h-4 ${skill.featured ? 'fill-current' : ''}`} />
                                    </Button>
                                  </motion.div>
                                </div>

                                {/* Skill Level */}
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/70">Proficiency</span>
                                    <span className="text-white font-medium">{skill.level}%</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${skill.level}%` }}
                                      transition={{ duration: 1, delay: 0.5 }}
                                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25"
                                    />
                                  </div>
                                  
                                  {/* Quick Level Adjustment */}
                                  <div className="flex gap-1 mt-3">
                                    {[25, 50, 75, 90].map(level => (
                                      <motion.button
                                        key={level}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateSkillLevel(skill, level)}
                                        className={`flex-1 text-xs rounded px-2 py-1 transition-all duration-200 ${
                                          skill.level === level
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                            : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
                                        }`}
                                      >
                                        {level}%
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                    <Link href={`/admin/skills/edit/${skill.id}`}>
                                      <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                    </Link>
                                  </motion.div>
                                  
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                      onClick={() => handleDelete(skill.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -80, 0],
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