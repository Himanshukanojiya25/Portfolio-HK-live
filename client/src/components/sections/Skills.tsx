import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "JavaScript", level: 85, color: "#f7df1e" },
  { name: "React", level: 80, color: "#61dafb" },
  { name: "Node.js", level: 75, color: "#339933" },
  { name: "TypeScript", level: 70, color: "#3178c6" },
  { name: "Java", level: 65, color: "#ed8b00" },
  { name: "Python", level: 60, color: "#3776ab" },
  { name: "MongoDB", level: 70, color: "#47a248" },
  { name: "SQL", level: 65, color: "#336791" },
];

// Draggable Skill Bar Component
function DraggableSkillBar({ skill, index }: { skill: any; index: number }) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const progress = useTransform(dragX, [-100, 100], [0, 100]);
  
  const spring = useSpring(progress, {
    stiffness: 100,
    damping: 30
  });

  const width = useTransform(spring, (value) => `${Math.max(0, Math.min(100, value))}%`);

  const handleDragEnd = () => {
    // You can add logic here to save the new skill level
    console.log(`New ${skill.name} level: ${Math.round(spring.get())}%`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: skill.color }}
          />
          <span className="font-semibold text-white text-lg">{skill.name}</span>
        </div>
        <motion.span 
          className="text-white/60 font-mono text-sm"
          style={{ x: dragX }}
        >
          {Math.round(spring.get())}%
        </motion.span>
      </div>

      <div 
        ref={constraintsRef}
        className="relative h-3 bg-white/10 rounded-full overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Default progress */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: skill.color }}
        />
        
        {/* Draggable progress */}
        <motion.div
          ref={progressRef}
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          style={{ 
            x: dragX,
            width: width
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-y-0 left-0 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40"
          whileHover={{ scaleY: 1.5 }}
          whileDrag={{ scaleY: 1.8 }}
        />
        
        {/* Drag handle */}
        <motion.div
          style={{ x: dragX }}
          className="absolute -top-1 -right-2 w-4 h-5 bg-white rounded-sm cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.3 }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
        className="text-white/40 text-xs mt-3"
      >
        Drag to adjust skill level
      </motion.p>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28 md:py-36 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />
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
            Technical Expertise
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            My <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Skills</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            Continuously evolving and mastering new technologies. Drag the sliders to explore my proficiency levels.
          </motion.p>
        </motion.div>

        {/* Skill Bars - Now full width since 3D sphere removed */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {skills.map((skill, index) => (
              <DraggableSkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-24 max-w-4xl mx-auto"
        >
          {[
            { number: "8+", label: "Technologies" },
            { number: "2+", label: "Years Learning" },
            { number: "10+", label: "Projects" },
            { number: "∞", label: "Passion" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
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