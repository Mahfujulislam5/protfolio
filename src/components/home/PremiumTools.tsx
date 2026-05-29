import { motion } from "motion/react";
import { ExternalLink, Sparkles, Image, MessageSquare, Wand2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PREMIUM_TOOLS = [
  {
    id: 1,
    title: "MIR GPT",
    shortTitle: "GPT",
    description: "Advanced AI chatbot powered by state-of-the-art language models like GPT-4o and Claude. Capable of coding, storytelling, and problem-solving.",
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
    url: "/gpt",
    spanClass: "col-span-1 md:col-span-6 lg:col-span-8"
  },
  {
    id: 2,
    title: "Prompt Maker",
    shortTitle: "Prompts",
    description: "Craft perfect, highly detailed prompts for midjourney and DALL-E.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20",
    url: "/prompt-maker",
    spanClass: "col-span-1 md:col-span-6 lg:col-span-4"
  },
  {
    id: 3,
    title: "Image to Prompt",
    shortTitle: "Img>Prompt",
    description: "Upload an image and instantly extract a detailed AI prompt.",
    icon: Image,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-teal-500/20",
    url: "/image-to-prompt",
    spanClass: "col-span-1 md:col-span-6 lg:col-span-4"
  },
  {
    id: 4,
    title: "Image Enhancer",
    shortTitle: "Enhancer",
    description: "Upscale, denoise, and enhance images using advanced neural networks without losing quality. Perfect for restoring old photos or upscaling AI art.",
    icon: Wand2,
    color: "from-orange-500 to-rose-500",
    shadow: "shadow-orange-500/20",
    url: "/image-editor",
    spanClass: "col-span-1 md:col-span-6 lg:col-span-8"
  }
];

export function PremiumTools() {
  return (
    <section className="py-32 relative">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[#030014]/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-primary hidden md:block"></span>
              Premium Collection
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">AI Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Tools</span></h3>
            <p className="text-white/60 text-lg mt-4 max-w-xl">
              Elevate your workflow with our suite of powerful, integrated AI applications designed for creators and developers.
            </p>
          </div>
          <Link to="/tools" className="flex items-center gap-2 text-white/70 hover:text-white transition-all group px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 bg-white/5 backdrop-blur-md">
            <span>Explore Library</span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {PREMIUM_TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            const isLarge = tool.spanClass.includes("col-span-8");
            
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${tool.spanClass} group relative h-[320px] md:h-[380px] rounded-[2.5rem] overflow-hidden`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Card content container */}
                <Link to={tool.url} className="absolute inset-0 p-[2px] rounded-[2.5rem] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 rounded-[2.5rem]"></div>
                  <div className="w-full h-full bg-[#0a0a0f] rounded-[calc(2.5rem-2px)] p-8 relative overflow-hidden flex flex-col justify-between border border-white/5">
                    
                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 -mr-20 -mt-20 w-64 h-64 opacity-[0.03] text-white">
                       <Icon className="w-full h-full" strokeWidth={1} />
                    </div>

                    <div className="relative z-10 flex justify-between items-start">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} p-0.5 shadow-lg ${tool.shadow}`}>
                        <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center">
                           <Icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br ${tool.color}`} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md group-hover:block transition-all">
                        <span className="text-xs font-medium text-white/70 uppercase tracking-widest">{tool.shortTitle}</span>
                      </div>
                    </div>

                    <div className="relative z-10 mt-auto">
                      <h4 className={`font-bold mb-3 ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{tool.title}</h4>
                      <p className={`text-white/50 leading-relaxed max-w-lg ${isLarge ? 'text-lg' : 'text-base line-clamp-3'}`}>
                        {tool.description}
                      </p>
                      
                      <div className="mt-8 flex items-center gap-2 text-primary font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Launch Application <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
