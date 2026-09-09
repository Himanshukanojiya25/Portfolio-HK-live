import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { testimonialsAPI, type CreateTestimonialData } from '@/services/testimonials';
import { ArrowLeft, Upload, Star, User } from 'lucide-react';

export default function CreateTestimonial() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.company || !formData.content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await testimonialsAPI.createTestimonial(formData);
      toast({
        title: 'Success',
        description: 'Testimonial created successfully',
      });
      setLocation('/admin/testimonials');
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to create testimonial',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/admin/testimonials')}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Back to Testimonials</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Add New Testimonial</h1>
            <p className="text-white/60 text-sm sm:text-base">Create a new client testimonial</p>
          </div>
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
                    Upload client's profile picture
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
                        Upload Image
                      </Label>
                      <div className="relative">
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          className="w-full border-dashed border-primary/30 hover:border-primary/50 text-primary"
                          disabled={isLoading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isLoading ? 'Uploading...' : 'Choose Image'}
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
                    />
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
                          className={`text-2xl transition-all duration-200 ${
                            star <= formData.rating
                              ? 'text-yellow-400 scale-110'
                              : 'text-white/20 hover:text-white/40'
                          }`}
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
                  className="flex-1 border-white/20 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Testimonial'
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