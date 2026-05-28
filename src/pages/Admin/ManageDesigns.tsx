import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, PenTool, Trash2, Maximize2, Image as ImageIcon } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManageDesigns() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imgUrl: "",
    aspect: "aspect-square",
    category: ""
  });

  useEffect(() => {
    const q = query(collection(db, "designs"));
    const unsub = onSnapshot(q, (snapshot) => {
      setDesigns(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "designs"), {
      ...formData,
      createdAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", imgUrl: "", aspect: "aspect-square", category: "" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this design from gallery?")) {
      await deleteDoc(doc(db, "designs", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Design Gallery Manager</h1>
          <p className="text-sm text-white/50">Upload posters, UI mockups, and artwork to the masonry gallery.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-colors shadow-lg shadow-orange-500/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Upload Design</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><PenTool className="w-5 h-5 text-orange-400" /> New Design Asset</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Asset Title / Name</label>
              <input 
                type="text" 
                placeholder="e.g. Neon Cyberpunk UI" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-orange-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Category</label>
              <input 
                type="text" 
                placeholder="e.g. Website Mockup, 3D Render" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-orange-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">High-Res Design Asset</label>
              <ImageUploadInput 
                value={formData.imgUrl} 
                onChange={(url) => setFormData({...formData, imgUrl: url})} 
                label="Upload Design Image" 
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Display Aspect Ratio</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-orange-400 focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.aspect}
                onChange={e => setFormData({...formData, aspect: e.target.value})}
              >
                <option value="aspect-square">Square (1:1)</option>
                <option value="aspect-[4/5]">Portrait (4:5)</option>
                <option value="aspect-[3/4]">Tall Portrait (3:4)</option>
                <option value="aspect-video">Landscape Video (16:9)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Add to Gallery
             </button>
          </div>
        </motion.form>
      )}

      {/* Masonry-like Grid for Admin preview */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {loading ? (
            <div className="w-full py-12 text-center text-white/40 col-span-full">Loading gallery...</div>
        ) : designs.length === 0 ? (
            <div className="w-full py-12 text-center text-white/40 glass-card rounded-3xl border border-white/5 col-span-full">No designs uploaded yet.</div>
        ) : designs.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx % 4) * 0.1 }}
            className={`relative break-inside-avoid glass-card p-1 rounded-2xl overflow-hidden group w-full ${item.aspect} border border-white/10`}
          >
            <img 
              src={item.imgUrl} 
              alt={item.title || 'Design'} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute inset-x-1 bottom-1 rounded-b-xl bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end">
              <p className="font-bold text-sm text-white line-clamp-1">{item.title || 'Untitled'}</p>
              {item.category && <p className="text-[10px] text-orange-400 font-medium uppercase mt-1">{item.category}</p>}
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
               <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full glass bg-black/50 border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center justify-center backdrop-blur-md">
                 <Trash2 className="w-4 h-4" />
               </button>
               <button className="w-8 h-8 rounded-full glass bg-black/50 border border-white/10 text-white hover:bg-white/20 flex items-center justify-center backdrop-blur-md">
                 <Maximize2 className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
