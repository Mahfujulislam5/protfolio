import React, { useState } from "react";
import { motion } from "motion/react";
import { Home, Layout, ToggleLeft, Save } from "lucide-react";

export function HomepageSettings() {
  const [sections, setSections] = useState([
    { id: 1, name: "Hero Section", enabled: true },
    { id: 2, name: "Featured Projects", enabled: true },
    { id: 3, name: "AI Prompts Marketplace", enabled: true },
    { id: 4, name: "Tools & Utilities", enabled: true },
    { id: 5, name: "Latest Blog Posts", enabled: false }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Homepage Builder</h1>
          <p className="text-sm text-white/50">Manage dynamic sections and visibility logic.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
          <Save className="w-4 h-4" /> Save Layout
        </button>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 p-6 md:p-8 col-span-2">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Layout className="w-5 h-5 text-purple-400" /> Active Sections</h3>
        <div className="space-y-3">
          {sections.map((section, idx) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
              <span className="font-bold text-sm tracking-wide text-white/80">{section.name}</span>
              <button onClick={() => {
                const newSec = [...sections];
                newSec[idx].enabled = !newSec[idx].enabled;
                setSections(newSec);
              }} className={`w-12 h-6 rounded-full p-1 transition-colors ${section.enabled ? 'bg-purple-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${section.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
