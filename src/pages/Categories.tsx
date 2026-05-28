import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { Link } from "react-router-dom";

export function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "categories")), (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-32 bg-[#030014]">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Ecosystem Categories</h1>
        <p className="text-white/50 text-lg max-w-2xl">Explore all domains, templates, prompts, and resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
             [...Array(8)].map((_, i) => (
              <div key={i} className="h-40 glass-card rounded-3xl animate-pulse"></div>
            ))
        ) : categories.length === 0 ? (
           <div className="col-span-full py-24 text-center text-white/40 glass-card rounded-[2rem] border border-white/5">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No categories found.</p>
           </div>
        ) : categories.map((cat, idx) => (
          <Link to={`/projects?category=${cat.slug}`} key={cat.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden h-full flex flex-col justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-2xl font-bold font-display mb-2 relative z-10">{cat.name}</h3>
              <p className="text-sm text-white/40 relative z-10">{cat.slug}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
