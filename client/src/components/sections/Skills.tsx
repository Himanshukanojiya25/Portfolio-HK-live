import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";

const skills = [
  { name: "JavaScript", level: 85 },
  { name: "React", level: 80 },
  { name: "Node.js", level: 75 },
  { name: "TypeScript", level: 70 },
  { name: "Java", level: 65 },
  { name: "Python", level: 60 },
  { name: "MongoDB", level: 70 },
  { name: "SQL", level: 65 },
];

// Simple 3D component for mobile performance
function SkillCube({ position, index }: { position: [number, number, number]; index: number }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color={index % 2 === 0 ? "#a78bfa" : "#22d3ee"}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function SkillsScene() {
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
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      
      {skills.map((_, i) => {
        if (isMobile && i >= 4) return null; // Show fewer cubes on mobile
        
        const angle = (i / skills.length) * Math.PI * 2;
        const radius = isMobile ? 1.5 : 2.5;
        
        return (
          <SkillCube
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * (isMobile ? 1 : 1.5),
              Math.sin(angle) * (isMobile ? 0.5 : 1)
            ]}
            index={i}
          />
        );
      })}
    </>
  );
}

function SkillsFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading 3D Skills</p>
      </div>
    </div>
  );
}

export default function Skills() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-24 bg-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-medium text-secondary tracking-widest uppercase mb-2 sm:mb-3">
            My Arsenal
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 sm:mb-6">
            Technical <span className="text-gradient">Skills</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Progress Bars */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: isReducedMotion ? 0.3 : 0.5, 
                  delay: isReducedMotion ? 0 : index * 0.1 
                }}
                className="bg-background/50 rounded-xl p-4 sm:p-6 glass-card"
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="font-medium text-base sm:text-lg">{skill.name}</span>
                  <span className="text-muted-foreground text-sm sm:text-base font-mono">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: isReducedMotion ? 0.5 : 1, 
                      ease: "easeOut",
                      delay: isReducedMotion ? 0 : index * 0.1 + 0.2
                    }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3D Interactive Area - Mobile Optimized */}
          <div className="h-[300px] sm:h-[350px] md:h-[400px] glass-panel rounded-xl sm:rounded-2xl overflow-hidden relative order-1 lg:order-2">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs sm:text-sm pointer-events-none z-10">
              <span className="bg-background/80 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10">
                Interactive 3D Skills
              </span>
            </div>
            
            <Canvas
              dpr={[1, 1.5]} // Lower pixel ratio for mobile
              gl={{ 
                antialias: false,
                powerPreference: "low-power"
              }}
              performance={{ min: 0.3 }}
              className="rounded-xl sm:rounded-2xl"
            >
              <Suspense fallback={null}>
                <SkillsScene />
              </Suspense>
            </Canvas>
            
            {/* Fallback for slow devices */}
            <Suspense fallback={<SkillsFallback />}>
              {/* This ensures fallback shows during initial load */}
            </Suspense>

            {/* Mobile Performance Indicator */}
            <div className="absolute bottom-3 left-3 sm:hidden">
              <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                3D Optimized
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 sm:hidden text-center"
        >
          <p className="text-sm text-muted-foreground">
            {skills.length}+ technologies mastered
          </p>
        </motion.div>
      </div>
    </section>
  );
}