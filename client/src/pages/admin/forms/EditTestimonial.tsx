import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { testimonialsAPI, type Testimonial, type CreateTestimonialData } from '@/services/testimonials';
import { ArrowLeft, Upload, Star, User, Save, Trash2 } from 'lucide-react';

export default function EditTestimonial() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  
  const [formData, setFormData] = useState<CreateTestimonialData>({
    name: '',
    position: '',
    company: '',
    avatar: '',
    content: '',
    rating: 5,
    featured: false,
    approved: true
  });

  useEffect(() => {
    loadTestimonial();
  }, [id]);

  const loadTestimonial = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const testimonials = await testimonialsAPI.getTestimonials();
      const found = testimonials.find(t => t.id === id || t._id === id);
      
      if (found) {
        setTestimonial(found);
        setFormData({
          name: found.name,
          position: found.position,
          company: found.company,
          avatar: found.avatar || '',
          content: found.content,
          rating: found.rating,
          featured: found.featured,
          approved: found.approved
        });
      } else {
        toast({
          title: 'Not found',
          description: 'Testimonial not found',
          variant: 'destructive',
        });
        setLocation('/admin/testimonials');
      }
    } catch (error) {
      console.error('Error loading testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to load testimonial',
        variant: 'destructive',
      });
      setLocation('/admin/testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateTestimonialData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await testimonialsAPI.uploadAvatar(file);
      handleChange('avatar', response.url);
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !testimonial) return;
    
    if (!formData.name || !formData.position || !formData.company || !formData.content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await testimonialsAPI.updateTestimonial(id, formData);
      toast({
        title: 'Success',
        description: 'Testimonial updated successfully',
      });
      setLocation('/admin/testimonials');
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to update testimonial',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !testimonial) return;
    
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    try {
      await testimonialsAPI.deleteTestimonial(id);
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
      setLocation('/admin/testimonials');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 mt-4">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">Testimonial not found</p>
          <Button
            onClick={() => setLocation('/admin/testimonials')}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Back to Testimonials
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin/testimonials')}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Back to Testimonials</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Testimonial</h1>
              <p className="text-white/60 text-sm sm:text-base">Update client testimonial details</p>
            </div>
          </div>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSaving}
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar & Status */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar Upload */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Avatar</CardTitle>
                  <CardDescription className="text-white/60">
                    Update client's profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/10">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white/30" />
                      )}
                    </div>
                    
                    <div className="w-full">
                      <Label htmlFor="avatar-upload" className="block mb-2 text-white/80">
                        Upload New Image
                      </Label>
                      <div className="relative">
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={isSaving}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          className="w-full border-dashed border-primary/30 hover:border-primary/50 text-primary"
                          disabled={isSaving}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isSaving ? 'Uploading...' : 'Change Image'}
                        </Button>
                      </div>
                      <p className="text-xs text-white/40 mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Settings */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="featured" className="text-white/80">Featured</Label>
                      <p className="text-sm text-white/40">Show in featured section</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleChange('featured', checked)}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="approved" className="text-white/80">Approved</Label>
                      <p className="text-sm text-white/40">Publish immediately</p>
                    </div>
                    <Switch
                      id="approved"
                      checked={formData.approved}
                      onCheckedChange={(checked) => handleChange('approved', checked)}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm text-white/60">Created</div>
                    <div className="text-white/80">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-4xl font-bold text-yellow-400">
                      {formData.rating}.0
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleChange('rating', star)}
                          disabled={isSaving}
                          className={`text-2xl transition-all duration-200 ${
                            star <= formData.rating
                              ? 'text-yellow-400 scale-110'
                              : 'text-white/20 hover:text-white/40'
                          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Star className={star <= formData.rating ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white/80">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white mt-2"
                        disabled={isSaving}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="position" className="text-white/80">Position *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleChange('position', e.target.value)}
                        placeholder="CEO, CTO, etc."
                        className="bg-white/5 border-white/10 text-white mt-2"
                        disabled={isSaving}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-white/80">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Google, Microsoft, etc."
                      className="bg-white/5 border-white/10 text-white mt-2"
                      disabled={isSaving}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white/80">Testimonial *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      placeholder="Share the amazing feedback..."
                      className="bg-white/5 border-white/10 text-white mt-2 min-h-[200px] resize-none"
                      disabled={isSaving}
                      required
                    />
                    <p className="text-sm text-white/40 mt-2">
                      {formData.content.length}/1000 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/admin/testimonials')}
                  disabled={isSaving}
                  className="flex-1 border-white/20 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}