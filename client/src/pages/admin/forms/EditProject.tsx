import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface EditProjectProps {
  projectId: string;
}

const EditProject = ({ projectId }: EditProjectProps) => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  
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
    startDate: '',
    endDate: '',
    techStack: [] as string[],
    features: [] as string[],
  });

  const [currentTech, setCurrentTech] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');

  useEffect(() => {
    // TODO: Fetch project data by ID
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await projectsService.getProjectById(projectId);
      // setProject(response.data);
      // setFormData(response.data);
      
      // Mock data
      setTimeout(() => {
        const mockProject = {
          _id: projectId,
          title: 'Sample Project',
          description: 'This is a sample project description.',
          shortDescription: 'A brief description',
          category: 'web',
          status: 'completed',
          priority: 'medium',
          repositoryUrl: 'https://github.com/username/repo',
          liveUrl: 'https://example.com',
          featuredImage: '',
          startDate: '2024-01-01',
          endDate: '2024-03-01',
          techStack: ['React', 'Node.js', 'MongoDB'],
          features: ['Responsive Design', 'User Authentication', 'Real-time Updates']
        };
        setProject(mockProject);
        setFormData(mockProject);
      }, 1000);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Update Project Data:', formData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to projects page after success
      setLocation('/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLocation('/admin/projects')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">Update project details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Brief description (max 200 characters)"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of your project"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>Technologies used in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentTech}
                    onChange={(e) => setCurrentTech(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  />
                  <Button type="button" onClick={addTech}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>Main features of your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop App</option>
                    <option value="ai-ml">AI/ML</option>
                    <option value="iot">IoT</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="showcase">Showcase</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="repositoryUrl">Repository URL</Label>
                  <Input
                    id="repositoryUrl"
                    type="url"
                    value={formData.repositoryUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, repositoryUrl: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <Label htmlFor="liveUrl">Live Demo URL</Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://your-project.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating Project...' : 'Update Project'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProject;