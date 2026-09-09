import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { testimonialApi } from "@/services/publicApi";

// Simple Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6 h-full flex flex-col"
    >
      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        {renderStars(testimonial.rating || 5)}
        <span className="text-sm text-muted-foreground">
          {testimonial.rating || 5}.0
        </span>
      </div>

      {/* Quote */}
      <div className="relative mb-6 flex-1">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
        <p className="text-foreground/80 italic pl-6 line-clamp-4 sm:line-clamp-5">
          "{testimonial.content}"
        </p>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
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
        <div className="flex-1">
          <h4 className="font-bold text-white">{testimonial.clientName}</h4>
          <p className="text-sm text-muted-foreground">
            {testimonial.clientRole}
            {testimonial.clientCompany && ` • ${testimonial.clientCompany}`}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(testimonial.createdAt)}
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialApi.getAll();
      setTestimonials(response.data.testimonials || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
      // Fallback data
      setTestimonials([
        {
          _id: '1',
          clientName: "Unisoft Technologies",
          clientRole: "Frontend Design Intern",
          content: "Himanshu demonstrated excellent frontend skills during his internship.",
          rating: 5,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          clientName: "VR Data Solutions",
          clientRole: "Full Stack Developer Intern",
          content: "A quick learner with strong problem-solving abilities.",
          rating: 5,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    timeoutRef.current = setTimeout(() => {
      nextTestimonial();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, testimonials.length]);

  const stats = {
    total: testimonials.length,
    averageRating: testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonials.length).toFixed(1)
      : '0.0',
    featured: testimonials.filter(t => (t.rating || 5) === 5).length,
    companies: [...new Set(testimonials.map(t => t.clientCompany).filter(Boolean))].length
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <section id="testimonials" className="py-12 sm:py-20 md:py-28 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold text-primary tracking-widest uppercase mb-3 sm:mb-4"
          >
            Client Feedback
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            What <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Clients Say</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto px-4"
          >
            {stats.total} testimonials with {stats.averageRating} average rating
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
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

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* Testimonials Grid/Carousel */}
        {!loading && !error && testimonials.length > 0 && (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {testimonials.slice(0, 6).map((testimonial, index) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} index={index} />
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden mb-8">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="w-full"
                >
                  {testimonials[currentIndex] && (
                    <TestimonialCard 
                      testimonial={testimonials[currentIndex]} 
                      index={currentIndex} 
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full glass-card hover:bg-accent transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentIndex === index 
                          ? 'bg-primary w-6' 
                          : 'bg-muted-foreground'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full glass-card hover:bg-accent transition-colors"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Auto-play toggle */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 rounded-full glass-card hover:bg-accent transition-colors"
                  aria-label={isAutoPlaying ? "Pause auto-play" : "Play auto-play"}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Quote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for client feedback
            </p>
          </div>
        )}

        {/* Rating Distribution */}
        {testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold mb-6 text-center">Rating Distribution</h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = testimonials.filter(t => (t.rating || 5) === rating).length;
                const percentage = (count / testimonials.length) * 100;
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-16">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
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
    </section>
  );
}