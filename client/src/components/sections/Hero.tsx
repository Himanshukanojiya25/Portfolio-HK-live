import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars, Text3D, OrbitControls } from "@react-three/drei";
import { useRef, useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import * as THREE from "three";

// Custom cursor component - FIXED FOR DESKTOP, DISABLED FOR MOBILE
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if screen is desktop (768px or larger)
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for resize
    window.addEventListener('resize', checkScreenSize);
    
    const updateCursor = (e: MouseEvent) => {
      if (!isDesktop) return;
      
      // Direct DOM manipulation for precise positioning
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    document.addEventListener('mousemove', updateCursor);
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [isDesktop]);

  // Mobile pe cursor display nahi hoga
  if (!isDesktop) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mix-blend-difference pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          scale: isPointer ? '1.5' : '1',
        }}
      />
    </>
  );
}

// Floating Text Component
function FloatingText() {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.8}
        height={0.2}
        curveSegments={12}
        position={[0, 0, 0]}
      >
        HK
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Text3D>
    </Float>
  );
}

// Enhanced geometric shapes with particles
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
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.5;
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case "torus": return <torusGeometry args={[size, 0.2, 16, 100]} />;
      case "cone": return <coneGeometry args={[size, size * 2, 8]} />;
      case "octahedron": return <octahedronGeometry args={[size]} />;
      default: return <icosahedronGeometry args={[size, 0]} />;
    }
  };

  return (
    <Float speed={3} rotationIntensity={3} floatIntensity={3}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? size * 1.5 : size}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.3}
          wireframe={!hovered}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Particle System
function ParticleField({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useRef(new Float32Array(count * 3));
  
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      particlesPosition.current[i * 3] = (Math.random() - 0.5) * 50;
      particlesPosition.current[i * 3 + 1] = (Math.random() - 0.5) * 50;
      particlesPosition.current[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d9ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 20 : 15]} fov={75} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d9ff" />
      <pointLight position={[-10, -10, 10]} intensity={1} color="#ff00c8" />
      <pointLight position={[0, 10, -10]} intensity={0.8} color="#ff6b35" />
      
      {/* Enhanced stars with glow */}
      <Stars 
        radius={100} 
        depth={50} 
        count={isMobile ? 3000 : 8000} 
        factor={6} 
        saturation={0} 
        fade 
        speed={2}
      />
      
      {/* Particle Field */}
      <ParticleField count={isMobile ? 1000 : 2000} />
      
      {/* Geometric Shapes */}
      {isMobile ? (
        // Mobile optimized
        <>
          <GeometricShape position={[2, 1, -5]} color="#00d9ff" speed={0.4} size={1.2} shape="icosahedron" />
          <GeometricShape position={[-3, -1, -8]} color="#ff00c8" speed={0.3} size={1} shape="torus" />
          <GeometricShape position={[4, 2, -6]} color="#ff6b35" speed={0.5} size={0.8} shape="octahedron" />
        </>
      ) : (
        // Desktop full experience
        <>
          <GeometricShape position={[3, 2, -8]} color="#00d9ff" speed={0.4} size={1.5} shape="icosahedron" />
          <GeometricShape position={[-5, 3, -10]} color="#ff00c8" speed={0.3} size={1.2} shape="torus" />
          <GeometricShape position={[6, -2, -7]} color="#ff6b35" speed={0.5} size={1} shape="cone" />
          <GeometricShape position={[-3, -4, -12]} color="#00d9ff" speed={0.6} size={0.9} shape="octahedron" />
          <GeometricShape position={[4, 5, -9]} color="#ff00c8" speed={0.2} size={0.8} shape="torus" />
          <GeometricShape position={[-6, 1, -11]} color="#ff6b35" speed={0.4} size={1.1} shape="icosahedron" />
        </>
      )}
    </>
  );
}

// GameLoader component ko replace karo with this:
function GameLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="relative"
        >
          {/* Original Black Loader Design */}
          <div className="w-32 h-32 border-4 border-primary/30 rounded-full animate-spin">
            <div className="w-24 h-24 border-4 border-transparent border-t-secondary rounded-full animate-spin absolute top-4 left-4" />
          </div>
          <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            LOADING PORTFOLIO
          </motion.h2>
          
          <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-primary font-mono text-sm"
          >
            {Math.round(progress)}% LOADED
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <GameLoader />;
  }

  return (
    <section id="home" className="relative h-screen w-full flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <CustomCursor />
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/30 to-gray-900" />
        }>
          <Canvas
            dpr={[1, 2]}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/70 z-0" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 relative">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h2
              className="text-lg md:text-xl font-medium text-cyan-400 mb-4 tracking-widest uppercase flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Sparkles className="w-5 h-5" />
              Full Stack Developer & Designer
            </motion.h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight sm:leading-tighter mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="block text-white"
            >
              HIMANSHU
            </motion.span>
            
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mt-2"
            >
              KANOJIYA
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-gray-300 text-xl md:text-2xl max-w-2xl mb-8 leading-relaxed font-light"
          >
            Crafting <span className="text-cyan-400 font-semibold">digital experiences</span> that blend 
            cutting-edge technology with stunning design. 
            <span className="block mt-3 text-purple-300">Innovating one pixel at a time.</span>
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
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-full px-8 sm:px-10 h-14 sm:h-16 text-lg shadow-2xl shadow-cyan-500/25 border-0"
                onClick={scrollToProjects}
              >
                <span className="relative z-10">View My Work</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 rounded-full px-8 sm:px-10 h-14 sm:h-16 text-lg backdrop-blur-sm"
                onClick={scrollToContact}
              >
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-cyan-400 rounded-full"
            />
          </div>
          <p className="text-xs text-cyan-400/70 font-medium tracking-widest">SCROLL</p>
        </motion.div>
      </motion.div>
    </section>
  );
}