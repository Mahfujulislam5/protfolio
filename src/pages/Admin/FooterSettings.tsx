import React from "react";
import { LayoutPanelTop, Save } from "lucide-react";

export function FooterSettings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Footer Layout</h1>
          <p className="text-sm text-white/50">Manage lower site links, social handles, and copyright.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
          <Save className="w-4 h-4" /> Save Footer
        </button>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 p-8">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><LayoutPanelTop className="w-5 h-5 text-gray-400" /> General Info</h3>
        <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Footer Brand Text</label>
              <textarea defaultValue="Crafting cinematic web experiences and advanced AI tools for modern creators." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-white/40 mt-1 h-20" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Copyright Line</label>
              <input type="text" defaultValue="© 2026 Mahfujul. All Rights Reserved." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-white/40 mt-1" />
            </div>
        </div>
      </div>
    </div>
  )
}
