import { motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function DesignGallery() {
  const [designs, setDesigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      const q = query(
        collection(db, "designs"),
        limit(6)
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDesigns(fetched);
    };
    fetchDesigns();
  }, []);

  if (designs.length === 0) return null;

  return (
    <section className="py-32 container mx-auto max-w-7xl px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Creative Vision</h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold">Design Gallery</h3>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {designs.map((design, idx) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
            className={`relative break-inside-avoid glass rounded-3xl overflow-hidden group w-full ${design.aspect || 'aspect-[4/5]'}`}
          >
            <img 
              src={design.imgUrl} 
              alt={design.title || "Design"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-2">
                <a href={design.imgUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 hover:bg-white/20">
                  <Maximize2 className="w-5 h-5" />
                </a>
                {design.title && (
                   <span className="text-white font-medium scale-0 group-hover:scale-100 transition-transform duration-500 delay-150">{design.title}</span>
                )}
              </div>
            </div>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
