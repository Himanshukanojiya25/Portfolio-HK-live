import { motion } from "framer-motion";
import { Code2, Palette, Globe, Terminal } from "lucide-react";

const features = [
  {
    icon: <Code2 className="w-8 h-8 text-primary" />,
    title: "Clean Code",
    description: "Writing scalable, maintainable, and efficient code is my priority."
  },
  {
    icon: <Palette className="w-8 h-8 text-secondary" />,
    title: "Modern Design",
    description: "Creating beautiful, intuitive interfaces with pixel-perfect precision."
  },
  {
    icon: <Globe className="w-8 h-8 text-purple-400" />,
    title: "Web Animation",
    description: "Bringing sites to life with smooth transitions and micro-interactions."
  },
  {
    icon: <Terminal className="w-8 h-8 text-pink-400" />,
    title: "Problem Solving",
    description: "Turning complex requirements into elegant technical solutions."
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-secondary tracking-widest uppercase mb-3">About Me</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-display">
            Bridging Design & <br /> <span className="text-gradient">Engineering</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I'm a passionate Full Stack Developer with a keen eye for design. 
              I don't just write code; I create digital experiences that leave a lasting impression.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              With expertise in the React ecosystem and modern web technologies, 
              I help startups and established businesses build their digital presence. 
              My approach combines technical depth with creative flair.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-panel p-4 rounded-xl border-l-4 border-primary">
                <div className="text-3xl font-bold text-white mb-1">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border-l-4 border-secondary">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
