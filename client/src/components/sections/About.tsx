import { motion } from "framer-motion";
import { Code2, Palette, Globe, Terminal } from "lucide-react";

const features = [
  {
    icon: <Code2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />,
    title: "Clean Code",
    description: "Writing scalable, maintainable, and efficient code is my priority."
  },
  {
    icon: <Palette className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary" />,
    title: "Modern Design",
    description: "Creating beautiful, intuitive interfaces with pixel-perfect precision."
  },
  {
    icon: <Globe className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />,
    title: "Web Animation",
    description: "Bringing sites to life with smooth transitions and micro-interactions."
  },
  {
    icon: <Terminal className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-pink-400" />,
    title: "Problem Solving",
    description: "Turning complex requirements into elegant technical solutions."
  }
];

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Elements - Optimized for mobile */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-10 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-xl sm:blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 sm:-left-20 w-48 h-48 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-xl sm:blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-medium text-secondary tracking-widest uppercase mb-2 sm:mb-3">
            About Me
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display leading-tight sm:leading-tighter">
            Bridging Design & <br className="hidden sm:block" /> 
            <span className="text-gradient">Engineering</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed sm:leading-loose">
              I'm Himanshu Mahendra Kanojiya, a passionate Full Stack Developer currently pursuing B.Tech in Computer Science at GH Raisoni College of Engineering.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed sm:leading-loose">
              With expertise in MERN stack development, I specialize in building scalable web applications. I'm currently enhancing my skills in Data Structures and Algorithms with Java and Python while working on real-world projects.
            </p>
            
            {/* Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
              <div className="glass-panel p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-2 sm:border-l-4 border-primary">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">2+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Internships</div>
              </div>
              <div className="glass-panel p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-2 sm:border-l-4 border-secondary">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">10+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Projects Completed</div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: Math.min(index * 0.1, 0.3) // Cap delay for mobile
                }}
                className="glass-card p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-colors group min-h-[140px] sm:min-h-[160px] flex flex-col"
              >
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl w-fit group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex-grow-0">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 text-center sm:hidden"
        >
          <p className="text-sm text-muted-foreground">
            Scroll down to see my skills and projects
          </p>
          <div className="mt-2 w-6 h-1 bg-primary/30 rounded-full mx-auto"></div>
        </motion.div>
      </div>
    </section>
  );
}