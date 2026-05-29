import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, Sparkles, Trash2, Edit2, Code, Link as LinkIcon } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManagePremiumTools() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortTitle: "",
    description: "",
    iconUrl: "",
    url: "",
    htmlCode: "",
    color: "from-blue-500 to-indigo-500",
    spanClass: "col-span-1 md:col-span-6 lg:col-span-4"
  });

  useEffect(() => {
    const q = query(collection(db, "premiumTools"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTools(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "premiumTools"), {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", shortTitle: "", description: "", iconUrl: "", url: "", htmlCode: "", color: "from-blue-500 to-indigo-500", spanClass: "col-span-1 md:col-span-6 lg:col-span-4" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this premium tool?")) {
      await deleteDoc(doc(db, "premiumTools", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Premium Tools</h1>
          <p className="text-sm text-white/50">Manage dynamic tools for the Premium Collection. Upload HTML code to create custom tools.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity flex-shrink-0 shadow-lg shadow-purple-500/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Premium Tool</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" /> New Premium Tool</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Tool Title</label>
              <input 
                type="text" 
                placeholder="e.g. Code Converter" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Short Title (Badge)</label>
              <input 
                type="text" 
                placeholder="e.g. Convert" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all text-sm"
                value={formData.shortTitle}
                onChange={e => setFormData({...formData, shortTitle: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">Description</label>
              <input 
                type="text" 
                placeholder="Briefly describe what this premium tool does..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all text-sm"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Custom Link URL (Optional - leave empty if providing HTML Code)</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <LinkIcon className="w-4 h-4 text-white/30" />
                 </div>
                 <input 
                  type="url" 
                  placeholder="https://..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm"
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Grid Size</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.spanClass}
                onChange={e => setFormData({...formData, spanClass: e.target.value})}
              >
                <option value="col-span-1 md:col-span-6 lg:col-span-4">Small (1/3 Width)</option>
                <option value="col-span-1 md:col-span-6 lg:col-span-8">Large (2/3 Width)</option>
                <option value="col-span-1 md:col-span-12 lg:col-span-12">Full Width</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Gradient Theme</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
              >
                <option value="from-blue-500 to-indigo-500">Blue & Indigo</option>
                <option value="from-purple-500 to-pink-500">Purple & Pink</option>
                <option value="from-emerald-500 to-teal-500">Emerald & Teal</option>
                <option value="from-orange-500 to-rose-500">Orange & Rose</option>
                <option value="from-gray-700 to-gray-500">Grayscale Minimal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">Logo / Icon</label>
              <ImageUploadInput 
                value={formData.iconUrl} 
                onChange={(url) => setFormData({...formData, iconUrl: url})} 
                label="Upload Premium Logo" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1 flex items-center gap-2">
                <Code className="w-4 h-4" /> HTML & Coding snippet (Optional)
              </label>
              <p className="text-xs text-white/40 mb-2">If you provide HTML code here, the tool link will automatically open a custom page rendering this HTML. Perfect for standalone mini-tools!</p>
              <textarea 
                placeholder="<div>Hello Tool...</div>" 
                rows={6}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-mono text-sm"
                value={formData.htmlCode}
                onChange={e => setFormData({...formData, htmlCode: e.target.value})}
              />
            </div>

          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
               Add Tool to Collection
             </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 text-center py-12 text-white/40 font-medium">Loading premium tools...</div>
        ) : tools.length === 0 ? (
           <div className="lg:col-span-2 text-center py-12 text-white/40 font-medium glass-card border border-white/5 rounded-3xl">No premium tools added yet. Default ones are shown automatically.</div>
        ) : tools.map((tool, idx) => (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={tool.id} 
            className="glass-card rounded-[2rem] p-6 border border-white/5 group transition-all flex border-l-[4px] border-l-purple-500 flex-col relative overflow-hidden"
          >
             <div className="flex items-start justify-between mb-4 relative z-10">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center border border-white/10 shrink-0 p-1 overflow-hidden`}>
                    {tool.iconUrl ? <img src={tool.iconUrl} className="w-full h-full object-contain rounded-xl bg-[#0a0a0f] p-1" /> : <Sparkles className="w-6 h-6 text-white/30 bg-[#0a0a0f] w-full h-full rounded-xl p-1" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-0.5">{tool.title}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-md">{tool.shortTitle}</span>
                  </div>
               </div>
               
               <div className="flex flex-col gap-2">
                 <button onClick={() => handleDelete(tool.id)} className="p-1.5 rounded-md glass text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
               </div>
             </div>

             <p className="text-sm text-white/60 mb-6 flex-1 relative z-10">{tool.description}</p>

             <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto relative z-10">
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/50">
                  {tool.htmlCode ? <><Code className="w-3.5 h-3.5"/> Hosted HTML Base</> : <><LinkIcon className="w-3.5 h-3.5"/> External URL</>}
                </span>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
