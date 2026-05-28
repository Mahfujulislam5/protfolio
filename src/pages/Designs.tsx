import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { Search, Filter, Layers } from "lucide-react";

export function Designs() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "UI/UX", "Branding", "3D Renders", "App Mockups"];

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "designs")), (snapshot) => {
      setDesigns(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filteredDesigns = activeCategory === "All" 
    ? designs 
    : designs.filter(d => d.category === activeCategory);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-32 bg-[#030014]">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Premium Design Gallery</h1>
        <p className="text-white/50 text-lg">A curated showcase of cinematic user interfaces, brand identities, and visual experiments.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {loading ? (
             [...Array(8)].map((_, i) => (
              <div key={i} className="w-full h-80 glass-card rounded-3xl animate-pulse"></div>
            ))
        ) : filteredDesigns.length === 0 ? (
           <div className="col-span-full py-24 text-center text-white/40 glass-card rounded-[2rem] border border-white/5">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No designs found in this category.</p>
           </div>
        ) : filteredDesigns.map((design, idx) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx % 4) * 0.1 }}
            className={`relative break-inside-avoid glass-card p-2 rounded-3xl overflow-hidden group w-full ${design.aspect || 'aspect-[4/5]'} border border-white/5 hover:border-orange-500/30 transition-colors cursor-pointer`}
          >
            <img 
              src={design.imgUrl} 
              alt={design.title} 
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-2 bottom-2 rounded-b-2xl bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
              <h3 className="font-bold text-lg text-white mb-1 drop-shadow-md">{design.title}</h3>
              {design.category && <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">{design.category}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
