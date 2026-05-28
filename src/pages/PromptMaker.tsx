import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Copy, Loader2, Play } from "lucide-react";

export function PromptMaker() {
  const [simplePrompt, setSimplePrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleEnhance = async () => {
    if (!simplePrompt.trim()) return;
    setLoading(true);
    setError("");
    setEnhancedPrompt("");

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: simplePrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate prompt");
      
      setEnhancedPrompt(data.enhancedPrompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!enhancedPrompt) return;
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Ultra Prompt Maker</h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Type a simple idea, and our AI will transform it into a highly detailed, cinematic prompt for Midjourney, Stable Diffusion, or DALL-E.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-6 md:p-8 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-sm font-bold text-white/50">1</span>
            </div>
            <h2 className="text-xl font-bold">Your Idea</h2>
          </div>
          <textarea
            value={simplePrompt}
            onChange={(e) => setSimplePrompt(e.target.value)}
            disabled={loading}
            placeholder="e.g. A cat drinking coffee on the moon..."
            className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-primary focus:bg-black/60 transition-all resize-none placeholder:text-white/30 text-white disabled:opacity-50"
          ></textarea>
          <button
            onClick={handleEnhance}
            disabled={loading || !simplePrompt.trim()}
            className="w-full mt-4 py-4 bg-white text-black font-bold flex items-center justify-center gap-2 rounded-xl group hover:bg-white/90 transition-all disabled:opacity-50 disabled:hover:bg-white"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            {loading ? "Enhancing..." : "Generate Magic"}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2rem] p-6 md:p-8 border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold">Ultra Prompt</h2>
              </div>
              <button 
                onClick={handleCopy}
                disabled={!enhancedPrompt}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-white/70 hover:text-white flex items-center gap-2"
              >
                {copied ? <span className="text-xs text-green-400">Copied!</span> : <Copy className="w-4 h-4 cursor-pointer" />}
              </button>
            </div>
            
            <div className="w-full h-48 bg-black/60 border border-white/10 rounded-xl p-4 overflow-y-auto text-white/90 leading-relaxed font-mono text-sm">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p>Crafting cinematic details...</p>
                </div>
              ) : error ? (
                <div className="text-red-400 h-full flex items-center justify-center text-center p-4">
                  {error}
                </div>
              ) : enhancedPrompt ? (
                enhancedPrompt
              ) : (
                <span className="text-white/30 h-full flex items-center justify-center text-center">
                  Your ultra-detailed prompt will appear here...
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
