import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Unisoft Technologies",
    role: "Frontend Design Intern",
    content: "Himanshu demonstrated excellent frontend skills during his internship. He contributed significantly to our event management project with clean, responsive designs."
  },
  {
    name: "VR Data Solutions",
    role: "Full Stack Developer Intern",
    content: "A quick learner with strong problem-solving abilities. Himanshu has been instrumental in developing scalable web applications for our clients."
  },
  {
    name: "GH Raisoni College",
    role: "B.Tech Computer Science",
    content: "Consistently demonstrates strong technical aptitude and project execution skills. His academic projects showcase practical application of modern web technologies."
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-medium text-secondary tracking-widest uppercase mb-2 sm:mb-3">
            Experience
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display">
            Work & <span className="text-gradient">Education</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: Math.min(index * 0.15, 0.3) // Cap delay for mobile
              }}
              className="glass-panel p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl relative flex flex-col h-full"
            >
              {/* Quote Icon - Responsive Sizing */}
              <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/5 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              
              {/* Stars - Responsive */}
              <div className="mb-4 sm:mb-6 text-primary text-sm sm:text-base md:text-lg">
                ★★★★★
              </div>
              
              {/* Testimonial Content */}
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 italic relative z-10 flex-grow leading-relaxed sm:leading-loose">
                "{testimonial.content}"
              </p>
              
              {/* Client Info */}
              <div className="border-t border-white/10 pt-4 sm:pt-6">
                <div className="font-bold text-white text-base sm:text-lg">
                  {testimonial.name}
                </div>
                <div className="text-xs sm:text-sm text-primary mt-1">
                  {testimonial.role}
                </div>
              </div>

              {/* Mobile Touch Indicator */}
              <div className="mt-4 pt-4 border-t border-white/5 sm:hidden">
                <span className="text-xs text-muted-foreground/60">
                  Professional Experience
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/20"
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            With experience in both frontend design and full-stack development, 
            I bring comprehensive skills to every project.
          </p>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 flex justify-center gap-2"
          >
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
          </motion.div>
        </motion.div>

        {/* Mobile Swipe Hint */}
        <div className="mt-6 sm:hidden text-center">
          <p className="text-xs text-muted-foreground/60">
            💡 Professional journey across internships and education
          </p>
        </div>
      </div>

      {/* Background Decorative Elements - Mobile Optimized */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 -right-8 w-32 h-32 sm:w-48 sm:h-48 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 -left-8 w-32 h-32 sm:w-48 sm:h-48 bg-secondary/5 rounded-full blur-xl"></div>
      </div>
    </section>
  );
}