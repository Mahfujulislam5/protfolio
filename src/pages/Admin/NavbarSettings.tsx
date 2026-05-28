import React from "react";
import { Menu, Save } from "lucide-react";

export function NavbarSettings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Navbar Builder</h1>
          <p className="text-sm text-white/50">Manage upper navigation links and CTA buttons.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
          <Save className="w-4 h-4" /> Save Navigation
        </button>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 p-8">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Menu className="w-5 h-5 text-gray-400" /> Primary Links</h3>
        <div className="space-y-4">
           {['Projects', 'Prompts', 'Tools', 'Categories'].map((item, idx) => (
             <div key={idx} className="flex gap-4 items-center">
               <input type="text" defaultValue={item} className="w-1/3 bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-white/40 text-sm" />
               <input type="text" defaultValue={`/${item.toLowerCase()}`} className="w-2/3 bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-white/40 text-sm text-white/50" />
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
