import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: isReducedMotion ? 1000 : 100,
    damping: isReducedMotion ? 100 : 30,
    restDelta: 0.001
  });

  return (
    <div className={`min-h-screen bg-background text-foreground selection:bg-primary selection:text-white ${
      isReducedMotion ? 'reduce-motion' : ''
    }`}>
      {/* Progress Bar - Hidden on mobile for better performance */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100] hidden sm:block"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main className="overflow-x-hidden">
        <Hero />
        <About />
        <Services />
        <Skills />
        <Projects />
        <Testimonials />
        <Contact />
      </main>

      <footer className="py-6 sm:py-8 border-t border-white/5 text-center text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm">
            © 2025 Himanshu's Portfolio. Built with React & Three.js.
          </p>
          {/* Mobile optimized additional info */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground/70">
            <span>Optimized for mobile</span>
            <span className="hidden sm:inline">•</span>
            <span>Touch-friendly interface</span>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Helper - Floating action button for easy navigation */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
      </div>

      {/* Mobile Performance Indicator (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 sm:hidden">
          <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-mono">
            Mobile View
          </div>
        </div>
      )}
    </div>
  );
}