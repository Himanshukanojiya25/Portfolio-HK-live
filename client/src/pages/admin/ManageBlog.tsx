import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { blogAPI, type BlogPost } from '@/services/blog';
import { Plus, Edit, Trash2, ArrowLeft, Search, Eye, EyeOff, Star, Calendar, Clock } from 'lucide-react';

export default function ManageBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedStatus]);

  const loadPosts = async () => {
    try {
      const response = await blogAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Published') {
        filtered = filtered.filter(post => post.published);
      } else if (selectedStatus === 'Draft') {
        filtered = filtered.filter(post => !post.published);
      } else if (selectedStatus === 'Featured') {
        filtered = filtered.filter(post => post.featured);
      }
    }

    setFilteredPosts(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await blogAPI.deletePost(id);
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await blogAPI.updatePostStatus(post.id, !post.published);
      toast({
        title: 'Success',
        description: `Post ${!post.published ? 'published' : 'unpublished'}`,
      });
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post status',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      await blogAPI.updatePost(post.id, {
        featured: !post.featured
      });
      toast({
        title: 'Success',
        description: `Post ${!post.featured ? 'added to' : 'removed from'} featured`,
      });
      loadPosts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    }
  };

  const statusOptions = ['All', 'Published', 'Draft', 'Featured'];

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
          <h1 className="text-3xl font-bold text-white">Manage Blog</h1>
          <p className="text-white/60">Create and manage your blog posts</p>
        </div>
        
        <Link href="/admin/blog/new">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{posts.length}</div>
            <div className="text-white/60 text-sm">Total Posts</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{posts.filter(p => p.published).length}</div>
            <div className="text-white/60 text-sm">Published</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{posts.filter(p => p.featured).length}</div>
            <div className="text-white/60 text-sm">Featured</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{posts.reduce((acc, post) => acc + post.views, 0)}</div>
            <div className="text-white/60 text-sm">Total Views</div>
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
                placeholder="Search posts..."
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

      {/* Blog Posts */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 mt-2">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">No blog posts found.</p>
          <Link href="/admin/blog/new">
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="lg:w-48 lg:h-32 w-full h-48 rounded-lg overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                          <p className="text-white/60 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                            {post.featured && (
                              <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline">{post.category}</Badge>
                            <div className="flex items-center gap-4 text-white/40 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readingTime} min
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views} views
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePublish(post)}
                            className={post.published ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}
                          >
                            {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleFeatured(post)}
                            className={post.featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-white/40 hover:text-white/60'}
                          >
                            <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-white/40">
                        <div className="flex items-center gap-4">
                          <span>By {post.author}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
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