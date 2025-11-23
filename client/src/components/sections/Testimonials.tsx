import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Unisoft Technologies",
    role: "Frontend Design Intern",
    content: "Himanshu demonstrated excellent frontend skills during his internship. He contributed significantly to our event management project with clean, responsive designs and modern UI/UX principles.",
    duration: "3 Months",
    projects: ["Event Management System", "Admin Dashboard"],
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "VR Data Solutions",
    role: "Full Stack Developer Intern",
    content: "A quick learner with strong problem-solving abilities. Himanshu has been instrumental in developing scalable web applications using React, Node.js, and MongoDB for our enterprise clients.",
    duration: "4 Months", 
    projects: ["Client Portal", "Data Visualization", "API Integration"],
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "GH Raisoni College",
    role: "B.Tech Computer Science",
    content: "Consistently demonstrates strong technical aptitude and project execution skills. His academic projects showcase practical application of modern web technologies and innovative problem-solving approaches.",
    duration: "2019-2023",
    projects: ["Final Year Project", "Academic Research"],
    rating: 5,
    image: "/api/placeholder/80/80"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

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
    if (!isAutoPlaying) return;

    timeoutRef.current = setTimeout(() => {
      nextTestimonial();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying]);

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
    <section id="testimonials" className="relative min-h-screen py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-purple-900/20 to-black" />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, null],
              x: [null, Math.sin(i) * 50, null],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6"
          >
            <Star className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400 tracking-widest uppercase">
              Professional Journey
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Work & <span className="text-gradient bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Education</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From academic excellence to professional growth - my journey through technology and innovation
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-6xl mx-auto">
          <div className="relative h-[600px]">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.3 }
                }}
                className="absolute inset-0"
              >
                <div className="glass-panel rounded-3xl p-8 sm:p-12 h-full border border-white/10 backdrop-blur-xl">
                  <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
                    {/* Content Side */}
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-1 mb-4"
                          >
                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                            ))}
                          </motion.div>
                          
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl sm:text-4xl font-bold text-white mb-2"
                          >
                            {testimonials[currentIndex].name}
                          </motion.h3>
                          
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-cyan-400 text-lg font-medium"
                          >
                            {testimonials[currentIndex].role}
                          </motion.p>
                          
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-purple-300 text-sm"
                          >
                            {testimonials[currentIndex].duration}
                          </motion.p>
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.7, type: "spring" }}
                        >
                          <Quote className="w-12 h-12 text-cyan-400/20" />
                        </motion.div>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl text-gray-300 leading-relaxed"
                      >
                        "{testimonials[currentIndex].content}"
                      </motion.p>

                      {/* Projects */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="pt-4 border-t border-white/10"
                      >
                        <p className="text-sm text-cyan-400 font-medium mb-3">Key Projects:</p>
                        <div className="flex flex-wrap gap-2">
                          {testimonials[currentIndex].projects.map((project, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/20 rounded-full text-cyan-300 text-sm"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Visual Side */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="w-32 h-3 bg-cyan-400/30 rounded-full mx-auto"></div>
                            <div className="w-24 h-2 bg-purple-400/20 rounded-full mx-auto"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-3 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 hover:bg-purple-500/20 transition-all"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-cyan-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { number: "2+", label: "Years Experience" },
            { number: "15+", label: "Projects Completed" },
            { number: "3", label: "Internships" },
            { number: "100%", label: "Client Satisfaction" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}