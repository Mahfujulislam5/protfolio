import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, Smartphone, Trash2, Edit2, Download, Image as ImageIcon, Link as LinkIcon, Database } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManageApps() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    version: "",
    icon: "",
    apkUrl: "",
    description: "",
    features: "",
    changelog: "",
    status: "published"
  });

  useEffect(() => {
    const q = query(collection(db, "apps"));
    const unsub = onSnapshot(q, (snapshot) => {
      setApps(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "apps"), {
      ...formData,
      features: formData.features.split(',').map(s => s.trim()).filter(s => s),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", slug: "", version: "", icon: "", apkUrl: "", description: "", features: "", changelog: "", status: "published" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this app?")) {
      await deleteDoc(doc(db, "apps", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">App Showcase Manager</h1>
          <p className="text-sm text-white/50">Manage your mobile apps, APK downloads, and version history.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white text-sm font-medium rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Mobile App</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6 overflow-hidden"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><Smartphone className="w-5 h-5 text-pink-400" /> App Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">App Title</label>
              <input 
                type="text" 
                placeholder="e.g. Nexus Mobile" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">URL Slug</label>
              <input 
                type="text" 
                placeholder="nexus-mobile" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-400 focus:bg-black/60 transition-all text-sm"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Version Number</label>
              <input 
                type="text" 
                placeholder="e.g. v1.2.0" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-400 focus:bg-black/60 transition-all text-sm"
                value={formData.version}
                onChange={e => setFormData({...formData, version: e.target.value})}
                required
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">APK Download URL</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Download className="w-4 h-4 text-white/30" />
                 </div>
                 <input 
                  type="url" 
                  placeholder="https://firebasestorage..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-pink-400 focus:bg-black/60 transition-all font-medium text-sm"
                  value={formData.apkUrl}
                  onChange={e => setFormData({...formData, apkUrl: e.target.value})}
                />
               </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">App Description</label>
              <textarea 
                placeholder="Briefly describe what the app does..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-pink-400 focus:bg-black/60 transition-all text-sm min-h-[100px] resize-y"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">App Icon Layer</label>
              <ImageUploadInput 
                value={formData.icon} 
                onChange={(url) => setFormData({...formData, icon: url})} 
                label="Upload App Icon" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Features (comma separated)</label>
              <input 
                type="text" 
                placeholder="Push Notifications, Offline Sync..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-400 focus:bg-black/60 transition-all text-sm"
                value={formData.features}
                onChange={e => setFormData({...formData, features: e.target.value})}
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Status</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-pink-400 focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
             <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1 flex justify-between">
                <span>Changelog</span>
                <span className="text-[10px] text-white/30">Markdown supported</span>
              </label>
              <textarea 
                placeholder="- Added new features\n- Fixed bugs" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-pink-400 focus:bg-black/60 transition-all font-mono text-sm min-h-[100px] resize-y text-white/90"
                value={formData.changelog}
                onChange={e => setFormData({...formData, changelog: e.target.value})}
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Save Application
             </button>
          </div>
        </motion.form>
      )}

      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
           <h3 className="font-bold flex items-center gap-2"><Database className="w-4 h-4 text-pink-400" /> App Registry</h3>
           <div className="text-xs font-medium text-white/50">Total Apps: {apps.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 border-b border-white/5">
              <tr>
                <th className="p-4 px-6 font-semibold text-white/40 uppercase tracking-widest text-[10px]">App Details</th>
                <th className="p-4 font-semibold text-white/40 uppercase tracking-widest text-[10px]">Version</th>
                <th className="p-4 font-semibold text-white/40 uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-semibold text-white/40 uppercase tracking-widest text-[10px] w-32 text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/40 font-medium">Fetching apps...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/40 font-medium">No apps found. Add your first app above.</td></tr>
              ) : apps.map((app, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={app.id} 
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1">
                         {app.icon ? <img src={app.icon} className="w-full h-full object-cover rounded-lg" /> : <Smartphone className="w-5 h-5 text-white/20" />}
                       </div>
                       <div>
                         <p className="font-bold text-white group-hover:text-pink-400 transition-colors text-base">{app.title}</p>
                         <p className="text-[10px] text-white/40 font-mono mt-0.5">/{app.slug}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white/80">
                      {app.version || 'v1.0.0'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border 
                      ${app.status === 'published' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {app.apkUrl && (
                          <a href={app.apkUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg glass text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="View APK Link">
                            <Download className="w-4 h-4" />
                          </a>
                       )}
                       <button className="p-2 rounded-lg glass text-white/50 hover:text-white hover:bg-white/10 transition-all">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(app.id)} className="p-2 rounded-lg glass text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
