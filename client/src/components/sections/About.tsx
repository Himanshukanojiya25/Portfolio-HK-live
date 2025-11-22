import { motion } from "framer-motion";
import { Zap, Cpu, Palette, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // ✅ Button import add kiya

const features = [
  {
    icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Fast Performance",
    description: "Optimized code and modern practices for blazing-fast web experiences.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Modern Tech Stack",
    description: "Using cutting-edge technologies like React, Node.js, and TypeScript.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Palette className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Beautiful Design",
    description: "Creating stunning, user-friendly interfaces with pixel-perfect precision.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Scalable Solutions",
    description: "Building robust applications that grow with your business needs.",
    gradient: "from-green-500 to-emerald-500"
  }
];

// Animated background particles
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary rounded-full"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 30}vh`, `${particle.y}vh`],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4 + particle.id,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export default function About() {
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 sm:py-28 md:py-36 bg-black relative overflow-hidden">
      <FloatingParticles />
      
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

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
            About Me
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Creative <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Developer</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/60 max-w-3xl mx-auto"
          >
            Passionate about crafting digital experiences that blend innovative technology 
            with stunning design to create meaningful solutions.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/70 leading-relaxed"
            >
              I'm <span className="text-primary font-semibold">Himanshu Mahendra Kanojiya</span>, a passionate Full Stack Developer currently pursuing B.Tech in Computer Science at GH Raisoni College of Engineering.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/70 leading-relaxed"
            >
              With expertise in the <span className="text-secondary font-semibold">MERN stack</span>, I specialize in building scalable web applications that deliver exceptional user experiences. I'm constantly enhancing my skills while working on real-world projects.
            </motion.p>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 gap-6 mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <motion.div
                  key={currentStat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl font-bold text-primary mb-2"
                >
                  {currentStat === 0 ? "2+" : "6+"}
                </motion.div>
                <div className="text-white/60 text-sm font-medium">
                  {currentStat === 0 ? "Internships" : "Months Experience"}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-secondary/50 transition-all duration-300"
              >
                <motion.div
                  key={currentStat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl font-bold text-secondary mb-2"
                >
                  {currentStat === 0 ? "10+" : "∞"}
                </motion.div>
                <div className="text-white/60 text-sm font-medium">
                  {currentStat === 0 ? "Projects" : "Passion"}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5
                }}
                className="group relative bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative z-10 mb-4 p-3 rounded-xl bg-gradient-to-r ${feature.gradient} w-fit group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h4 className="font-semibold text-white text-lg mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 sm:mt-24"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-white/60 text-lg mb-8"
          >
            Ready to bring your ideas to life?
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-2xl shadow-primary/25"
            >
              View My Work
            </Button>
            
            <Button
              onClick={() => scrollToSection('contact')}
              variant="outline"
              className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}