import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { Suspense } from "react";

const skills = [
  { name: "React", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Three.js", level: 80 },
  { name: "Node.js", level: 85 },
  { name: "Tailwind", level: 95 },
  { name: "Next.js", level: 88 },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-secondary tracking-widest uppercase mb-3">My Arsenal</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Technical <span className="text-gradient">Skills</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Progress Bars */}
          <div className="space-y-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-lg">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3D Interactive Area (Placeholder for complex interactive skill cloud) */}
          <div className="h-[400px] glass-panel rounded-2xl overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none z-10">
                <span className="bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">Interactive 3D View</span>
             </div>
             <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                    <group>
                        {skills.map((skill, i) => (
                             <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={[
                                Math.cos(i) * 3,
                                Math.sin(i * 2) * 2,
                                Math.sin(i) * 1
                             ]}>
                                <mesh>
                                    <boxGeometry args={[1, 1, 1]} />
                                    <meshNormalMaterial wireframe />
                                </mesh>
                             </Float>
                        ))}
                    </group>
                </Suspense>
             </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
