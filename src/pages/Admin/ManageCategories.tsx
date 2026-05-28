import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, Tags as TagsIcon, LayoutGrid, EyeOff, Eye, Image as ImageIcon, Trash2, Edit2 } from "lucide-react";

export function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    icon: "",
    isVisible: true
  });

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("title"));
    const unsub = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "categories"), {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", slug: "", icon: "", isVisible: true });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, "categories", id));
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "categories", id), { isVisible: !currentStatus });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Category Architecture</h1>
          <p className="text-sm text-white/50">Organize content structure across the platform.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Create Category</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><TagsIcon className="w-5 h-5 text-emerald-400" /> New Category Setup</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Category Title</label>
              <input 
                type="text" 
                placeholder="e.g. UI/UX Design" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">URL Slug</label>
              <input 
                type="text" 
                placeholder="ui-ux-design" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Icon Name (Lucide)</label>
              <input 
                type="text" 
                placeholder="e.g. PenTool" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
               <input 
                 type="checkbox" 
                 id="visible"
                 className="w-4 h-4 rounded bg-black border-white/10 accent-emerald-500 cursor-pointer"
                 checked={formData.isVisible}
                 onChange={e => setFormData({...formData, isVisible: e.target.checked})}
               />
               <label htmlFor="visible" className="text-sm font-medium text-white/70 cursor-pointer">Visible to Public</label>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Save Structure
             </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="md:col-span-4 text-center py-12 text-white/40 font-medium">Mapping structure...</div>
        ) : categories.length === 0 ? (
          <div className="md:col-span-4 text-center py-12 text-white/40 font-medium glass-card rounded-3xl border border-white/5">No categories defined.</div>
        ) : categories.map((cat, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={cat.id} 
            className="glass-card rounded-[2rem] p-6 border border-white/5 flex flex-col items-center text-center group hover:border-white/20 transition-all relative overflow-hidden"
          >
            {/* Contextual Color Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>

            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => toggleVisibility(cat.id, cat.isVisible)}
                 className="p-1.5 rounded-lg glass text-white/50 hover:text-white transition-colors"
                 title={cat.isVisible ? "Hide Category" : "Make Visible"}
               >
                 {cat.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
               </button>
               <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg glass text-red-400/50 hover:text-red-400 transition-colors">
                 <Trash2 className="w-3.5 h-3.5" />
               </button>
            </div>

            <div className="w-16 h-16 rounded-2xl glass mb-4 flex items-center justify-center bg-white/[0.02]">
              <LayoutGrid className="w-8 h-8 text-white/70 group-hover:text-emerald-400 transition-colors" />
            </div>
            
            <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">/{cat.slug}</p>
            
            <div className="mt-auto pt-4 flex items-center justify-center">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${cat.isVisible ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                {cat.isVisible ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
