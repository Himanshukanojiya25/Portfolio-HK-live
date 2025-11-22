import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import abstractBg from "@assets/generated_images/abstract_futuristic_gradient_background_with_neon_blue_and_purple_particles.png";

const projects = [
  {
    title: "Neon Dashboard",
    category: "Web App",
    description: "A futuristic analytics dashboard with real-time data visualization and customizable widgets.",
    image: abstractBg, // Using generated image as placeholder
    tech: ["React", "D3.js", "Tailwind"],
    links: { demo: "#", github: "#" }
  },
  {
    title: "Cyber Commerce",
    category: "E-Commerce",
    description: "High-performance e-commerce platform with 3D product previews and seamless checkout.",
    image: abstractBg,
    tech: ["Next.js", "Three.js", "Stripe"],
    links: { demo: "#", github: "#" }
  },
  {
    title: "AI Chat Interface",
    category: "AI / ML",
    description: "Minimalist chat interface for LLMs with streaming responses and code syntax highlighting.",
    image: abstractBg,
    tech: ["React", "OpenAI API", "Framer Motion"],
    links: { demo: "#", github: "#" }
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <h2 className="text-sm font-medium text-secondary tracking-widest uppercase mb-3">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-display">
              Featured <span className="text-gradient">Works</span>
            </h3>
          </div>
          <Button variant="outline" className="rounded-full border-primary/50 hover:bg-primary/10">
            View All Projects
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/50 transition-all duration-500"
            >
              {/* Image Area */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Links */}
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                   <a href={project.links.demo} className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors">
                      <ExternalLink size={20} />
                   </a>
                   <a href={project.links.github} className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors">
                      <Github size={20} />
                   </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {project.category}
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h4>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {project.tech.map(t => (
                    <span key={t} className="text-xs text-muted-foreground">#{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
