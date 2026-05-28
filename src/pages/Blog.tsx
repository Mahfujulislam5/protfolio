import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "posts")), (snapshot) => {
      const allPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(allPosts.filter(p => p.status === 'published'));
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-32 bg-[#030014]">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Editorial & Insights</h1>
        <p className="text-white/50 text-lg max-w-2xl">Thoughts, tutorials, and deep dives into AI, development, and design.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="h-80 glass-card rounded-3xl animate-pulse"></div>
            ))
        ) : posts.length === 0 ? (
           <div className="col-span-full py-24 text-center text-white/40 glass-card rounded-[2rem] border border-white/5">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No published articles found.</p>
           </div>
        ) : posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-[2rem] border border-white/5 overflow-hidden flex flex-col hover:border-purple-500/30 transition-colors"
          >
             <div className="aspect-[16/10] bg-black/50 overflow-hidden relative border-b border-white/5">
               {post.coverImage ? (
                 <img src={post.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <FileText className="w-10 h-10 text-white/20" />
                 </div>
               )}
               <div className="absolute top-4 left-4 flex gap-2">
                 <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-purple-400">Article</span>
               </div>
             </div>
             
             <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-white/40 font-medium mb-4">
                   <Calendar className="w-3.5 h-3.5" />
                   <span>{post.createdAt?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Recent'}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
                <p className="text-sm text-white/50 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                
                <Link to={`/blog/${post.slug}`} className="mt-auto flex items-center gap-2 text-sm font-bold text-white hover:text-purple-400 transition-colors w-fit">
                   Read Article <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
