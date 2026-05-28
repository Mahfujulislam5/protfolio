import { useState, useEffect } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only published projects
    const q = query(collection(db, "projects"), where("status", "==", "published"));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Projects</h1>
        <p className="text-white/50 text-lg">A selection of my recent work and experiments.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/50">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-white/50">No published projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={p.id} 
              className="glass rounded-3xl overflow-hidden group hover:border-white/20 transition-colors"
            >
              <div className="aspect-video bg-white/5 relative flex items-center justify-center">
                {/* Placeholder for thumbnail */}
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/20 font-display font-medium text-lg">No Thumbnail</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-display mb-2">{p.title}</h3>
                <p className="text-sm text-white/50 line-clamp-2">{p.description}</p>
                <div className="mt-6 flex gap-3">
                  {p.liveDemo && (
                    <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90">
                      Live Demo
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" className="text-sm font-medium glass px-4 py-2 rounded-full hover:bg-white/10">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
