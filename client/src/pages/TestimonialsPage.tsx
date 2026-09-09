import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { testimonialApi } from '../services/publicApi';
import { 
  Star, 
  Quote, 
  Award, 
  Users,
  TrendingUp,
  Sparkles,
  Calendar
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialApi.getAll();
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: testimonials.length,
    averageRating: testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
      : '0.0',
    featured: testimonials.filter(t => t.rating === 5).length,
    companies: [...new Set(testimonials.map(t => t.clientCompany).filter(Boolean))].length
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
              <Quote className="w-12 h-12 text-yellow-400" />
            </div>
          </motion.div>
          <h1 className="heading-responsive font-bold mb-4">
            <span className="text-gradient">Client Testimonials</span>
          </h1>
          <p className="text-muted-foreground text-responsive max-w-2xl mx-auto">
            What clients and colleagues say about working with me. Their feedback drives my continuous improvement.
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
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.averageRating}</div>
            <div className="text-sm text-muted-foreground">Avg. Rating</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.featured}</div>
            <div className="text-sm text-muted-foreground">5-Star Reviews</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{stats.companies}</div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
        </motion.div>

        {/* Featured Testimonials Slider */}
        {testimonials.filter(t => t.rating >= 4).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold">Featured Testimonials</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                Top Rated
              </div>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {testimonials
                .filter(t => t.rating >= 4)
                .map((testimonial) => (
                  <SwiperSlide key={testimonial._id}>
                    <FeaturedTestimonialCard testimonial={testimonial} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </motion.div>
        )}

        {/* All Testimonials */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-2xl"
          >
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground">
              Check back soon for client feedback
            </p>
          </motion.div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </div>

            {/* Mobile List */}
            <div className="md:hidden space-y-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          </>
        )}

        {/* Rating Distribution */}
        {testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">Rating Distribution</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.total} total reviews
              </div>
            </div>

            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = testimonials.filter(t => t.rating === rating).length;
                const percentage = (count / testimonials.length) * 100;
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-16">
                      {renderStars(rating)}
                      <span className="text-sm font-medium">{rating}</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: rating * 0.1 }}
                          className={`h-3 rounded-full ${
                            rating >= 4 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            rating >= 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium">
                      {count} ({percentage.toFixed(0)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const FeaturedTestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
          {testimonial.clientImage ? (
            <img
              src={testimonial.clientImage}
              alt={testimonial.clientName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-2xl">👤</div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{testimonial.clientName}</h3>
          <p className="text-sm text-muted-foreground">
            {testimonial.clientRole}
            {testimonial.clientCompany && ` • ${testimonial.clientCompany}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-yellow-500/20" />
        <p className="text-foreground/80 italic pl-6">"{testimonial.content}"</p>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 inline-block mr-2" />
          {formatDate(testimonial.createdAt)}
        </div>
        <div className="px-3 py-1 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-500 rounded-full text-xs font-medium">
          Featured
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
          {testimonial.clientImage ? (
            <img
              src={testimonial.clientImage}
              alt={testimonial.clientName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xl">👤</div>
          )}
        </div>
        <div>
          <h3 className="font-bold">{testimonial.clientName}</h3>
          <p className="text-sm text-muted-foreground">
            {testimonial.clientRole}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>

      <p className="text-foreground/80 mb-6 line-clamp-4">"{testimonial.content}"</p>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {testimonial.clientCompany}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(testimonial.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;