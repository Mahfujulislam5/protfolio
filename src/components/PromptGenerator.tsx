import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";

export function PromptGenerator() {
  const [selections, setSelections] = useState({
    type: "Portrait",
    style: "Cinematic",
    mood: "Dark",
    lighting: "Neon",
  });
  
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<"builder" | "image">("builder");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleGenerateText = () => {
    // Generate a prompt strictly based on UI selections
    const output = `A high quality ${selections.style.toLowerCase()} ${selections.type.toLowerCase()} photography, capturing a ${selections.mood.toLowerCase()} mood. The scene is illuminated by ${selections.lighting.toLowerCase()} lighting, 8k resolution, highly detailed, vivid colors, depth of field.`;
    setGeneratedResult(output);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!imageFile || !selectedImage) return;

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = imageFile.type;

      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePart: {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setGeneratedResult(data.prompt);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate prompt from image.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if(generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const options = {
    type: ["Portrait", "Landscape", "Character Design", "Concept Art", "Product Render"],
    style: ["Cinematic", "Cyberpunk", "Anime", "Photorealistic", "Oil Painting"],
    mood: ["Dark", "Ethereal", "Aggressive", "Peaceful", "Melancholic"],
    lighting: ["Neon", "Studio", "Natural", "Volumetric", "Rim Lighting"]
  };

  return (
    <div className="glass rounded-3xl p-8 max-w-4xl mx-auto w-full mb-20 border border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-display font-bold">AI Prompt Generator</h2>
        
        <div className="flex bg-black/50 rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "builder" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
            onClick={() => { setMode("builder"); setGeneratedResult(null); }}
          >
            Builder Mode
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "image" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
            onClick={() => { setMode("image"); setGeneratedResult(null); }}
          >
            Image-to-Prompt
          </button>
        </div>
      </div>
      
      {mode === "builder" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {(Object.keys(options) as Array<keyof typeof options>).map(category => (
              <div key={category} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/50 capitalize">{category}</label>
                <select 
                  className="bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary w-full appearance-none"
                  value={selections[category]}
                  onChange={e => setSelections(s => ({ ...s, [category]: e.target.value }))}
                >
                  {options[category].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <button 
              onClick={handleGenerateText}
              className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Generate Prompt
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-md bg-black/40 border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors rounded-2xl relative overflow-hidden aspect-video flex flex-col items-center justify-center mb-6 text-center cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleImageUpload}
              disabled={isGenerating}
            />
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 bg-black/60 p-4 rounded-xl flex items-center gap-2 backdrop-blur-sm">
                  <ImageIcon className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium">Image Selected. Click to change.</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center p-6 text-white/50">
                <Upload className="w-10 h-10 mb-4 opacity-50" />
                <p className="font-medium text-white/80">Upload Photo</p>
                <p className="text-xs mt-2 text-white/40">Our AI will analyze the image and generate a creative prompt</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerateFromImage}
            disabled={!selectedImage || isGenerating}
            className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              "Generate Prompt from Image"
            )}
          </button>
        </div>
      )}

      {generatedResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/50 rounded-xl p-6 border border-white/10 flex flex-col gap-4"
        >
          <div className="font-mono text-sm text-white/80 leading-relaxed">
            {generatedResult}
          </div>
          <div className="flex justify-end">
             <button 
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
