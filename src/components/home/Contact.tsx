import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useSettings } from "../../lib/SettingsContext";

export function Contact() {
  const settings = useSettings();
  const [isSent, setIsSent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <section className="py-32 container mx-auto max-w-7xl px-4">
      <div className="glass-card rounded-[3rem] p-8 md:p-16 relative overflow-hidden border border-white/10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Info */}
          <div className="flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Let's Build Something <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Extraordinary.</span>
              </h2>
              <p className="text-xl text-white/60 font-light mb-12 max-w-md">
                Have a project idea? Looking to integrate modern AI into your workflow? Drop a line and let's talk.
              </p>

              <div className="space-y-6">
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full glass flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Email Me At</p>
                    <p className="text-lg font-medium group-hover:text-primary transition-colors">{settings.contactEmail}</p>
                  </div>
                </a>
                
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full glass flex items-center justify-center group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">WhatsApp / Direct Message</p>
                    <p className="text-lg font-medium group-hover:text-green-400 transition-colors">+880 (Call to Action)</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Location</p>
                    <p className="text-lg font-medium">Remote / Global</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Modern Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-white/5"
          >
            <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Your Name</label>
                  <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium placeholder:text-white/30" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                  <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium placeholder:text-white/30" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-white/70 ml-1">Subject</label>
                 <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium placeholder:text-white/30" placeholder="Project Inquiry" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Message</label>
                <textarea rows={4} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium placeholder:text-white/30 resize-none" placeholder="Tell me about your project..."></textarea>
              </div>

              <button type="submit" disabled={isSent} className="w-full py-4 bg-white text-black font-bold flex items-center justify-center gap-2 rounded-xl group hover:bg-white/90 transition-all disabled:opacity-80 disabled:hover:bg-white">
                 {isSent ? (
                   <><CheckCircle2 className="w-5 h-5 text-green-500" /> Message Sent!</>
                 ) : (
                   <>Send Message <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>
                 )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
