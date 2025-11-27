import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { projectsAPI, type CreateProjectData } from '@/services/projects';
import { Plus, X, Upload, Link2, Github } from 'lucide-react';

const projectFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tech: z.array(z.string()).min(1, 'Add at least one technology'),
  links: z.object({
    demo: z.string().url('Must be a valid URL').or(z.literal('#')),
    github: z.string().url('Must be a valid GitHub URL'),
  }),
  gradient: z.string().min(1, 'Gradient is required'),
  featured: z.boolean().default(false),
});

interface ProjectFormProps {
  project?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(project?.image || '');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || '',
      category: project?.category || '',
      description: project?.description || '',
      tech: project?.tech || [],
      links: {
        demo: project?.links?.demo || '',
        github: project?.links?.github || '',
      },
      gradient: project?.gradient || 'from-blue-500 to-purple-600',
      featured: project?.featured || false,
    },
  });

  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-cyan-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-cyan-500 to-blue-600',
  ];

  const addTech = () => {
    if (techInput.trim() && !form.getValues('tech').includes(techInput.trim())) {
      const currentTech = form.getValues('tech');
      form.setValue('tech', [...currentTech, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    const currentTech = form.getValues('tech');
    form.setValue('tech', currentTech.filter(tech => tech !== techToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof projectFormSchema>) => {
    setIsLoading(true);
    try {
      let imageUrl = project?.image;

      // Upload new image if selected
      if (imageFile) {
        const uploadResponse = await projectsAPI.uploadImage(imageFile);
        imageUrl = uploadResponse.data.url;
      }

      const projectData: CreateProjectData = {
        ...values,
        image: imageUrl,
      };

      if (project) {
        // Update existing project
        await projectsAPI.updateProject(project.id, projectData);
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
      } else {
        // Create new project
        await projectsAPI.createProject(projectData);
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${project ? 'update' : 'create'} project`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </CardTitle>
          <CardDescription className="text-white/60">
            {project ? 'Update your project details' : 'Add a new project to your portfolio'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CRM System" 
                          className="bg-white/5 border-white/10 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Category</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full Stack Web App" 
                          className="bg-white/5 border-white/10 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A comprehensive Customer Relationship Management system built with modern technologies..."
                        className="bg-white/5 border-white/10 text-white min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Technologies */}
              <FormField
                control={form.control}
                name="tech"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Technologies</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="React, Node.js, MongoDB..."
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTech();
                              }
                            }}
                            className="bg-white/5 border-white/10 text-white flex-1"
                          />
                          <Button type="button" onClick={addTech} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tech) => (
                            <Badge key={tech} variant="secondary" className="gap-1">
                              {tech}
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => removeTech(tech)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="links.demo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        Demo URL
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com" 
                          className="bg-white/5 border-white/10 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-white/60">
                        Use '#' if no demo available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="links.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub URL
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/username/repo" 
                          className="bg-white/5 border-white/10 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gradient Selection */}
              <FormField
                control={form.control}
                name="gradient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Gradient Theme</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {gradients.map((gradient) => (
                          <div
                            key={gradient}
                            className={`h-12 rounded-lg cursor-pointer border-2 ${
                              field.value === gradient 
                                ? 'border-primary ring-2 ring-primary/20' 
                                : 'border-white/10 hover:border-white/30'
                            }`}
                            onClick={() => field.onChange(gradient)}
                          >
                            <div className={`h-full rounded-md bg-gradient-to-r ${gradient}`} />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-3">
                <FormLabel className="text-white">Project Image</FormLabel>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {imagePreview && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={imagePreview}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <FormDescription className="text-white/60 mt-2">
                      Upload a project screenshot or logo (optional)
                    </FormDescription>
                  </div>
                </div>
              </div>

              {/* Featured Toggle */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-white">Featured Project</FormLabel>
                      <FormDescription className="text-white/60">
                        Show this project prominently in your portfolio
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-6 h-6 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : project ? (
                    'Update Project'
                  ) : (
                    'Create Project'
                  )}
                </Button>
                
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}