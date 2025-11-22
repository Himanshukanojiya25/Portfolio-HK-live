import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";
import { useRef, useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import * as THREE from "three";

// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    const handleMouseDown = () => {
      document.documentElement.style.setProperty('--cursor-scale', '0.8');
    };

    const handleMouseUp = () => {
      document.documentElement.style.setProperty('--cursor-scale', '1');
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed w-6 h-6 bg-primary rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
        style={{
          background: isPointer ? '#ff00c8' : '#00d9ff',
        }}
      />
      <motion.div
        className="fixed w-12 h-12 border-2 border-primary rounded-full pointer-events-none z-50"
        animate={{
          x: position.x - 24,
          y: position.y - 24,
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
      />
    </>
  );
}

// Enhanced geometric shapes with better animations
function GeometricShape({ 
  position, 
  color, 
  speed,
  size = 1,
  shape = "icosahedron"
}: { 
  position: [number, number, number], 
  color: string, 
  speed: number,
  size?: number,
  shape?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 0.8;
      meshRef.current.rotation.z += delta * speed * 0.3;
      
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case "torus": return <torusGeometry args={[size, 0.3, 16, 100]} />;
      case "cone": return <coneGeometry args={[size, size * 2, 8]} />;
      default: return <icosahedronGeometry args={[size, 0]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? size * 1.3 : size}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          wireframe={!hovered}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 15 : 12]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff00c8" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#00d9ff" />
      <pointLight position={[0, 10, -10]} intensity={0.5} color="#ff6b6b" />
      
      {/* Enhanced stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={isMobile ? 2000 : 5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      
      {/* More diverse shapes */}
      {isMobile ? (
        // Mobile optimized
        <>
          <GeometricShape position={[0, 0, 0]} color="#00d9ff" speed={0.4} size={1} shape="icosahedron" />
          <GeometricShape position={[-3, 2, -2]} color="#ff00c8" speed={0.3} size={0.8} shape="torus" />
          <GeometricShape position={[3, -1, -3]} color="#ff6b6b" speed={0.5} size={0.7} shape="cone" />
        </>
      ) : (
        // Desktop full experience
        <>
          <GeometricShape position={[0, 0, 0]} color="#00d9ff" speed={0.4} size={1.2} shape="icosahedron" />
          <GeometricShape position={[-4, 3, -4]} color="#ff00c8" speed={0.3} size={1} shape="torus" />
          <GeometricShape position={[4, -2, -3]} color="#ff6b6b" speed={0.5} size={0.9} shape="cone" />
          <GeometricShape position={[-2, -3, -5]} color="#00d9ff" speed={0.6} size={0.8} shape="icosahedron" />
          <GeometricShape position={[3, 4, -2]} color="#ff00c8" speed={0.2} size={0.7} shape="torus" />
        </>
      )}
    </>
  );
}

// Loading animation with game style
function GameLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mb-6 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-transparent border-b-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-lg font-mono tracking-widest"
        >
          LOADING PORTFOLIO
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.8 }}
          className="h-1 bg-gradient-to-r from-primary to-secondary mt-4 rounded-full"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  // Easter egg - Konami code
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let currentIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[currentIndex]) {
        currentIndex++;
        if (currentIndex === konamiCode.length) {
          // Activate easter egg
          document.body.style.background = 'linear-gradient(45deg, #ff00c8, #00d9ff, #ff6b6b)';
          setTimeout(() => {
            document.body.style.background = '';
          }, 5000);
          currentIndex = 0;
        }
      } else {
        currentIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return <GameLoader />;
  }

  return (
    <section id="home" className="relative h-screen w-full flex items-center overflow-hidden">
      <CustomCursor />
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />}>
          <Canvas
            dpr={[1, 2]}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
            performance={{ min: 0.8 }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-purple-900/20 to-background/60 z-0" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, null],
              x: [null, Math.sin(i) * 50, null],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 relative">
        <div className="max-w-4xl">
          {/* Animated title with typewriter effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h2
              className="text-base sm:text-lg md:text-xl font-medium text-secondary mb-3 sm:mb-4 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Full Stack Developer
            </motion.h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display tracking-tight leading-tight sm:leading-tighter mb-4 sm:mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="block"
            >
              Himanshu
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-gradient block mt-2 bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent"
            >
              Kanojiya
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-muted-foreground text-lg sm:text-xl md:text-2xl max-w-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed sm:leading-loose font-light"
          >
            Crafting <span className="text-primary font-semibold">digital experiences</span> that blend 
            cutting-edge technology with stunning design. 
            <span className="block mt-2">Full-stack developer passionate about innovation.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-8 sm:px-10 h-14 sm:h-16 text-lg sm:text-xl group shadow-2xl shadow-primary/25"
                onClick={scrollToProjects}
              >
                <span className="relative z-10">Explore My Work</span>
                <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary/50 text-primary hover:bg-primary/10 rounded-full px-8 sm:px-10 h-14 sm:h-16 text-lg sm:text-xl backdrop-blur-sm"
                onClick={scrollToContact}
              >
                Let's Connect
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut" 
          }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-primary rounded-full" />
          </div>
          <p className="text-xs text-primary/70 font-medium tracking-widest">SCROLL</p>
        </motion.div>
      </motion.div>

      {/* Sound effects (optional) */}
      <audio id="hover-sound" src="/sounds/hover.mp3" preload="auto" />
      <audio id="click-sound" src="/sounds/click.mp3" preload="auto" />
    </section>
  );
}