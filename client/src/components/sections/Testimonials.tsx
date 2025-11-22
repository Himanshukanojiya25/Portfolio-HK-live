import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content: "The attention to detail and animation work is absolutely world-class. Our platform has never looked better."
  },
  {
    name: "Michael Chen",
    role: "Product Lead, InnovateCorp",
    content: "Incredible technical skills combined with a great eye for design. Delivered perfectly on time."
  },
  {
    name: "Emily Davis",
    role: "Founder, Artistry",
    content: "Transformed our vision into a stunning interactive reality. The 3D elements add so much depth."
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-secondary tracking-widest uppercase mb-3">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-display">
            Client <span className="text-gradient">Stories</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-2xl relative"
            >
              <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12" />
              <div className="mb-6 text-primary">★★★★★</div>
              <p className="text-lg text-muted-foreground mb-8 italic relative z-10">"{testimonial.content}"</p>
              <div>
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-sm text-primary">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
