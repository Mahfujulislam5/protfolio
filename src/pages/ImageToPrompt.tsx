import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Upload, Loader2, Play, Copy, XCircle, Settings, Save } from "lucide-react";

export function ImageToPrompt() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_key") || "");

  const handleSaveSettings = () => {
    localStorage.setItem("gemini_key", apiKey.trim());
    setSettingsOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setSelectedImage(reader.result as string);
         setGeneratedPrompt("");
         setError("");
       };
       reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError("");
    setGeneratedPrompt("");

    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(':')[1].split(';')[0];
      
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey.trim()) {
        headers["x-gemini-key"] = apiKey.trim();
      }

      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          imagePart: {
            inlineData: { data: base64Data, mimeType }
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate prompt");
      
      setGeneratedPrompt(data.prompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-32 relative">
      <AnimatePresence>
        {settingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0f172a] border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setSettingsOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-500" /> API Settings
              </h2>
              <p className="text-sm text-white/50 mb-6">Connect your own Gemini API key to override the default application key.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Gemini API Key</label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                
                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <button 
          onClick={() => setSettingsOpen(true)}
          className="absolute top-0 right-0 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-teal-500/20">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Image to Prompt</h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Upload any image and instantly get a detailed AI prompt that describes its exact style, subjects, and attributes.
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
            <h2 className="text-xl font-bold">Upload Image</h2>
          </div>
          
          <div 
             className={`w-full h-64 border-2 border-dashed ${selectedImage ? 'border-teal-500/50 p-2' : 'border-white/20 p-8 hover:border-teal-500/50'} rounded-2xl flex flex-col items-center justify-center transition-all bg-black/40 relative group cursor-pointer overflow-hidden`}
             onClick={() => !selectedImage && fileInputRef.current?.click()}
          >
             <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
             
             {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setGeneratedPrompt("");
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 backdrop-blur rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <XCircle className="w-5 h-5 text-white" />
                  </button>
                </>
             ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-teal-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-white/70 font-medium">Click to upload image</p>
                  <p className="text-white/40 text-sm mt-2">Supports JPG, PNG, WEBP</p>
                </>
             )}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedImage}
            className="w-full mt-6 py-4 bg-white text-black font-bold flex items-center justify-center gap-2 rounded-xl group hover:bg-white/90 transition-all disabled:opacity-50 disabled:hover:bg-white"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform cursor-pointer" />}
            {loading ? "Analyzing Image..." : "Generate AI Prompt"}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2rem] p-6 md:p-8 border border-teal-500/20 relative overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none"></div>
          <div className="relative flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold">Extracted Prompt</h2>
              </div>
              <button 
                onClick={handleCopy}
                disabled={!generatedPrompt}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-white/70 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                {copied ? <span className="text-xs text-green-400">Copied!</span> : <Copy className="w-4 h-4 cursor-pointer" />}
              </button>
            </div>
            
            <div className="flex-1 min-h-[250px] bg-black/60 border border-white/10 rounded-xl p-6 overflow-y-auto text-white/90 leading-relaxed font-mono text-sm relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-4 p-4 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                  <p>Processing visual information... This might take a few seconds.</p>
                </div>
              ) : error ? (
                <div className="text-red-400 h-full flex items-center justify-center text-center">
                  {error}
                </div>
              ) : generatedPrompt ? (
                generatedPrompt
              ) : (
                <span className="text-white/30 h-full flex items-center justify-center text-center">
                  Upload an image and hit generate to see the extracted visual attributes, style, and subject details here.
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
