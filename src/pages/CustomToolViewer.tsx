import React, { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { Loader2, ArrowLeft } from "lucide-react";

export function CustomToolViewer() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTool() {
      if (!id) return;
      try {
        const docRef = doc(db, "premiumTools", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTool({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTool();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!tool || (!tool.htmlCode && !tool.url)) {
    return <Navigate to="/tools" replace />;
  }

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="flex-none p-4 flex items-center gap-4 relative z-20">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white px-4 py-2 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex-1"></div>
        <h1 className="text-sm font-bold text-white/70 uppercase tracking-widest">{tool.title}</h1>
      </div>

      <div className="flex-1 w-full bg-white relative z-10">
        {tool.htmlCode ? (
          <iframe 
            srcDoc={tool.htmlCode} 
            className="w-full h-full border-none"
            title={tool.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <iframe 
            src={tool.url}
            className="w-full h-full border-none bg-white"
            title={tool.title}
          />
        )}
      </div>
    </div>
  );
}
