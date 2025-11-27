import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { contactAPI } from "@/services/contact"; // ✅ NEW IMPORT

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is too short"),
});

// Floating letter component for typing effects
function FloatingLetter({ letter, index }: { letter: string; index: number }) {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFloating(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.span
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: isFloating ? -10 : 0,
        opacity: 1
      }}
      transition={{ 
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1 + Math.random() * 2,
          ease: "easeInOut"
        }
      }}
      className="inline-block"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {letter}
    </motion.span>
  );
}

function FloatingInput({ field, placeholder }: any) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    field.onChange(e);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="bg-white/5 border-white/10 focus:border-primary h-14 text-lg backdrop-blur-sm"
      />
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 pointer-events-none flex items-center px-3"
          >
            {value.split('').map((letter, index) => (
              <FloatingLetter key={index} letter={letter} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingTextarea({ field, placeholder }: any) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    field.onChange(e);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="bg-white/5 border-white/10 focus:border-primary min-h-[120px] text-lg resize-none backdrop-blur-sm"
      />
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none p-3 overflow-hidden"
          >
            <div className="flex flex-wrap gap-1">
              {value.split('').map((letter, index) => (
                <FloatingLetter key={index} letter={letter} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // ✅ NEW API CALL
      await contactAPI.sendMessage(values);
      
      toast({
        title: "🎉 Message Sent!",
        description: "I'll get back to you within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28 md:py-36 bg-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary rounded-full"
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
            }}
            animate={{
              y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
              x: [`${particle.x}vw`, `${particle.x + Math.sin(particle.id) * 10}vw`, `${particle.x}vw`],
            }}
            transition={{
              duration: 5 + particle.id,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold text-primary tracking-widest uppercase mb-4"
          >
            Get In Touch
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Let's <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-purple-400 bg-clip-text text-transparent">Connect</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            Ready to bring your ideas to life? Let's create something amazing together.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-start">
          {/* Contact Info with animations */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/70 leading-relaxed"
            >
              I'm currently available for freelance work and exciting new opportunities. 
              Whether you have a project in mind or just want to say hello, I'd love to hear from you!
            </motion.p>
            
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "himanshukanojiya27@gmail.com",
                  href: "mailto:himanshukanojiya27@gmail.com",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "+91 8378985323",
                  href: "tel:+918378985323",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: MapPin,
                  title: "Location",
                  content: "Nagpur, Maharashtra",
                  href: "#",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  content: "+91 8378985323",
                  href: "https://wa.me/918378985323",
                  color: "from-green-400 to-green-600"
                }
              ].map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg mb-1">{item.title}</h4>
                    <p className="text-white/60">{item.content}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 rounded-3xl p-8 sm:p-10 backdrop-blur-sm border border-white/10"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-lg font-semibold">Your Name</FormLabel>
                      <FormControl>
                        <FloatingInput field={field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
 <FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="contact-email" className="text-white text-lg font-semibold">Email Address</FormLabel>
      <FormControl>
        <FloatingInput 
          field={field}
          placeholder="your.email@example.com"
          id="contact-email" // ✅ Unique id
          autoComplete="email" // ✅ Autocomplete add karo
        />
      </FormControl>
      <FormMessage className="text-red-400" />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="contact-name" className="text-white text-lg font-semibold">Your Name</FormLabel>
      <FormControl>
        <FloatingInput 
          field={field}
          placeholder="Enter your full name"
          id="contact-name" // ✅ Unique id
          autoComplete="name" // ✅ Autocomplete add karo
        />
      </FormControl>
      <FormMessage className="text-red-400" />
    </FormItem>
  )}
/>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-6 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-primary/25"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Send Message 
                        <Send className="ml-3 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            {/* Form success animation */}
            <AnimatePresence>
              {form.formState.isSubmitSuccessful && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white text-lg font-semibold">Message Sent!</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 sm:mt-24"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-white/60 text-lg mb-8"
          >
            Prefer a quicker chat?
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://wa.me/918378985323"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-green-500/25"
            >
              <MessageCircle size={20} />
              WhatsApp Me
            </motion.a>
            
            <motion.a
              href="mailto:himanshukanojiya27@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 border border-white/20"
            >
              <Mail size={20} />
              Send Email
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}