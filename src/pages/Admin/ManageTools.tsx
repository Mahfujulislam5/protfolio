import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, Wrench, Trash2, Edit2, Database, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManageTools() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconUrl: "",
    url: "",
    category: "",
    status: "active"
  });

  useEffect(() => {
    const q = query(collection(db, "tools"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTools(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "tools"), {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", description: "", iconUrl: "", url: "", category: "", status: "active" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tool?")) {
      await deleteDoc(doc(db, "tools", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Tools Directory</h1>
          <p className="text-sm text-white/50">Manage external tools, calculators, and AI generators.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Tool</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><Wrench className="w-5 h-5 text-blue-400" /> Tool Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Tool Name</label>
              <input 
                type="text" 
                placeholder="e.g. Prompt Optimizer" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Category</label>
              <input 
                type="text" 
                placeholder="e.g. AI Content, Development" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-400 focus:bg-black/60 transition-all text-sm"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">Description</label>
              <input 
                type="text" 
                placeholder="Briefly describe what this tool does..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-400 focus:bg-black/60 transition-all text-sm"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Tool URL</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <LinkIcon className="w-4 h-4 text-white/30" />
                 </div>
                 <input 
                  type="url" 
                  placeholder="https://..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium text-sm"
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  required
                />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">Tool Icon</label>
              <ImageUploadInput 
                value={formData.iconUrl} 
                onChange={(url) => setFormData({...formData, iconUrl: url})} 
                label="Upload Icon Image" 
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Status</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="development">In Development</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Add Tool
             </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="xl:col-span-3 text-center py-12 text-white/40 font-medium">Loading tools...</div>
        ) : tools.length === 0 ? (
           <div className="xl:col-span-3 text-center py-12 text-white/40 font-medium glass-card border border-white/5 rounded-3xl">No tools found.</div>
        ) : tools.map((tool, idx) => (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={tool.id} 
            className="glass-card rounded-[2rem] p-6 border border-white/5 group hover:border-white/20 transition-all flex flex-col relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
             
             <div className="flex items-start justify-between mb-4 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white-5 glass flex items-center justify-center border border-white/10 shrink-0 p-2 overflow-hidden">
                    {tool.iconUrl ? <img src={tool.iconUrl} className="w-full h-full object-contain" /> : <Wrench className="w-6 h-6 text-white/30" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-0.5">{tool.title}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">{tool.category || 'Tool'}</span>
                  </div>
               </div>
               
               <div className="flex flex-col gap-2">
                 <button className="p-1.5 rounded-md glass text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                 <button onClick={() => handleDelete(tool.id)} className="p-1.5 rounded-md glass text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
               </div>
             </div>

             <p className="text-sm text-white/60 mb-6 flex-1 relative z-10">{tool.description}</p>

             <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto relative z-10">
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border
                  ${tool.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                    tool.status === 'development' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 
                    'bg-white/5 border-white/10 text-white/50'}`}>
                   {tool.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                   {tool.status}
                </span>
                
                {tool.url && (
                  <a href={tool.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-white/50 hover:text-blue-400 transition-colors flex items-center gap-1">
                    Visit Link <LinkIcon className="w-3 h-3" />
                  </a>
                )}
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
