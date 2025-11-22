import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    title: "CRM System",
    category: "Full Stack Web App",
    description: "A comprehensive Customer Relationship Management system built with Node.js and Express. Features user management, customer tracking, and sales pipeline management.",
    tech: ["Node.js", "Express", "EJS", "MongoDB"],
    links: { 
      demo: "#", 
      github: "https://github.com/Himanshukanojiya25/CRM-Project" 
    },
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "PlaySpot - Turf Booking",
    category: "Frontend Application",
    description: "A modern sports turf booking platform with intuitive UI. Built with React and TypeScript for seamless user experience in booking sports facilities.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    links: { 
      demo: "#", 
      github: "https://github.com/Himanshukanojiya25/PlaySpot" 
    },
    gradient: "from-green-500 to-cyan-600"
  },
  {
    title: "Interactive Wedding Invitation",
    category: "Frontend Design",
    description: "A beautiful and engaging wedding invitation website with smooth animations and responsive design. Perfect for modern digital wedding invitations.",
    tech: ["React", "TypeScript", "CSS Animations"],
    links: { 
      demo: "https://praful-wedding.netlify.app/", 
      github: "https://github.com/Himanshukanojiya25/Wedding.Invitation" 
    },
    gradient: "from-pink-500 to-rose-600"
  }
];

// Magnetic card component - Mobile friendly
function MagneticCard({ children, index }: { children: React.ReactNode; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.1;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMobile ? 'none' : `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// 3D Flip Card Component - Mobile optimized
function FlipCard({ project, index }: { project: any; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Tablet & mobile
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="flip-card w-full h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px]" onClick={isMobile ? handleFlip : undefined}>
      <motion.div
        className="flip-card-inner w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 360 }}
        transition={{ duration: 0.6, animationDirection: "normal" }}
        onAnimationComplete={() => setIsAnimating(false)}
        onMouseEnter={!isMobile ? handleFlip : undefined}
        onMouseLeave={!isMobile ? () => setIsFlipped(false) : undefined}
      >
        {/* Front of Card */}
        <div className="flip-card-front w-full h-full">
          <MagneticCard index={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Floating elements */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-500 delay-100" />

              {/* Content */}
              <div className="relative z-10 flex-1">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="text-xs font-semibold text-primary px-2 sm:px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {project.category}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-white/5 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ArrowUpRight size={14} className="sm:w-4 sm:h-4 text-white/60" />
                  </motion.div>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                  {project.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Tech stack with hover effects */}
              <div className="relative z-10">
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {project.tech.map((tech: string, techIndex: number) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + techIndex * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="text-xs text-white/60 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      #{tech}
                    </motion.span>
                  ))}
                </div>

                {/* Flip hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className="text-center"
                >
                  <p className="text-xs text-white/40 group-hover:text-primary/60 transition-colors duration-300">
                    {isMobile ? "Tap to flip ↻" : "Hover to flip ↻"}
                  </p>
                </motion.div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </motion.div>
          </MagneticCard>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 flex flex-col justify-between">
            {/* Back content */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Project Details</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4 sm:mb-6">
                {project.description}
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-primary text-sm font-semibold">Technologies</p>
                  <p className="text-white/60 text-sm">{project.tech.join(", ")}</p>
                </div>
                <div>
                  <p className="text-primary text-sm font-semibold">Category</p>
                  <p className="text-white/60 text-sm">{project.category}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {project.links.demo !== "#" && (
                <motion.a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 sm:py-3 px-4 rounded-xl text-center hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  Live Demo
                </motion.a>
              )}
              <motion.a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-white/5 text-white text-sm font-semibold py-2 sm:py-3 px-4 rounded-xl text-center border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Github size={14} className="sm:w-4 sm:h-4" />
                Code
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .flip-card {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 1rem;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .flip-card {
            min-height: 350px;
          }
        }
        
        @media (max-width: 640px) {
          .flip-card {
            min-height: 320px;
          }
        }
      `}</style>
    </div>
  );
}

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="projects" className="py-12 sm:py-20 md:py-28 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-60 sm:h-60 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with animation */}
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
            Featured Work
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            Creative <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Projects</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-lg text-white/60 max-w-2xl mx-auto px-4"
          >
            Explore my latest work where design meets functionality. Each project tells a unique story of innovation.
          </motion.p>
        </motion.div>

        {/* Projects Grid - Mobile first responsive design */}
        <div className={`
          grid gap-4 sm:gap-6 md:gap-8
          ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}
          max-w-7xl mx-auto
        `}>
          {projects.map((project, index) => (
            <div key={index} className="w-full h-full">
              <FlipCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base sm:text-xl text-white/60 mb-6 sm:mb-8"
          >
            Want to see more of my work?
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => window.open('https://github.com/Himanshukanojiya25', '_blank')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-2xl shadow-primary/25"
            >
              Explore GitHub
              <ArrowUpRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>

          {/* Easter egg hint */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-xs sm:text-sm text-white/30 mt-6 sm:mt-8 font-mono"
          >
            💡 {isMobile ? "Tap cards to flip" : "Hover over cards to flip"}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}