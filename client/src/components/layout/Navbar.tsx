import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`glass-panel rounded-full px-6 py-3 flex items-center justify-between ${
          scrolled ? "bg-opacity-80" : "bg-opacity-40"
        }`}>
          <Link href="/" className="text-2xl font-bold font-display tracking-tighter cursor-pointer">
              DEV<span className="text-primary">.</span>PORTFOLIO
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </button>
            ))}
            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white" onClick={() => scrollToSection("#contact")}>
              Hire Me
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 left-4 right-4 p-6 glass-card rounded-2xl md:hidden flex flex-col gap-4 z-50"
        >
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="text-lg font-medium text-foreground hover:text-primary text-left"
            >
              {link.name}
            </button>
          ))}
          <div className="flex gap-4 mt-4 pt-4 border-t border-border/50">
            <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-colors"><Github size={20} /></a>
            <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-primary transition-colors"><Mail size={20} /></a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
