import React from "react";
import { Search, Save, Globe } from "lucide-react";

export function SeoSettings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">SEO Control Center</h1>
          <p className="text-sm text-white/50">Manage Meta tags, OpenGraph, and Indexing rules.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
          <Save className="w-4 h-4" /> Save SEO Rules
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Default Meta</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Site Title</label>
              <input type="text" defaultValue="Mahfujul | Creator Ecosystem" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-400 mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Meta Description</label>
              <textarea defaultValue="Professional UI/UX developer and AI tools creator." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-400 mt-1 h-24" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Search className="w-5 h-5 text-purple-400" /> Indexing Engine</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
               <div><p className="font-bold text-sm">Allow Search Engine Indexing</p></div>
               <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
               <div><p className="font-bold text-sm">Auto-generate Sitemap.xml</p></div>
               <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
