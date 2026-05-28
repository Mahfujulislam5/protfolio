import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Copy, Download, FolderGit2, Users, Wrench } from "lucide-react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function Stats() {
  const [liveStats, setLiveStats] = useState([
    { label: "Projects Completed", value: "0", icon: FolderGit2, suffix: "+" },
    { label: "AI Prompts", value: "0", icon: Copy, suffix: "+" },
    { label: "Tools Created", value: "0", icon: Wrench, suffix: "+" },
    { label: "Total Downloads", value: "10K", icon: Download, suffix: "+" },
    { label: "Happy Clients", value: "30", icon: Users, suffix: "+" },
  ]);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const projectsSnap = await getCountFromServer(collection(db, "projects"));
        const promptsSnap = await getCountFromServer(collection(db, "prompts"));
        const toolsSnap = await getCountFromServer(collection(db, "tools"));
        
        setLiveStats(prev => prev.map(stat => {
          if (stat.label === "Projects Completed") return { ...stat, value: String(projectsSnap.data().count) };
          if (stat.label === "AI Prompts") return { ...stat, value: String(promptsSnap.data().count) };
          if (stat.label === "Tools Created") return { ...stat, value: String(toolsSnap.data().count) };
          return stat;
        }));
      } catch (error) {
        console.error("Failed to fetch live stats", error);
      }
    }
    fetchCounts();
  }, []);

  return (
    <section className="relative z-20 -mt-12 container mx-auto max-w-7xl px-4">
      <div className="glass-card rounded-3xl p-8 lg:p-12 border border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent opacity-50"></div>
        
        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {liveStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center gap-3 pt-6 md:pt-0"
              >
                <div className="p-3 rounded-2xl bg-white/5 text-white/70">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                  {stat.value}{stat.suffix}
                </h3>
                <p className="text-xs tracking-wider text-white/50 uppercase font-medium text-center">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
