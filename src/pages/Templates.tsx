import React from "react";
import { Link } from "react-router-dom";
import { Layers, ArrowRight } from "lucide-react";

export function Templates() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-32 bg-[#030014] text-center min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full glass bg-white/5 mx-auto flex items-center justify-center mb-8">
        <Layers className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Premium Templates</h1>
      <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12">Starter kits, UI components, and fully coded web templates are currently being synchronized with our repository network.</p>
      
      <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors">
        Browse Existing Projects <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
