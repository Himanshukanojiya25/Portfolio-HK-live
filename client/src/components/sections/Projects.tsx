import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import abstractBg from "@assets/generated_images/abstract_futuristic_gradient_background_with_neon_blue_and_purple_particles.png";

const projects = [
  {
    title: "CRM System",
    category: "Full Stack Web App",
    description: "A comprehensive Customer Relationship Management system built with Node.js and Express. Features user management, customer tracking, and sales pipeline management.",
    image: abstractBg,
    tech: ["Node.js", "Express", "EJS", "MongoDB"],
    links: { 
      demo: "#", 
      github: "https://github.com/Himanshukanojiya25/CRM-Project" 
    }
  },
  {
    title: "PlaySpot - Turf Booking",
    category: "Frontend Application",
    description: "A modern sports turf booking platform with intuitive UI. Built with React and TypeScript for seamless user experience in booking sports facilities.",
    image: abstractBg,
    tech: ["React", "TypeScript", "Tailwind CSS"],
    links: { 
      demo: "#", 
      github: "https://github.com/Himanshukanojiya25/PlaySpot" 
    }
  },
  {
    title: "Interactive Wedding Invitation",
    category: "Frontend Design",
    description: "A beautiful and engaging wedding invitation website with smooth animations and responsive design. Perfect for modern digital wedding invitations.",
    image: abstractBg,
    tech: ["React", "TypeScript", "CSS Animations"],
    links: { 
      demo: "https://praful-wedding.netlify.app/", 
      github: "https://github.com/Himanshukanojiya25/Wedding.Invitation" 
    }
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-4 sm:gap-6"
        >
          <div className="flex-1">
            <h2 className="text-xs sm:text-sm font-medium text-secondary tracking-widest uppercase mb-2 sm:mb-3">
              Portfolio
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display">
              My <span className="text-gradient">Projects</span>
            </h3>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-primary/50 hover:bg-primary/10 min-h-[44px] text-sm sm:text-base"
            onClick={() => window.open('https://github.com/Himanshukanojiya25', '_blank')}
          >
            View All Projects
          </Button>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: Math.min(index * 0.15, 0.3) // Cap delay for mobile
              }}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Area - Mobile Optimized */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                {/* Mobile Touch Overlay */}
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300" />
                
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                  loading="lazy" // Lazy loading for mobile
                />
                
                {/* Overlay Links - Mobile Touch Friendly */}
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 sm:gap-4 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
                  {project.links.demo !== "#" && (
                    <a 
                      href={project.links.demo} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label={`View ${project.title} demo`}
                    >
                      <ExternalLink size={18} className="sm:size-5" />
                    </a>
                  )}
                  <a 
                    href={project.links.github} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`View ${project.title} source code`}
                  >
                    <Github size={18} className="sm:size-5" />
                  </a>
                </div>

                {/* Mobile Touch Hint */}
                <div className="absolute bottom-2 right-2 z-30 sm:hidden">
                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Tap to view
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                {/* Category Badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h4>

                {/* Description */}
                <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 sm:gap-2 pt-3 sm:pt-4 border-t border-white/5">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md"
                    >
                      #{tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile Action Button */}
              <div className="p-4 border-t border-white/5 sm:hidden">
                <Button 
                  variant="outline" 
                  className="w-full rounded-lg border-primary/30 text-primary hover:bg-primary/10 text-sm min-h-[44px]"
                  onClick={() => window.open(project.links.github, '_blank')}
                >
                  View Code
                  <ArrowUpRight size={16} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:hidden text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Interested in seeing more projects?
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 min-h-[44px]"
            onClick={() => window.open('https://github.com/Himanshukanojiya25', '_blank')}
          >
            View GitHub
          </Button>
        </motion.div>

        {/* Desktop Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 hidden sm:block text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Want to see more of my work?
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg"
            size="lg"
            onClick={() => window.open('https://github.com/Himanshukanojiya25', '_blank')}
          >
            Explore GitHub
            <ArrowUpRight size={20} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}