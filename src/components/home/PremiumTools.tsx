import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, Wrench } from "lucide-react";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function PremiumTools() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const q = query(
          collection(db, "tools"),
          where("status", "==", "active"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const fetchedTools = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTools(fetchedTools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  return (
    <section className="py-24 container mx-auto max-w-7xl px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Tool Showcase</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold">Premium Tools</h3>
        </div>
        <a href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          View All Tools <ExternalLink className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
             <div key={i} className="h-64 glass-card rounded-3xl animate-pulse bg-white/5"></div>
          ))
        ) : tools.map((tool, idx) => {
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 bg-opacity-20 flex items-center justify-center mb-8 relative z-10 p-0.5">
                <div className="w-full h-full bg-[#030014]/50 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden p-2">
                  {tool.iconUrl ? <img src={tool.iconUrl} className="w-full h-full object-contain" /> : <Wrench className="w-6 h-6 text-white" />}
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold">{tool.title}</h4>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-medium text-green-400 uppercase tracking-wide">Live</span>
                </div>
              </div>

              <p className="text-white/60 mb-8 relative z-10 leading-relaxed font-light">
                {tool.description}
              </p>

              <div className="flex gap-4 relative z-10 mt-auto">
                <a href={tool.url || "#"} className="flex-1 flex items-center justify-center py-3 bg-white text-black font-medium text-sm rounded-xl hover:bg-white/90 transition-colors">Launch Tool</a>
                <a href={tool.url || "#"} className="px-4 py-3 flex items-center justify-center glass rounded-xl hover:bg-white/10 transition-colors"><ExternalLink className="w-4 h-4" /></a>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  );
}
