import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Plus, X, FileText, Trash2, Edit2, FilePlus, ExternalLink } from "lucide-react";
import { ImageUploadInput } from "../../components/admin/ImageUploadInput";

export function ManageBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "draft"
  });

  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "posts"), {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setIsAdding(false);
    setFormData({ title: "", slug: "", excerpt: "", content: "", coverImage: "", status: "draft" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this blog post?")) {
      await deleteDoc(doc(db, "posts", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Blog Content Manager</h1>
          <p className="text-sm text-white/50">Write, edit, and publish Markdown-based blog posts.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Article</>}
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6"
          onSubmit={handleCreate}
        >
          <h3 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" /> Article Editor</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Article Title</label>
              <input 
                type="text" 
                placeholder="e.g. The Future of AI Design" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">URL Slug</label>
              <input 
                type="text" 
                placeholder="the-future-of-ai-design" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm text-white/70"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1 mb-2 block">Cover Image</label>
              <ImageUploadInput 
                value={formData.coverImage} 
                onChange={(url) => setFormData({...formData, coverImage: url})} 
                label="Upload Cover Image" 
              />
            </div>

             <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-white/50 ml-1">Short Excerpt (Meta Description)</label>
              <textarea 
                placeholder="Brief summary of the article..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm h-20 resize-none"
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2 flex flex-col">
              <label className="text-xs font-medium text-white/50 ml-1 flex justify-between">
                <span>Markdown Content</span>
                <span className="text-[10px] text-purple-400 font-bold tracking-wider">M↓ SUPPORTED</span>
              </label>
              <textarea 
                placeholder="# Introduction\nWrite your blog post content here..." 
                className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-mono text-sm min-h-[300px] resize-y"
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 ml-1">Publish Status</label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-400 focus:bg-black/60 transition-all font-medium text-sm appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-6 border-t border-white/10">
             <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-colors">
               Save Article
             </button>
          </div>
        </motion.form>
      )}

      {/* Blog List Preview */}
      <div className="space-y-4">
        {loading ? (
            <div className="w-full py-12 text-center text-white/40 glass-card rounded-3xl border border-white/5">Loading articles...</div>
        ) : posts.length === 0 ? (
            <div className="w-full py-12 text-center text-white/40 glass-card rounded-3xl border border-white/5">No articles found. Start writing!</div>
        ) : posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col md:flex-row gap-6 glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group"
          >
             <div className="w-full md:w-48 h-32 rounded-xl bg-black/50 border border-white/10 overflow-hidden shrink-0">
               {post.coverImage ? (
                 <img src={post.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity blur-sm group-hover:blur-0" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white/20" />
                 </div>
               )}
             </div>
             
             <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-2">
                   <h3 className="font-bold text-xl line-clamp-1">{post.title || "Untitled Article"}</h3>
                   <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border mt-1 shrink-0
                      ${post.status === 'published' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}
                    `}>
                     {post.status}
                   </span>
                </div>
                <p className="text-sm text-white/50 line-clamp-2 mb-4 max-w-2xl">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-auto">
                   <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium">
                     <Edit2 className="w-3.5 h-3.5" /> Edit
                   </button>
                   <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs font-medium">
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                   <a href={`/blog/${post.slug}`} target="_blank" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium">
                     View <ExternalLink className="w-3 h-3" />
                   </a>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
