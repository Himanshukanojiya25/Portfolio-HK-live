import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { skillApi } from '../services/publicApi';
import { 
  Cpu, 
  Database, 
  Code, 
  Palette, 
  Server,
  TrendingUp,
  Zap,
  Layers
} from 'lucide-react';

const SkillsPage = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillApi.getAll();
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc: any, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const categories = ['all', ...Object.keys(groupedSkills).sort()];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend': return <Code className="w-5 h-5" />;
      case 'backend': return <Server className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'design': return <Palette className="w-5 h-5" />;
      case 'tools': return <Cpu className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend': return 'from-blue-500 to-cyan-500';
      case 'backend': return 'from-purple-500 to-pink-500';
      case 'database': return 'from-green-500 to-emerald-500';
      case 'design': return 'from-yellow-500 to-orange-500';
      case 'tools': return 'from-indigo-500 to-violet-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : groupedSkills[activeCategory] || [];

  const stats = {
    total: skills.length,
    averageProficiency: skills.length > 0 
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0,
    categories: Object.keys(groupedSkills).length,
    expertLevel: skills.filter(s => s.proficiency >= 80).length
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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <Layers className="w-12 h-12 text-purple-400" />
            </div>
          </motion.div>
          <h1 className="heading-responsive font-bold mb-4">
            <span className="text-gradient">Technical Skills</span>
          </h1>
          <p className="text-muted-foreground text-responsive max-w-2xl mx-auto">
            Technologies and tools I work with, constantly evolving and expanding my expertise.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Skills</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.categories}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.averageProficiency}%</div>
            <div className="text-sm text-muted-foreground">Avg. Proficiency</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.expertLevel}</div>
            <div className="text-sm text-muted-foreground">Expert Level</div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                  activeCategory === category
                    ? `bg-gradient-to-r ${getCategoryColor(category)} text-white`
                    : 'glass-card hover:bg-accent text-foreground'
                }`}
              >
                {getCategoryIcon(category)}
                <span>
                  {category === 'all' ? 'All Skills' : category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                {category !== 'all' && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {groupedSkills[category]?.length || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-2xl"
          >
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No skills found</h3>
            <p className="text-muted-foreground">
              {activeCategory !== 'all' 
                ? `No ${activeCategory} skills available yet`
                : 'No skills available yet'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredSkills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </motion.div>
        )}

        {/* Proficiency Legend */}
        {filteredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">Proficiency Levels</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredSkills.filter(s => s.proficiency >= 80).length} expert skills
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Beginner</div>
                <div className="h-2 w-full bg-gradient-to-r from-gray-500/20 to-gray-500/40 rounded-full"></div>
                <div className="text-xs mt-1">0-40%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Intermediate</div>
                <div className="h-2 w-full bg-gradient-to-r from-blue-500/40 to-blue-500/60 rounded-full"></div>
                <div className="text-xs mt-1">41-70%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Advanced</div>
                <div className="h-2 w-full bg-gradient-to-r from-purple-500/60 to-purple-500/80 rounded-full"></div>
                <div className="text-xs mt-1">71-90%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Expert</div>
                <div className="h-2 w-full bg-gradient-to-r from-green-500/80 to-green-500 rounded-full"></div>
                <div className="text-xs mt-1">91-100%</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SkillCard = ({ skill }: { skill: any }) => {
  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'from-green-500 to-emerald-500';
    if (proficiency >= 60) return 'from-blue-500 to-cyan-500';
    if (proficiency >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  const getProficiencyText = (proficiency: number) => {
    if (proficiency >= 80) return 'Expert';
    if (proficiency >= 60) return 'Advanced';
    if (proficiency >= 40) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <motion.div
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="glass-card rounded-xl p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {skill.icon ? (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getProficiencyColor(skill.proficiency)}/10`}>
              <img src={skill.icon} alt={skill.name} className="w-6 h-6" />
            </div>
          ) : (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getProficiencyColor(skill.proficiency)}/10`}>
              <Zap className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="font-bold">{skill.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getProficiencyColor(skill.proficiency)}/10 text-foreground`}>
                {getProficiencyText(skill.proficiency)}
              </div>
              {skill.color && (
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gradient">{skill.proficiency}%</div>
          <div className="text-xs text-muted-foreground">Proficiency</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Mastery Level</span>
          <span className="font-medium">{skill.proficiency}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.proficiency}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2.5 rounded-full bg-gradient-to-r ${getProficiencyColor(skill.proficiency)}`}
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {skill.category?.charAt(0).toUpperCase() + skill.category?.slice(1) || 'Other'}
        </div>
        <div className="text-xs text-muted-foreground">
          #{skill.order || 0}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsPage;