import { motion } from "motion/react";
import { Copy, Sparkles, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function FeaturedPrompts() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      const q = query(
        collection(db, "prompts"),
        where("featured", "==", true),
        limit(2)
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrompts(fetched);
    };
    fetchPrompts();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (prompts.length === 0) return null;

  return (
    <section className="py-24 container mx-auto max-w-7xl px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">AI Arsenal</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold">Featured Prompts</h3>
        </motion.div>
        
        <motion.a 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          href="/prompts" 
          className="px-6 py-3 glass rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          Explore Library
        </motion.a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {prompts.map((prompt, idx) => {
          return (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card rounded-[2rem] p-8 border border-white/5 transition-colors duration-300 relative overflow-hidden group hover:border-purple-500/50`}
            >
              {/* Dynamic Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl glass bg-white/5">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{prompt.title}</h4>
                      <p className="text-xs font-medium text-white/50">{prompt.categories?.[0] || "AI Prompt"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 mb-6 font-mono text-sm text-white/80 leading-relaxed border border-white/5 flex-grow">
                  {prompt.text}
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-2">
                     {(prompt.categories || []).map((c: string) => (
                        <span key={c} className="px-2 py-1 bg-white/5 text-xs rounded-md text-white/50 border border-white/5">{c}</span>
                      ))}
                  </div>
                  <button 
                    onClick={() => handleCopy(prompt.id, prompt.text)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copiedId === prompt.id ? 'bg-green-500/20 text-green-400' : 'glass hover:bg-white/10 text-white'}`}
                  >
                    {copiedId === prompt.id ? <><CheckCircle2 className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Prompt</>}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  );
}
