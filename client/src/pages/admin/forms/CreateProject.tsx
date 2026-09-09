import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateProject = () => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'web',
    status: 'completed',
    priority: 'medium',
    repositoryUrl: '',
    liveUrl: '',
    featuredImage: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    techStack: [] as string[],
    features: [] as string[],
    challenges: [] as string[],
    solutions: [] as string[],
    learnings: [] as string[],
  });

  const [currentTech, setCurrentTech] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');
  const [currentLearning, setCurrentLearning] = useState('');

  const addTech = () => {
    if (currentTech.trim() && !formData.techStack.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addChallenge = () => {
    if (currentChallenge.trim()) {
      setFormData(prev => ({
        ...prev,
        challenges: [...prev.challenges, currentChallenge.trim()]
      }));
      setCurrentChallenge('');
    }
  };

  const removeChallenge = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter(c => c !== challenge)
    }));
  };

  const addSolution = () => {
    if (currentSolution.trim()) {
      setFormData(prev => ({
        ...prev,
        solutions: [...prev.solutions, currentSolution.trim()]
      }));
      setCurrentSolution('');
    }
  };

  const removeSolution = (solution: string) => {
    setFormData(prev => ({
      ...prev,
      solutions: prev.solutions.filter(s => s !== solution)
    }));
  };

  const addLearning = () => {
    if (currentLearning.trim()) {
      setFormData(prev => ({
        ...prev,
        learnings: [...prev.learnings, currentLearning.trim()]
      }));
      setCurrentLearning('');
    }
  };

  const removeLearning = (learning: string) => {
    setFormData(prev => ({
      ...prev,
      learnings: prev.learnings.filter(l => l !== learning)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'Please login again',
          variant: 'destructive',
        });
        return;
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        status: formData.status,
        priority: formData.priority,
        repositoryUrl: formData.repositoryUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        featuredImage: formData.featuredImage || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        techStack: formData.techStack,
        features: formData.features,
        challenges: formData.challenges,
        solutions: formData.solutions,
        learnings: formData.learnings,
        technologies: [],
        images: [],
        videoUrl: undefined,
        current: !formData.endDate,
        teamSize: 1,
        teamMembers: [],
        client: undefined,
        documentationUrl: undefined,
        isPublic: true,
        isFeatured: false,
        displayOrder: 0,
        viewCount: 0,
        likeCount: 0,
        downloadCount: 0
      };

      console.log('📤 Sending project data:', projectData);

      const response = await fetch('http://localhost:5000/api/admin/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();
      console.log('📥 API Response:', result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to create project');
      }

      toast({
        title: '🎉 Project Created!',
        description: 'Project has been added successfully',
        className: 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white',
      });

      setTimeout(() => {
        setLocation('/admin/projects');
      }, 1500);

    } catch (error: any) {
      console.error('❌ Error creating project:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation('/admin/projects')}
            className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 font-display">Create New Project</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Add a new project to your portfolio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Basic Information</CardTitle>
                  <CardDescription className="text-gray-400">Essential details about your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="shortDescription" className="text-gray-300">Short Description *</Label>
                    <Input
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      placeholder="Brief description (max 200 characters)"
                      maxLength={200}
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.shortDescription.length}/200 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">Full Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of your project, features, and technologies used..."
                      rows={6}
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="featuredImage" className="text-gray-300">Featured Image URL</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="featuredImage"
                        type="url"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button type="button" variant="outline" size="icon" className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50">
                        <ImageIcon className="w-4 h-4 text-gray-300" />
                      </Button>
                    </div>
                    {formData.featuredImage && (
                      <div className="mt-3">
                        <img 
                          src={formData.featuredImage} 
                          alt="Preview" 
                          className="h-32 w-full object-cover rounded-lg border border-gray-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Technology Stack */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Technology Stack</CardTitle>
                  <CardDescription className="text-gray-400">Technologies used in this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex space-x-2">
                    <Input
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      placeholder="Add technology (e.g., React, Node.js, MongoDB)"
                      className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button type="button" onClick={addTech} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.techStack.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gray-800/70 text-cyan-300 px-3 py-2 rounded-lg border border-cyan-500/20 backdrop-blur-sm"
                        >
                          <span className="font-medium">{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTech(tech)}
                            className="text-cyan-500 hover:text-cyan-300 transition-colors ml-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No technologies added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Key Features</CardTitle>
                  <CardDescription className="text-gray-400">Main features of your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex space-x-2">
                    <Input
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add a key feature"
                      className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button type="button" onClick={addFeature} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.features.length > 0 ? (
                    <div className="space-y-3">
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                            <span className="text-gray-200">{feature}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No features added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Challenges & Solutions */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Challenges & Solutions</CardTitle>
                  <CardDescription className="text-gray-400">Document the challenges faced and solutions implemented</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Challenges */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Challenges</Label>
                      <span className="text-sm text-gray-400">{formData.challenges.length} added</span>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={currentChallenge}
                        onChange={(e) => setCurrentChallenge(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChallenge())}
                        placeholder="Describe a challenge faced"
                        className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button type="button" onClick={addChallenge} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.challenges.length > 0 && (
                      <div className="space-y-2">
                        {formData.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-800/30">
                            <span className="text-orange-300">{challenge}</span>
                            <button
                              type="button"
                              onClick={() => removeChallenge(challenge)}
                              className="text-orange-500 hover:text-orange-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Solutions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Solutions</Label>
                      <span className="text-sm text-gray-400">{formData.solutions.length} added</span>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={currentSolution}
                        onChange={(e) => setCurrentSolution(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSolution())}
                        placeholder="Describe the solution implemented"
                        className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button type="button" onClick={addSolution} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.solutions.length > 0 && (
                      <div className="space-y-2">
                        {formData.solutions.map((solution, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg border border-green-800/30">
                            <span className="text-emerald-300">{solution}</span>
                            <button
                              type="button"
                              onClick={() => removeSolution(solution)}
                              className="text-emerald-500 hover:text-emerald-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Learnings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Key Learnings</Label>
                      <span className="text-sm text-gray-400">{formData.learnings.length} added</span>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={currentLearning}
                        onChange={(e) => setCurrentLearning(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLearning())}
                        placeholder="What did you learn from this project?"
                        className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button type="button" onClick={addLearning} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.learnings.length > 0 && (
                      <div className="space-y-2">
                        {formData.learnings.map((learning, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-800/30">
                            <span className="text-pink-300">{learning}</span>
                            <button
                              type="button"
                              onClick={() => removeLearning(learning)}
                              className="text-purple-500 hover:text-pink-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Project Settings */}
              <Card className="glass-card border-gray-800 sticky top-6">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Project Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="category" className="text-gray-300 mb-2 block">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="web" className="bg-gray-800">🌐 Web Development</option>
                      <option value="mobile" className="bg-gray-800">📱 Mobile App</option>
                      <option value="desktop" className="bg-gray-800">💻 Desktop App</option>
                      <option value="ai-ml" className="bg-gray-800">🤖 AI/ML</option>
                      <option value="iot" className="bg-gray-800">📡 IoT</option>
                      <option value="other" className="bg-gray-800">🔧 Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-gray-300 mb-2 block">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="completed" className="bg-gray-800">✅ Completed</option>
                      <option value="in-progress" className="bg-gray-800">🔄 In Progress</option>
                      <option value="planned" className="bg-gray-800">📅 Planned</option>
                      <option value="archived" className="bg-gray-800">📦 Archived</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-gray-300 mb-2 block">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low" className="bg-gray-800">📊 Low</option>
                      <option value="medium" className="bg-gray-800">📈 Medium</option>
                      <option value="high" className="bg-gray-800">🚀 High</option>
                      <option value="showcase" className="bg-gray-800">⭐ Showcase</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="repositoryUrl" className="text-gray-300">Repository URL</Label>
                    <Input
                      id="repositoryUrl"
                      type="url"
                      value={formData.repositoryUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, repositoryUrl: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="liveUrl" className="text-gray-300">Live Demo URL</Label>
                    <Input
                      id="liveUrl"
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                      placeholder="https://your-project.com"
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 font-display">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="startDate" className="text-gray-300">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">Leave empty if project is ongoing</p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-500/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Project...
                  </>
                ) : (
                  '🚀 Create Project'
                )}
              </Button>

              {/* Quick Stats */}
              <Card className="glass-card border-gray-800">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700">
                      <div className="text-2xl font-bold text-gradient">{formData.techStack.length}</div>
                      <div className="text-xs text-gray-400">Technologies</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700">
                      <div className="text-2xl font-bold text-gradient">{formData.features.length}</div>
                      <div className="text-xs text-gray-400">Features</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;