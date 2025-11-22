import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is too short"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Message sent!",
      description: "I'll get back to you as soon as possible.",
    });
    form.reset();
  }

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-medium text-secondary tracking-widest uppercase mb-2 sm:mb-3">
            Get In Touch
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display">
            Let's Work <span className="text-gradient">Together</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed sm:leading-loose">
              I'm currently looking for new opportunities and freelance projects. 
              Whether you have a project in mind or just want to connect, feel free to reach out!
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-panel rounded-lg sm:rounded-xl hover:border-primary/30 transition-colors group min-h-[80px]">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-105 sm:group-hover:scale-110 transition-transform flex-shrink-0">
                  <Mail size={20} className="sm:size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm sm:text-base">Email</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm truncate">
                    himanshukanojiya27@gmail.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-panel rounded-lg sm:rounded-xl hover:border-primary/30 transition-colors group min-h-[80px]">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-105 sm:group-hover:scale-110 transition-transform flex-shrink-0">
                  <Phone size={20} className="sm:size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm sm:text-base">Phone</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    +91 8378985323
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-panel rounded-lg sm:rounded-xl hover:border-primary/30 transition-colors group min-h-[80px]">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-105 sm:group-hover:scale-110 transition-transform flex-shrink-0">
                  <MapPin size={20} className="sm:size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm sm:text-base">Location</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Nagpur, Maharashtra
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            <div className="sm:hidden space-y-3 pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground text-center">
                Quick actions:
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => window.open('mailto:himanshukanojiya27@gmail.com')}
                >
                  <Mail size={14} className="mr-1" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => window.open('tel:+918378985323')}
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl order-1 lg:order-2"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="bg-white/5 border-white/10 focus:border-primary h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          {...field} 
                          className="bg-white/5 border-white/10 focus:border-primary h-11 sm:h-12 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell me about your project..." 
                          {...field} 
                          className="bg-white/5 border-white/10 focus:border-primary min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-vertical"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-4 sm:py-6 rounded-lg sm:rounded-xl text-sm sm:text-base min-h-[48px] sm:min-h-[56px]"
                >
                  Send Message <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </form>
            </Form>

            {/* Form Submission Hint */}
            <div className="mt-4 pt-4 border-t border-white/10 sm:hidden">
              <p className="text-xs text-muted-foreground text-center">
                📱 Form optimized for mobile
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:hidden text-center"
        >
          <p className="text-sm text-muted-foreground">
            💬 Prefer to chat? Tap the quick action buttons above!
          </p>
        </motion.div>
      </div>

      {/* Background Decorative Elements - Mobile Optimized */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 -right-8 w-32 h-32 sm:w-48 sm:h-48 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 -left-8 w-32 h-32 sm:w-48 sm:h-48 bg-secondary/5 rounded-full blur-xl"></div>
      </div>
    </section>
  );
}