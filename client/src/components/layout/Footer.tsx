import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Instagram, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/Himanshukanojiya25",
      label: "GitHub"
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/himanshu-kanojiya27/",
      label: "LinkedIn"
    },
    {
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/himanshu_hk14/",
      label: "Instagram"
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:himanshukanojiya27@gmail.com",
      label: "Email"
    },
    {
      icon: <MessageCircle size={20} />,
      href: "https://wa.me/918378985323",
      label: "WhatsApp"
    }
  ];

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-background border-t border-white/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h3 className="text-2xl sm:text-3xl font-bold font-display mb-4 sm:mb-6">
                Himanshu<span className="text-primary">.</span>
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mb-6 sm:mb-8">
                Full Stack Developer & Computer Science Student passionate about creating 
                innovative web solutions and mastering modern technologies.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-white/10 hover:border-primary/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-3 sm:space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base hover:underline underline-offset-4"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Get In Touch</h4>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-primary text-sm font-medium">Email</p>
                  <a 
                    href="mailto:himanshukanojiya27@gmail.com" 
                    className="text-muted-foreground text-sm hover:text-primary transition-colors break-all"
                  >
                    himanshukanojiya27@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-primary text-sm font-medium">Phone</p>
                  <a 
                    href="tel:+918378985323" 
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    +91 8378985323
                  </a>
                </div>
                <div>
                  <p className="text-primary text-sm font-medium">Location</p>
                  <p className="text-muted-foreground text-sm">Nagpur, Maharashtra</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-muted-foreground text-sm flex items-center justify-center sm:justify-start"
            >
              © {currentYear} Himanshu Kanojiya. Made with <Heart size={16} className="mx-1 text-red-500" /> in India
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <a 
                href="https://wa.me/918378985323" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <span>•</span>
              <a 
                href="mailto:himanshukanojiya27@gmail.com" 
                className="hover:text-primary transition-colors"
              >
                Available for work
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Optimizations */}
      <div className="sm:hidden absolute bottom-2 right-2">
        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
          Mobile Optimized
        </div>
      </div>
    </footer>
  );
}