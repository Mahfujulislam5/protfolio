import React from "react";
import { Palette, Save, LayoutTemplate } from "lucide-react";

export function AppearanceSettings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Appearance Customizer</h1>
          <p className="text-sm text-white/50">Tweak UI components, visual themes, and spatial elements.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
          <Save className="w-4 h-4" /> Save Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Palette className="w-5 h-5 text-pink-400" /> Color System</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Accent Brand Color</label>
              <div className="flex items-center gap-4 mt-2">
                 <input type="color" defaultValue="#3b82f6" className="w-12 h-12 rounded cursor-pointer bg-transparent" />
                 <span className="font-mono text-sm">#3B82F6</span>
              </div>
            </div>
            <div>
               <label className="text-xs font-medium text-white/50 ml-1">Glassmorphism Blur Intensity</label>
               <input type="range" className="w-full mt-3 accent-pink-500" defaultValue="50" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><LayoutTemplate className="w-5 h-5 text-orange-400" /> Layout Frame</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
               <div><p className="font-bold text-sm">Cinematic Viewport (Hide Scrollbars)</p></div>
               <input type="checkbox" className="w-4 h-4 accent-orange-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
               <div><p className="font-bold text-sm">Enable Mouse Reactive Glow</p></div>
               <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
