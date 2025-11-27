import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { testimonialsAPI, type Testimonial } from '@/services/testimonials';
import { Plus, Edit, Trash2, ArrowLeft, Search, Star, CheckCircle, XCircle, User } from 'lucide-react';

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, selectedStatus]);

  const loadTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getTestimonials();
      setTestimonials(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load testimonials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Approved') {
        filtered = filtered.filter(t => t.approved);
      } else if (selectedStatus === 'Pending') {
        filtered = filtered.filter(t => !t.approved);
      } else if (selectedStatus === 'Featured') {
        filtered = filtered.filter(t => t.featured);
      }
    }

    setFilteredTestimonials(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await testimonialsAPI.deleteTestimonial(id);
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
      loadTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    }
  };

  const toggleApprove = async (testimonial: Testimonial) => {
    try {
      if (!testimonial.approved) {
        await testimonialsAPI.approveTestimonial(testimonial.id);
        toast({
          title: 'Success',
          description: 'Testimonial approved',
        });
      } else {
        await testimonialsAPI.updateTestimonial(testimonial.id, {
          approved: false
        });
        toast({
          title: 'Success',
          description: 'Testimonial unapproved',
        });
      }
      loadTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update testimonial',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      await testimonialsAPI.updateTestimonial(testimonial.id, {
        featured: !testimonial.featured
      });
      toast({
        title: 'Success',
        description: `Testimonial ${!testimonial.featured ? 'added to' : 'removed from'} featured`,
      });
      loadTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update testimonial',
        variant: 'destructive',
      });
    }
  };

  const updateRating = async (testimonial: Testimonial, newRating: number) => {
    try {
      await testimonialsAPI.updateTestimonial(testimonial.id, {
        rating: newRating
      });
      toast({
        title: 'Success',
        description: 'Rating updated',
      });
      loadTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rating',
        variant: 'destructive',
      });
    }
  };

  const statusOptions = ['All', 'Approved', 'Pending', 'Featured'];

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
      >
        <div>
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Manage Testimonials</h1>
          <p className="text-white/60">Manage client testimonials and reviews</p>
        </div>
        
        <Link href="/admin/testimonials/new">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{testimonials.length}</div>
            <div className="text-white/60 text-sm">Total</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{testimonials.filter(t => t.approved).length}</div>
            <div className="text-white/60 text-sm">Approved</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{testimonials.filter(t => t.featured).length}</div>
            <div className="text-white/60 text-sm">Featured</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1) || '0.0'}
            </div>
            <div className="text-white/60 text-sm">Avg. Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 mt-2">Loading testimonials...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">No testimonials found.</p>
          <Link href="/admin/testimonials/new">
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Testimonial
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateRating(testimonial, star)}
                          className={`text-sm ${
                            star <= testimonial.rating
                              ? 'text-yellow-400'
                              : 'text-white/20'
                          } hover:text-yellow-300 transition-colors`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex gap-1">
                      <Badge variant={testimonial.approved ? "default" : "secondary"} className="text-xs">
                        {testimonial.approved ? 'Approved' : 'Pending'}
                      </Badge>
                      {testimonial.featured && (
                        <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 mb-4">
                    <p className="text-white/80 italic line-clamp-4 mb-4">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-white/60 text-xs truncate">
                        {testimonial.position}
                      </p>
                      <p className="text-white/40 text-xs truncate">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleApprove(testimonial)}
                      className={`flex-1 ${
                        testimonial.approved
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-yellow-400 hover:text-yellow-300'
                      }`}
                    >
                      {testimonial.approved ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatured(testimonial)}
                      className={testimonial.featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-white/40 hover:text-white/60'}
                    >
                      <Star className={`w-4 h-4 ${testimonial.featured ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Link href={`/admin/testimonials/edit/${testimonial.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}