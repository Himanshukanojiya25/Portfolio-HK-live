import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Instagram, MessageCircle, Heart, Sparkles, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/Himanshukanojiya25",
      label: "GitHub",
      color: "hover:text-gray-400"
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/himanshu-kanojiya27/",
      label: "LinkedIn",
      color: "hover:text-blue-400"
    },
    {
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/himanshu_hk14/",
      label: "Instagram", 
      color: "hover:text-pink-400"
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:himanshukanojiya27@gmail.com",
      label: "Email",
      color: "hover:text-red-400"
    },
    {
      icon: <MessageCircle size={20} />,
      href: "https://wa.me/918378985323",
      label: "WhatsApp",
      color: "hover:text-green-400"
    }
  ];

  const quickLinks = [
    { name: "About", href: "#about", emoji: "👨‍💻" },
    { name: "Skills", href: "#skills", emoji: "⚡" },
    { name: "Projects", href: "#projects", emoji: "🚀" },
    { name: "Contact", href: "#contact", emoji: "📞" }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "himanshukanojiya27@gmail.com",
      href: "mailto:himanshukanojiya27@gmail.com",
      color: "text-red-400"
    },
    {
      icon: Phone, 
      label: "Phone",
      value: "+91 8378985323",
      href: "tel:+918378985323",
      color: "text-green-400"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Nagpur, Maharashtra",
      href: "#",
      color: "text-blue-400"
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
        />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
            }}
            animate={{
              y: [null, -20, null],
              x: [null, Math.sin(i) * 10, null],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 sm:py-20 md:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-12 md:gap-16">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="xl:col-span-2"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="text-primary" size={24} />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Himanshu<span className="text-primary">.</span>
                </h3>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg leading-relaxed max-w-md mb-8"
              >
                Full Stack Developer & Computer Science Student passionate about creating 
                innovative web solutions and mastering modern technologies. Let's build something amazing together! 🚀
              </motion.p>
              
              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex gap-3"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center group ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/10"
                    >
                      {social.label}
                    </motion.div>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                <span>🚀</span> Quick Links
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-white/70 hover:text-primary transition-all duration-300 text-lg flex items-center gap-3 group hover:translate-x-2"
                    >
                      <span className="text-xl">{link.emoji}</span>
                      {link.name}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="w-1 h-1 bg-primary rounded-full ml-2"
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                <span>📞</span> Get In Touch
              </h4>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 group hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-current ${info.color}`}>
                      <info.icon size={16} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{info.label}</p>
                      <p className="text-white/60 text-sm group-hover:text-white transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6"
              >
                <motion.a
                  href="mailto:himanshukanojiya27@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25"
                >
                  <Mail size={16} />
                  Start a Project
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/10 py-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-white/60 text-sm"
            >
              <span>© {currentYear} Himanshu Kanojiya</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Made with <Heart size={14} className="text-red-500 animate-pulse" /> in India
              </span>
            </motion.div>

            {/* Back to Top & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6 text-sm text-white/60"
            >
              <motion.a
                href="https://wa.me/918378985323"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, color: "#22C55E" }}
                className="hover:text-green-400 transition-colors flex items-center gap-1"
              >
                <MessageCircle size={16} />
                WhatsApp
              </motion.a>
              
              <span>•</span>
              
              <motion.a
                href="mailto:himanshukanojiya27@gmail.com"
                whileHover={{ scale: 1.05, color: "#EF4444" }}
                className="hover:text-red-400 transition-colors"
              >
                Available for work
              </motion.a>
              
              <span>•</span>

              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Sparkles size={16} />
                Back to Top
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Optimized Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="sm:hidden absolute bottom-4 right-4"
      >
        <div className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm">
          📱 Mobile Optimized
        </div>
      </motion.div>

      {/* Easter Egg */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4"
      >
        <p className="text-white/20 text-xs font-mono">
          &lt;💻 Built with React, TypeScript & Tailwind /&gt;
        </p>
      </motion.div>
    </footer>
  );
}