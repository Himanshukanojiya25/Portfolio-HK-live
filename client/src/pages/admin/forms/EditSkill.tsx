import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface EditSkillProps {
  skillId: string;
}

const EditSkill = ({ skillId }: EditSkillProps) => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'programming',
    level: 'intermediate',
    icon: '',
    color: '#6B7280',
    description: '',
    yearsOfExperience: 0,
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    // TODO: Fetch skill data by ID
    fetchSkill();
  }, [skillId]);

  const fetchSkill = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await skillsService.getSkillById(skillId);
      // setSkill(response.data);
      // setFormData(response.data);
      
      // Mock data
      setTimeout(() => {
        const mockSkill = {
          _id: skillId,
          name: 'React',
          category: 'framework',
          level: 'advanced',
          icon: 'FaReact',
          color: '#61DAFB',
          description: 'A JavaScript library for building user interfaces',
          yearsOfExperience: 3,
          isFeatured: true,
          isActive: true,
        };
        setSkill(mockSkill);
        setFormData(mockSkill);
      }, 1000);
    } catch (error) {
      console.error('Error fetching skill:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Update Skill Data:', formData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to skills page after success
      setLocation('/admin/skills');
    } catch (error) {
      console.error('Error updating skill:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!skill) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading skill...</p>
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
          onClick={() => setLocation('/admin/skills')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Skill</h1>
          <p className="text-gray-600 mt-1">Update skill details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Information</CardTitle>
                <CardDescription>Basic details about the skill</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Skill Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter skill name (e.g., React, Node.js)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this skill and your experience with it"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icon Name</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g., FaReact, SiJavascript"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Settings</CardTitle>
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
                    <option value="programming">Programming</option>
                    <option value="framework">Framework</option>
                    <option value="tool">Tool</option>
                    <option value="language">Language</option>
                    <option value="soft-skill">Soft Skill</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="level">Proficiency Level</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#6B7280"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      Featured Skill
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Active Skill
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon ? 'Icon' : formData.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{formData.name || 'Skill Name'}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {formData.level} • {formData.category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating Skill...' : 'Update Skill'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSkill;