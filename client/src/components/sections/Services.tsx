import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Monitor, Server, Smartphone, Layers } from "lucide-react";
import { useRef } from "react";

const services = [
  {
    icon: <Monitor size={32} />,
    title: "Frontend Development",
    description: "Building responsive, pixel-perfect SPAs with React and Tailwind."
  },
  {
    icon: <Server size={32} />,
    title: "Backend Architecture",
    description: "Robust server-side solutions using Node.js, Express, and PostgreSQL."
  },
  {
    icon: <Smartphone size={32} />,
    title: "Mobile Development",
    description: "Cross-platform mobile applications using React Native."
  },
  {
    icon: <Layers size={32} />,
    title: "UI/UX Design",
    description: "Creating intuitive and engaging user experiences with modern tools."
  }
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

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
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-secondary tracking-widest uppercase mb-3">What I Do</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-display">
            My <span className="text-gradient">Services</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="perspective-1000">
              <TiltCard>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-8 rounded-2xl h-full border border-white/5 hover:border-primary/50 transition-colors"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <div className="mb-6 text-primary bg-primary/10 p-4 rounded-2xl w-fit" style={{ transform: "translateZ(30px)" }}>
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ transform: "translateZ(20px)" }}>{service.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    {service.description}
                  </p>
                </motion.div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
