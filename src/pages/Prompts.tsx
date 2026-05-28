import { useState, useEffect } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { PromptGenerator } from "../components/PromptGenerator";

export function Prompts() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "prompts"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPrompts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Prompt Library</h1>
        <p className="text-white/50 text-lg">A curated collection of advanced AI prompts for various use cases.</p>
      </div>

      <PromptGenerator />

      <h2 className="text-2xl font-display font-bold mb-8">Featured Prompts</h2>

      {loading ? (
        <div className="text-center py-20 text-white/50">Loading prompts...</div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-20 text-white/50">No prompts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prompts.map((p, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={p.id} 
              className="glass rounded-3xl p-6 group hover:border-white/20 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-display">{p.title}</h3>
                {p.featured && <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">Featured</span>}
              </div>
              <div className="bg-black/50 rounded-xl p-4 mb-6 font-mono text-sm text-white/70 overflow-x-auto whitespace-pre-wrap flex-1">
                {p.text}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  {(p.categories || []).map((c: string) => (
                    <span key={c} className="px-2 py-1 glass text-xs rounded-md text-white/50">{c}</span>
                  ))}
                </div>
                <button 
                  onClick={() => handleCopy(p.id, p.text)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copiedId === p.id ? 'bg-green-500/20 text-green-400' : 'glass hover:bg-white/10'}`}
                >
                  {copiedId === p.id ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
