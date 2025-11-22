import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import * as THREE from "three";

// Loading fallback for 3D scene
function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-lg">Loading 3D Scene...</div>
    </div>
  );
}

function GeometricShape({ 
  position, 
  color, 
  speed,
  size = 1 
}: { 
  position: [number, number, number], 
  color: string, 
  speed: number,
  size?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? size * 1.2 : size}
      >
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.3}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  // Mobile-optimized scene with fewer elements and adjusted positions
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 12 : 10]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={0.8} />
      <pointLight position={[-8, -8, -8]} color="cyan" intensity={1.5} />
      
      {/* Reduced star count for mobile performance */}
      <Stars 
        radius={80} 
        depth={30} 
        count={isMobile ? 1000 : 3000} 
        factor={3} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
      
      {/* Mobile-optimized shapes with fewer elements */}
      {isMobile ? (
        // Mobile: Fewer, smaller shapes
        <>
          <GeometricShape position={[0, 0, 0]} color="#a78bfa" speed={0.3} size={0.8} />
          <GeometricShape position={[-2, 1, -3]} color="#22d3ee" speed={0.2} size={0.6} />
          <GeometricShape position={[2, -1, -2]} color="#f472b6" speed={0.25} size={0.7} />
        </>
      ) : (
        // Desktop: Full scene
        <>
          <GeometricShape position={[0, 0, 0]} color="#a78bfa" speed={0.5} />
          <GeometricShape position={[-4, 2, -5]} color="#22d3ee" speed={0.3} />
          <GeometricShape position={[4, -2, -2]} color="#f472b6" speed={0.4} />
          <GeometricShape position={[-3, -3, -4]} color="#a78bfa" speed={0.6} />
          <GeometricShape position={[3, 3, -5]} color="#22d3ee" speed={0.2} />
        </>
      )}
    </>
  );
}

export default function Hero() {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full flex items-center overflow-hidden">
      {/* 3D Background with performance optimizations */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<SceneLoader />}>
          <Canvas
            dpr={[1, 2]} // Adaptive pixel ratio
            gl={{ 
              antialias: false, // Disable antialiasing for performance
              alpha: true 
            }}
            performance={{ min: 0.5 }} // Lower performance threshold
          >
            <Scene />
          </Canvas>
        </Suspense>
        
        {/* Performance overlay for mobile */}
        <div className="md:hidden absolute top-4 right-4 z-10">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            3D Optimized
          </div>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80 z-0" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 relative">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-secondary mb-3 sm:mb-4 tracking-widest uppercase">
              Full Stack Developer
            </h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display tracking-tight leading-tight sm:leading-tighter mb-4 sm:mb-6"
          >
            Himanshu <br className="hidden sm:block" />
            <span className="text-gradient block mt-2">Kanojiya</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed sm:leading-loose"
          >
            Passionate Computer Science student specializing in MERN stack development. 
            Building innovative web solutions while mastering DSA in Java/Python.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg group min-h-[48px] sm:min-h-[56px]"
              onClick={scrollToProjects}
            >
              View Projects
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 text-primary hover:bg-primary/10 rounded-full px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
              onClick={scrollToContact}
            >
              Contact Me
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on very small screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="w-1 h-2 sm:h-3 bg-primary rounded-full"
          />
        </div>
      </motion.div>

      {/* Mobile Performance Notice */}
      <div className="md:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Optimized for mobile performance
        </p>
      </div>
    </section>
  );
}