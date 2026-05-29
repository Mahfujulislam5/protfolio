import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Send, Loader2, User, Image as ImageIcon, XCircle } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string | { type: string, text?: string, image_url?: { url: string } }[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Mahfujul Islam's powerful AI assistant. I can help you with text, code, or analyzing image requests. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-chatbot', handleToggle);
    return () => document.removeEventListener('toggle-chatbot', handleToggle);
  }, []);

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
      const localKey = localStorage.getItem("openrouter_key");
      if (localKey) {
        headers["x-openrouter-key"] = localKey.trim();
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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] text-white hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <Bot className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] max-w-[calc(100vw-48px)] glass-card border border-white/20 rounded-3xl flex flex-col overflow-hidden z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Mahfujul Islam AI</h3>
                  <p className="text-[10px] text-white/50">GPT-4o MultiModal</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'}`}>
                    {Array.isArray(msg.content) ? (
                      msg.content.map((part, idx) => {
                        if (part.type === 'text') return <div key={idx} className="markdown-body prose-invert text-sm"><Markdown>{part.text}</Markdown></div>;
                        if (part.type === 'image_url') return <img key={idx} src={part.image_url?.url} alt="upload" className="w-full rounded-lg mt-2 mb-2" />;
                        return null;
                      })
                    ) : (
                      <div className="markdown-body prose-invert !text-sm break-words">
                        <Markdown>{msg.content as string}</Markdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 text-white/90 rounded-tl-none border border-white/10 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs text-white/50">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/40 flex flex-col gap-2">
              {selectedImage && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 p-1 bg-black/50 hover:bg-black/80 rounded-bl-lg transition-colors">
                    <XCircle className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}
              <div className="relative flex items-center gap-2">
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
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors"
                  title="Upload Image"
                >
                  <ImageIcon className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !selectedImage)}
                  className="absolute right-2 p-1.5 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:hover:bg-primary text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
