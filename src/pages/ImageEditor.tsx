import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImagePlus, Wand2, Loader2, Download, Eraser, Settings, Save, XCircle } from "lucide-react";

export function ImageEditor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
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
        setResultImage(null); // Reset result when new image uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;
    setLoading(true);
    setError("");

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey.trim()) {
        headers["x-gemini-key"] = apiKey.trim();
      }

      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          image: selectedImage,
          prompt: prompt
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to edit image");
      
      setResultImage(data.imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResultImage(null);
    setPrompt("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = '';
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
                <Settings className="w-5 h-5 text-orange-400" /> API Settings
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all"
                  />
                </div>
                
                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
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

        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-pink-500/20">
          <Wand2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">AI Magic Editor</h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Upload any photo and describe how you want to change it. Our AI will magically edit your image.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-6 border border-white/10 flex flex-col gap-6"
        >
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
              Source Image
            </h2>
            
            <div 
              className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${selectedImage ? 'border-primary/50' : 'border-white/20'} bg-black/40 flex items-center justify-center overflow-hidden relative group cursor-pointer transition-colors hover:border-primary/50`}
              onClick={() => !selectedImage && fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Source" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur text-sm font-medium transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-white/50 flex flex-col items-center gap-3">
                  <ImagePlus className="w-10 h-10 text-white/30" />
                  <p>Click to upload a photo</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
              Edit Prompt
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading || !selectedImage}
              placeholder="e.g. Turn him into a cyberpunk character, change the background to a neon city..."
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-primary focus:bg-black/60 transition-all resize-none placeholder:text-white/30 text-white disabled:opacity-50"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              disabled={loading || !selectedImage || !prompt.trim()}
              className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold flex items-center justify-center gap-2 rounded-xl group hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {loading ? "Generating Magic..." : "Edit Image"}
            </button>
            <button
              onClick={handleClear}
              disabled={loading || (!selectedImage && !prompt)}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all disabled:opacity-50 text-white/70 hover:text-white"
              title="Clear everything"
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Right Column - Result */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2rem] p-6 border border-primary/20 relative overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent"></div>
          
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between relative z-10">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</span>
              Result
            </span>
            {resultImage && (
              <a 
                href={resultImage}
                download="ai-edited-image.png"
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            )}
          </h2>

          <div className="flex-1 w-full min-h-[300px] rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden flex items-center justify-center z-10">
            {loading ? (
              <div className="flex flex-col items-center gap-4 text-white/50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Applying AI magic...</p>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2 animate-pulse rounded-full"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-400 p-6 text-center">
                <p className="font-bold mb-2">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : resultImage ? (
              <img src={resultImage} alt="Edited Result" className="w-full h-full object-contain" />
            ) : (
              <span className="text-white/30 text-center p-6">
                Your edited masterpiece will appear here...
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
