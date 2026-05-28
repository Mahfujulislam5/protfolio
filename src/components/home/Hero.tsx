import { motion } from "motion/react";
import { ArrowRight, Github, Twitter, Linkedin, MonitorSmartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSettings } from "../../lib/SettingsContext";

export function Hero() {
  const globalSettings = useSettings();
  const [settings, setSettings] = useState({
    heading: "",
    subheading: "I build premium SaaS applications, AI tool platforms, and cinematic web experiences.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "hero");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <section className="min-h-[90vh] flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-primary rounded-full border-t-transparent animate-spin"></div></section>;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[#030014]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass w-fit border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-white/80 tracking-wide">Available for Work</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-[1.1]">
              {settings.heading ? (
                <span>{settings.heading}</span>
              ) : (
                <>
                  Hi, I'm <span className="text-white">Mahfujul</span>
                  <br />
                  <span className="text-gradient">Digital Creator</span>
                </>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 font-light max-w-xl leading-relaxed whitespace-pre-line">
              {settings.subheading}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/projects" className="group relative px-8 py-4 bg-white text-black font-medium rounded-full overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  Explore Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link to="/tools" className="px-8 py-4 glass text-white font-medium rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4" /> View AI Tools
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-white/10 mt-4 max-w-md">
              <a href={globalSettings.socials.github} target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:bg-white/10 hover:-translate-y-1 transition-all text-white/70 hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href={globalSettings.socials.twitter} target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:bg-white/10 hover:-translate-y-1 transition-all text-white/70 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={globalSettings.socials.linkedin} target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:bg-white/10 hover:-translate-y-1 transition-all text-white/70 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Right Image/Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Circular glowing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full max-w-[400px] aspect-square rounded-full border border-dashed border-white/20"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[120%] aspect-square rounded-full border border-white/5 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
              />
            </div>
            
            {/* Main Image Container */}
            <div className="relative z-10 w-full max-w-[450px] aspect-[4/5] glass-card rounded-[2.5rem] overflow-hidden p-2 group bg-black/40">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {settings.imageUrl ? (
                <img 
                  src={settings.imageUrl} 
                  alt="Digital Creator" 
                  className="w-full h-full object-cover rounded-[2rem] filter contrast-125 group-hover:saturate-100 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/50 text-sm">No Image</span>
                </div>
              )}
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 glass-card px-4 py-3 rounded-2xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">AI</div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/50">Specialist</span>
                  <span className="text-sm font-bold">Prompt Eng.</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 -right-6 glass-card px-4 py-3 rounded-2xl flex items-center gap-3"
              >
                <div className="text-right flex flex-col">
                  <span className="text-xs text-white/50">Experience</span>
                  <span className="text-sm font-bold">5+ Years</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">✨</div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
