import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, Instagram, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about", icon: "👨‍💻" },
    { name: "Skills", href: "#skills", icon: "⚡" },
    { name: "Projects", href: "#projects", icon: "🚀" },
    { name: "Contact", href: "#contact", icon: "📞" },
  ];

  const socialLinks = [
    {
      icon: <Github size={18} />,
      href: "https://github.com/Himanshukanojiya25",
      label: "GitHub"
    },
    {
      icon: <Linkedin size={18} />,
      href: "https://www.linkedin.com/in/himanshu-kanojiya27/",
      label: "LinkedIn"
    },
    {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/himanshu_hk14/",
      label: "Instagram"
    },
    {
      icon: <Mail size={18} />,
      href: "mailto:himanshukanojiya27@gmail.com",
      label: "Email"
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-navbar]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <motion.nav
      data-navbar
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-3'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`relative rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-md border transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 border-white/10 shadow-2xl shadow-primary/10' 
            : 'bg-black/40 border-white/5'
        }`}>
          
          {/* Logo with animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="text-xl sm:text-2xl font-bold font-display tracking-tighter cursor-pointer flex items-center min-h-[44px] text-white">
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-1"
              >
                ✨
              </motion.span>
              Himanshu
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-primary ml-1"
              >
                .
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full min-h-[44px] flex items-center gap-2 group ${
                  activeSection === link.href.substring(1)
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                {link.name}
                
                {/* Active indicator */}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full bg-primary/20 border border-primary/30 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="sm" 
                className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white min-h-[44px] px-6 font-semibold shadow-lg shadow-primary/25"
                onClick={() => scrollToSection("#contact")}
              >
                <Sparkles size={16} className="mr-2" />
                Hire Me
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.div 
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center border border-white/10"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-20 left-4 right-4 p-6 rounded-3xl z-50 md:hidden max-h-[80vh] overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/20"
            >
              {/* Navigation Links */}
              <div className="flex flex-col gap-2 mb-6">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-lg font-medium text-left p-4 rounded-2xl transition-all duration-300 min-h-[60px] flex items-center gap-4 group ${
                      activeSection === link.href.substring(1)
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-white hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.name}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="ml-auto w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Hire Me Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mb-6"
              >
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl min-h-[60px] text-lg font-semibold shadow-lg shadow-primary/25"
                  onClick={() => scrollToSection("#contact")}
                >
                  <Sparkles size={20} className="mr-3" />
                  Hire Me
                </Button>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.1 }}
                className="pt-6 border-t border-white/10"
              >
                <p className="text-white/60 text-sm font-medium mb-4 text-center">Let's Connect</p>
                <div className="flex justify-center gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (navLinks.length + 1) * 0.1 + index * 0.1 }}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-white/10 hover:border-primary/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                  <motion.a
                    href="https://wa.me/918378985323"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 + 4 * 0.1 }}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 hover:border-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </motion.a>
                </div>
              </motion.div>

              {/* Quick Contact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (navLinks.length + 2) * 0.1 }}
                className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10"
              >
                <p className="text-white/60 text-xs text-center">
                  📧 himanshukanojiya27@gmail.com
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}