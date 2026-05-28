import { motion } from "motion/react";
import { Download, Star, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function AppShowcase() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      const q = query(
        collection(db, "apps"),
        where("status", "==", "published"),
        limit(1) // Show only the latest published app in the showcase, or modify as needed
      );
      const snapshot = await getDocs(q);
      setApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchApps();
  }, []);

  if (apps.length === 0) return null;
  const app = apps[0];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-white/10 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

          {/* Left Content */}
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-white/80 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Latest App Release
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              {app.title.split(' ')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-500">
                {app.title.substring(app.title.indexOf(' ') + 1) || "Mobile Client"}
              </span>
            </h2>

            <p className="text-lg text-white/60 leading-relaxed max-w-lg font-light">
              {app.description}
            </p>

            <ul className="space-y-4 text-white/80">
              {app.features && app.features.slice(0, 3).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              {app.apkUrl ? (
                <a href={app.apkUrl} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  <Download className="w-5 h-5" /> Download APK
                </a>
              ) : (
                <button disabled className="px-8 py-4 bg-white/20 text-white/50 font-bold rounded-xl flex items-center gap-3 cursor-not-allowed">
                  <Download className="w-5 h-5" /> Coming Soon
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                </div>
                <span className="text-white/60 text-sm">{app.version || 'v1.0.0'}</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative flex justify-center lg:justify-end z-10 w-full"
          >
            <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-white/10 shadow-2xl overflow-hidden flex-shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white/10 rounded-b-3xl z-20"></div>
              {app.icon ? (
                <img 
                  src={app.icon} 
                  alt="App Screenshot" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex flex-col items-center justify-center p-6 text-center text-white/50">
                   <p>No preview available</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-0 w-full px-6 flex justify-between items-center">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                   <div className="w-6 h-6 bg-gradient-to-tr from-accent to-primary rounded-md"></div>
                </div>
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
