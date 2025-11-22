import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Monitor, Server, Smartphone, Layers, Database, Code } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const services = [
  {
    icon: <Code size={24} className="sm:size-6 md:size-8" />,
    title: "Frontend Development",
    description: "Building responsive, interactive web applications with React, TypeScript, and modern CSS frameworks."
  },
  {
    icon: <Server size={24} className="sm:size-6 md:size-8" />,
    title: "Backend Development",
    description: "Robust server-side solutions using Node.js, Express, and RESTful API design principles."
  },
  {
    icon: <Database size={24} className="sm:size-6 md:size-8" />,
    title: "Database Design",
    description: "Efficient database architecture with MongoDB and SQL, ensuring optimal performance and scalability."
  },
  {
    icon: <Smartphone size={24} className="sm:size-6 md:size-8" />,
    title: "Responsive Design",
    description: "Creating mobile-first, responsive designs that work seamlessly across all devices and screen sizes."
  }
];

function TiltCard({ children, disableTilt = false }: { children: React.ReactNode; disableTilt?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile || disableTilt) return;

    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (isMobile || disableTilt) return;
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ref.current || !isMobile || disableTilt) return;

    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    
    const width = rect.width;
    const height = rect.height;
    
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const xPct = touchX / width - 0.5;
    const yPct = touchY / height - 0.5;
    
    x.set(xPct * 0.5); // Reduced effect for touch
    y.set(yPct * 0.5);
  };

  const handleTouchEnd = () => {
    if (isMobile || disableTilt) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        rotateY: disableTilt ? 0 : rotateY,
        rotateX: disableTilt ? 0 : rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
}

export default function Services() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-medium text-secondary tracking-widest uppercase mb-2 sm:mb-3">
            What I Do
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display">
            My <span className="text-gradient">Services</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={index} className="perspective-1000 h-full">
              <TiltCard disableTilt={isReducedMotion}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: isReducedMotion ? 0 : index * 0.1 
                  }}
                  className="glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl h-full border border-white/5 hover:border-primary/30 transition-colors flex flex-col"
                  style={{ 
                    transform: isReducedMotion ? "none" : "translateZ(20px)",
                    minHeight: '280px'
                  }}
                >
                  <div 
                    className="mb-4 sm:mb-6 text-primary bg-primary/10 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-2xl w-fit" 
                    style={{ transform: isReducedMotion ? "none" : "translateZ(30px)" }}
                  >
                    {service.icon}
                  </div>
                  
                  <h4 
                    className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 flex-grow-0" 
                    style={{ transform: isReducedMotion ? "none" : "translateZ(20px)" }}
                  >
                    {service.title}
                  </h4>
                  
                  <p 
                    className="text-muted-foreground text-xs sm:text-sm leading-relaxed flex-grow" 
                    style={{ transform: isReducedMotion ? "none" : "translateZ(10px)" }}
                  >
                    {service.description}
                  </p>

                  {/* Mobile touch indicator */}
                  <div className="mt-3 pt-3 border-t border-white/5 sm:hidden">
                    <span className="text-xs text-muted-foreground/60">
                      Touch to interact
                    </span>
                  </div>
                </motion.div>
              </TiltCard>
            </div>
          ))}
        </div>

        {/* Mobile Performance Notice */}
        <div className="mt-8 sm:hidden text-center">
          <p className="text-xs text-muted-foreground/60">
            Optimized tilt effects for mobile devices
          </p>
        </div>
      </div>
    </section>
  );
}