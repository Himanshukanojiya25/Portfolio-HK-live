import { motion } from "framer-motion";
import { Quote, Star, Award, Trophy } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Unisoft Technologies",
    role: "Frontend Design Intern",
    content: "Himanshu demonstrated excellent frontend skills during his internship. He contributed significantly to our event management project with clean, responsive designs and modern UI components.",
    duration: "Feb 2024 - May 2024",
    achievements: ["Responsive Design", "UI Components", "Project Collaboration"]
  },
  {
    name: "VR Data Solutions", 
    role: "Full Stack Developer Intern",
    content: "A quick learner with strong problem-solving abilities. Himanshu has been instrumental in developing scalable web applications for our clients and showed great adaptability with new technologies.",
    duration: "Jun 2024 - Present", 
    achievements: ["Full Stack Development", "Problem Solving", "Client Projects"]
  },
  {
    name: "GH Raisoni College",
    role: "B.Tech Computer Science",
    content: "Consistently demonstrates strong technical aptitude and project execution skills. His academic projects showcase practical application of modern web technologies and innovative solutions.",
    duration: "2022 - 2026",
    achievements: ["Academic Excellence", "Project Development", "Technical Skills"]
  }
];

function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
      
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 text-white/10 w-12 h-12 group-hover:text-primary/20 transition-colors duration-300" />
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.3 }}
          className="text-white/80 leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
        >
          "{testimonial.content}"
        </motion.p>
        
        {/* Achievements - Show on expand */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {testimonial.achievements.map((achievement: string, i: number) => (
              <span
                key={i}
                className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
              >
                {achievement}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-lg">{testimonial.name}</div>
              <div className="text-primary text-sm">{testimonial.role}</div>
              <div className="text-white/40 text-xs mt-1">{testimonial.duration}</div>
            </div>
            <Award className="text-primary/60 group-hover:text-primary transition-colors duration-300" />
          </div>
        </div>
      </div>
      
      {/* Expand hint */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.4 }}
        className="text-center mt-4 pt-4 border-t border-white/5"
      >
        <span className="text-xs text-white/40 group-hover:text-primary/60 transition-colors duration-300">
          {isExpanded ? "Click to collapse" : "Click to expand"}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 md:py-36 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold text-primary tracking-widest uppercase mb-4"
          >
            Experience & Education
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            My <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Journey</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            From academic excellence to professional experience, here's a glimpse of my journey in tech.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 sm:mt-24"
        >
          {[
            { number: "2", label: "Internships", icon: Award },
            { number: "10+", label: "Projects", icon: Trophy },
            { number: "2+", label: "Years Learning", icon: Star },
            { number: "100%", label: "Dedication", icon: Quote }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-white/60 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}