import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { skillsAPI, type CreateSkillData } from '@/services/skills';
import { 
  ArrowLeft, 
  Plus,
  Check,
  Sparkles,
  Zap,
  Code2,
  Palette
} from 'lucide-react';

const CreateSkill = () => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // ✅ FIXED: Match backend enum values EXACTLY
  const [formData, setFormData] = useState<CreateSkillData>({
    name: '',
    category: 'programming', // ✅ lowercase
    level: 75, // ✅ This is percentage, but backend expects number 1-100
    icon: '',
    color: '#6B7280', // Default gray
    featured: false,
    order: 0,
  });

  // ✅ Map level percentage to enum string for display only
  const getLevelString = (level: number): string => {
    if (level <= 30) return 'beginner';
    if (level <= 60) return 'intermediate';
    if (level <= 85) return 'advanced';
    return 'expert';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Skill name is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('📤 Creating skill with data:', formData);
      
      // ✅ Prepare data EXACTLY matching backend expectations
      const skillData: CreateSkillData = {
        name: formData.name.trim(),
        category: formData.category.toLowerCase(), // ✅ Ensure lowercase
        level: formData.level, // ✅ Keep as number (backend might expect number now)
        icon: formData.icon || `Fa${formData.name.replace(/\s+/g, '')}`,
        color: formData.color,
        featured: formData.featured || false,
        order: formData.order || 0,
      };
      
      console.log('📦 Sending to backend:', skillData);
      
      const createdSkill = await skillsAPI.createSkill(skillData);
      
      if (createdSkill) {
        console.log('✅ Skill created:', createdSkill);
        
        toast({
          title: '🎉 Success!',
          description: 'Skill has been created successfully',
          className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        });
        
        // Redirect to skills page after short delay
        setTimeout(() => {
          setLocation('/admin/skills');
        }, 1500);
      } else {
        throw new Error('Failed to create skill');
      }
    } catch (error: any) {
      console.error('❌ Error creating skill:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create skill. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Match backend enum exactly
  const categoryOptions = [
    { label: 'Programming', value: 'programming' },
    { label: 'Framework', value: 'framework' },
    { label: 'Tool', value: 'tool' },
    { label: 'Language', value: 'language' },
    { label: 'Soft Skill', value: 'soft-skill' },
    { label: 'Other', value: 'other' }
  ];

  // Common color options
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Green', value: '#10B981' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Yellow', value: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation('/admin/skills')}
            className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Add New Skill</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Add a new skill to your portfolio</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Skill Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">Basic details about the skill</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Skill Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter skill name (e.g., React, Node.js, TypeScript)"
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-gray-300">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full mt-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categoryOptions.map(({ label, value }) => (
                          <option key={value} value={value} className="bg-gray-800">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="level" className="text-gray-300">Proficiency Level</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Beginner</span>
                          <span className="text-sm text-gray-400">Expert</span>
                        </div>
                        <input
                          type="range"
                          id="level"
                          min="10"
                          max="100"
                          step="5"
                          value={formData.level}
                          onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>10%</span>
                          <span className="font-medium text-blue-400">
                            {formData.level}% ({getLevelString(formData.level)})
                          </span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="icon" className="text-gray-300">Icon Name (Optional)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g., FaReact, SiJavascript, BiCodeAlt"
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Leave empty to auto-generate from skill name
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Color Selection */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Skill Color
                  </CardTitle>
                  <CardDescription className="text-gray-400">Choose a color for this skill</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Label className="text-gray-300 mb-3 block">Quick Color Picker</Label>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className="relative w-10 h-10 rounded-lg transition-transform hover:scale-110"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {formData.color === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customColor" className="text-gray-300 mb-2 block">Custom Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="customColor"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16 h-12 p-1 bg-gray-800 border-gray-700 cursor-pointer"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        placeholder="#6B7280"
                        className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Preview */}
              <Card className="glass-card border-gray-800 sticky top-6">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Skill Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                        style={{ backgroundColor: formData.color }}
                      >
                        {formData.icon ? 'Icon' : formData.name.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100">{formData.name || 'Skill Name'}</p>
                        <p className="text-sm text-gray-400 capitalize">
                          {categoryOptions.find(c => c.value === formData.category)?.label || formData.category} • {getLevelString(formData.level)}
                        </p>
                      </div>
                    </div>

                    {/* Level Indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Skill Level</span>
                        <span className="text-gray-100 font-medium">{formData.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${formData.level}%`,
                            background: `linear-gradient(to right, ${formData.color}80, ${formData.color})`
                          }}
                        />
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">Featured Skill</p>
                          <p className="text-xs text-gray-400">Show in highlights</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Settings */}
              <Card className="glass-card border-gray-800">
                <CardHeader className="bg-gray-800/30 border-b border-gray-800">
                  <CardTitle className="text-gray-100">Settings</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="mt-2 bg-gray-800/50 border-gray-700 text-gray-100"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Lower numbers appear first
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Skill...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Skill
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSkill;