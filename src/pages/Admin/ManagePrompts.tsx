import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, MessageSquare, Trash2, Edit2, Star, Image as ImageIcon } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManagePrompts() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    categories: "",
    tags: "",
    previewImage: "",
    featured: false
  });

  useEffect(() => {
    const q = query(collection(db, "prompts"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPrompts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "prompts"), {
      title: formData.title,
      text: formData.text,
      previewImage: formData.previewImage,
      categories: formData.categories.split(',').map(s => s.trim()).filter(s => s),
      tags: formData.tags.split(',').map(s => s.trim()).filter(s => s),
      featured: formData.featured,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", text: "", categories: "", tags: "", previewImage: "", featured: false });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      await deleteDoc(doc(db, "prompts", id));
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "prompts", id), { featured: !currentStatus });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Prompt Library Manager</h1>
          <p className="text-sm text-white/50">Curate and manage AI prompts for your users.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Prompt</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-purple-400" /> Create Prompt Entry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">Prompt Title</label>
              <input 
                type="text" 
                placeholder="e.g. Cinematic Portrait Generation" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1 flex justify-between">
                <span>The Prompt Payload</span>
                <span className="text-[10px] text-white/30">Markdown supported</span>
              </label>
              <textarea 
                placeholder="Type the exact prompt payload here..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-mono text-sm min-h-[150px] resize-y leading-relaxed text-white/90"
                value={formData.text}
                required
                onChange={e => setFormData({...formData, text: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Categories (comma separated)</label>
              <input 
                type="text" 
                placeholder="Marketing, Design, Development" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all text-sm"
                value={formData.categories}
                onChange={e => setFormData({...formData, categories: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="midjourney, chatgpt, stable-diffusion" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all text-sm"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">Preview Image (Optional)</label>
              <ImageUploadInput 
                value={formData.previewImage} 
                onChange={(url) => setFormData({...formData, previewImage: url})} 
                label="Upload Preview" 
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
               <input 
                 type="checkbox" 
                 id="featured"
                 className="w-4 h-4 rounded bg-black border-white/10 accent-purple-500 cursor-pointer"
                 checked={formData.featured}
                 onChange={e => setFormData({...formData, featured: e.target.checked})}
               />
               <label htmlFor="featured" className="text-sm font-medium text-white/70 cursor-pointer">Set as Featured Prompt</label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Save to Library
             </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="md:col-span-2 text-center py-12 text-white/40 font-medium">Fetching prompts...</div>
        ) : prompts.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-white/40 font-medium glass-card rounded-3xl border border-white/5">No prompts found in library.</div>
        ) : prompts.map((p, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={p.id} 
            className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col gap-4 group hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{p.title}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                   {(p.categories || []).map((c: string) => (
                      <span key={c} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 rounded-md text-[10px] uppercase font-medium">{c}</span>
                   ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                 <button 
                  onClick={() => toggleFeatured(p.id, p.featured)}
                  className={`p-2 rounded-lg transition-all ${p.featured ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' : 'text-white/30 glass hover:text-white hover:bg-white/10'}`}
                  title={p.featured ? "Remove Featured" : "Mark Featured"}
                 >
                   <Star className={`w-4 h-4 ${p.featured ? 'fill-yellow-400' : ''}`} />
                 </button>
                 <button className="p-2 rounded-lg glass text-white/50 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg glass text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
            
            <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-white/60 line-clamp-4 relative group-hover:text-white/80 transition-colors cursor-text">
               {p.text}
            </div>

            {p.tags && p.tags.length > 0 && (
              <div className="mt-auto pt-2 flex gap-2 flex-wrap">
                 {p.tags.map((t: string) => <span key={t} className="text-[10px] text-white/30">#{t}</span>)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
