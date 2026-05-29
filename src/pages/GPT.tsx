import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, User, Send, Loader2, Image as ImageIcon, XCircle, Download, Copy, Check, Settings, Save } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string | { type: string, text?: string, image_url?: { url: string } }[];
}

export function GPT() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am Mahfujul Islam's GPT assistant. How can I help you today? I can answer questions, write code, or analyze images." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openrouter_key") || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("openrouter_key", apiKey.trim());
    setSettingsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage && !isLoading) return;

    let userMessage: Message;
    if (selectedImage) {
      userMessage = {
        role: "user",
        content: [
          { type: "text", text: input || "What is in this image?" },
          { type: "image_url", image_url: { url: selectedImage } }
        ]
      };
    } else {
      userMessage = { role: "user", content: input };
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey.trim()) {
        headers["x-openrouter-key"] = apiKey.trim();
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
         try {
           const data = await response.json();
           throw new Error(data.error || "Failed to get response");
         } catch(e) {
           throw new Error("Failed to get response");
         }
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      setIsLoading(false);

      if (reader) {
        let accumulatedText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value, { stream: true });
          
          const lines = chunkStr.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && !line.includes("[DONE]")) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.choices?.[0]?.delta?.content) {
                  accumulatedText += parsed.choices[0].delta.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: accumulatedText
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: `Sorry, I encountered an error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-20 pb-4 flex flex-col h-[100dvh]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 shrink-0 px-4"
      >
        <div className="w-10 h-10 invisible"></div> {/* Spacer for centering */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold">Mahfujul GPT</h1>
        </div>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-white/70" />
        </button>
      </motion.div>

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
                <Settings className="w-5 h-5 text-primary" /> API Settings
              </h2>
              <p className="text-sm text-white/50 mb-6">Connect your own OpenRouter API key to override the default application key.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">OpenRouter API Key</label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-or-..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                
                <button 
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 glass-card rounded-3xl border border-white/10 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-gradient-to-br from-primary to-accent text-white'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-5 rounded-3xl text-sm leading-relaxed relative group ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20' : 'bg-black/40 text-white/90 rounded-tl-none border border-white/10'}`}>
                
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => handleCopy(typeof msg.content === 'string' ? msg.content : "Media content", i)} 
                    className="absolute top-2 right-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedIndex === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                  </button>
                )}

                {Array.isArray(msg.content) ? (
                  msg.content.map((part, idx) => {
                    if (part.type === 'text') return <div key={idx} className="markdown-body prose-invert max-w-none text-base"><Markdown>{part.text}</Markdown></div>;
                    if (part.type === 'image_url') return <img key={idx} src={part.image_url?.url} alt="upload" className="max-w-[300px] rounded-xl mt-3 mb-3 border border-white/10 shadow-lg object-contain bg-black/50 p-1" />;
                    return null;
                  })
                ) : (
                  <div className="markdown-body prose-invert !text-base max-w-none break-words">
                    <Markdown>{msg.content as string}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl mx-auto flex-row">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-5 rounded-3xl bg-black/40 text-white/90 rounded-tl-none border border-white/10 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-white/50 animate-pulse">Computing response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-3">
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black p-1"
                >
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 p-1.5 bg-black/60 hover:bg-black/90 backdrop-blur rounded-full transition-colors">
                    <XCircle className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative flex items-end gap-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all shadow-lg shrink-0"
                title="Upload Image"
              >
                <ImageIcon className="w-6 h-6 text-white/70 hover:text-white" />
              </button>
              
              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask Mahfujul GPT anything... (Shift+Enter for new line)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-16 text-base outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder:text-white/30 resize-none min-h-[60px] max-h-[200px] shadow-lg"
                  rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 6) : 1}
                />
                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="absolute right-2 bottom-2 p-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 text-white rounded-xl transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
