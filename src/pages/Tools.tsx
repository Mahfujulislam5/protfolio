import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { Wrench, ArrowUpRight } from "lucide-react";

export function Tools() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "tools")), (snapshot) => {
      setTools(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-32 bg-[#030014]">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">AI Tools Ecosystem</h1>
        <p className="text-white/50 text-lg max-w-2xl">A curated collection of professional AI generators, calculators, and automation utilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 glass-card rounded-3xl animate-pulse"></div>
          ))
        ) : tools.map((tool, idx) => (
          <motion.a 
            href={tool.url || "#"}
            target="_blank"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={tool.id} 
            className="group glass-card p-6 border border-white/5 rounded-[2rem] hover:border-blue-500/30 transition-all flex flex-col h-full bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
               <ArrowUpRight className="w-5 h-5 text-blue-400" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 overflow-hidden p-2">
               {tool.iconUrl ? <img src={tool.iconUrl} className="w-full h-full object-contain" /> : <Wrench className="w-6 h-6 text-blue-400" />}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{tool.title}</h3>
            <p className="text-sm text-white/50 mb-6 flex-1">{tool.description}</p>
            <div className="flex items-center justify-between">
               <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{tool.category || 'Utility'}</span>
               {tool.status === 'active' && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
