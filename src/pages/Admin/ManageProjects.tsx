import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, Image as ImageIcon, Link as LinkIcon, Database, Video, Box, Trash2, Edit2 } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    thumbnail: "",
    liveDemo: "",
    github: "",
    metaTitle: "",
    metaDescription: "",
    status: "published"
  });

  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "projects"), {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", slug: "", description: "", category: "", thumbnail: "", liveDemo: "", github: "", metaTitle: "", metaDescription: "", status: "published" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects Manager</h1>
          <p className="text-sm text-white/50">Add, edit, or remove portfolio projects.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Project</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><Box className="w-5 h-5 text-primary" /> Create Project</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Project Title</label>
              <input 
                type="text" 
                placeholder="e.g. Nexus AI Platform" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">URL Slug</label>
              <input 
                type="text" 
                placeholder="nexus-ai-platform" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">Description</label>
              <textarea 
                placeholder="Brief project description..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm min-h-[100px] resize-y"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">Thumbnail Image</label>
              <ImageUploadInput 
                value={formData.thumbnail} 
                onChange={(url) => setFormData({...formData, thumbnail: url})} 
                label="Upload Thumbnail" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Category</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category</option>
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Portfolio">Portfolio</option>
                <option value="AI Tool">AI Tool</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Live Demo URL</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <LinkIcon className="w-4 h-4 text-white/30" />
                 </div>
                 <input 
                  type="url" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm"
                  value={formData.liveDemo}
                  onChange={e => setFormData({...formData, liveDemo: e.target.value})}
                />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">SEO Meta Title</label>
              <input 
                type="text" 
                placeholder="Optional meta title for SEO" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.metaTitle}
                onChange={e => setFormData({...formData, metaTitle: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">SEO Meta Description</label>
              <textarea 
                placeholder="Brief meta description for search engines..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm min-h-[80px] resize-y"
                value={formData.metaDescription}
                onChange={e => setFormData({...formData, metaDescription: e.target.value})}
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Status</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-6 border-t border-white/10">
             <p className="text-xs text-white/30 mb-4 sm:mb-0">Note: Advanced settings (gallery, tags, apk upload) are available after creation.</p>
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Save Project
             </button>
          </div>
        </motion.form>
      )}

      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
           <h3 className="font-bold flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> Active Records</h3>
           <div className="text-xs font-medium text-white/50">Total: {projects.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 border-b border-white/5">
              <tr>
                <th className="p-4 px-6 font-semibold text-white/40 uppercase tracking-widest text-[10px]">Project</th>
                <th className="p-4 font-semibold text-white/40 uppercase tracking-widest text-[10px]">Category</th>
                <th className="p-4 font-semibold text-white/40 uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-semibold text-white/40 uppercase tracking-widest text-[10px] w-32 text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/40 font-medium">Fetching records...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/40 font-medium">No projects found. Create one above.</td></tr>
              ) : projects.map((p, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={p.id} 
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                         {p.thumbnail ? <img src={p.thumbnail} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-white/20" />}
                       </div>
                       <div>
                         <p className="font-bold text-white group-hover:text-primary transition-colors">{p.title}</p>
                         <p className="text-[10px] text-white/40 font-mono mt-0.5">/{p.slug}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-white/5 border border-white/10 text-white/70">
                      {p.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border 
                      ${p.status === 'published' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                        p.status === 'hidden' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                        'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg glass text-white/50 hover:text-white hover:bg-white/10 transition-all">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg glass text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
