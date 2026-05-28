import React from "react";
import { motion } from "motion/react";
import { Github, Twitter, Linkedin, Mail, Code2, Cpu, Palette } from "lucide-react";
import { useSettings } from "../lib/SettingsContext";

export function About() {
  const settings = useSettings();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-32 bg-[#030014]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">System Architect & <span className="text-primary">Designer</span>.</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            I build cinematic digital experiences and scalable AI ecosystems. Bridging the gap between high-end visual design and rigorous technical architecture, I create tools that empower modern creators.
          </p>
          <div className="flex items-center gap-4 pt-4">
             <a href={`mailto:${settings.contactEmail}`} className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors">Start a Project</a>
             <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-6">
                <a href={settings.socials.github} target="_blank" rel="noreferrer" className="p-2 text-white/50 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                <a href={settings.socials.twitter} target="_blank" rel="noreferrer" className="p-2 text-white/50 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="p-2 text-white/50 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
             </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="relative aspect-square md:aspect-[4/3] lg:aspect-square">
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] blur-3xl mix-blend-screen"></div>
           <div className="absolute inset-0 glass-card rounded-[3rem] border border-white/10 overflow-hidden">
             {/* Placeholder for Profile Cinematic Image */}
             <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center text-white/10">
                <Code2 className="w-24 h-24 mb-4 opacity-20" />
                <span className="font-mono text-sm tracking-widest font-bold">PROFILE_IMAGE_MISSING</span>
             </div>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Code2, title: "Web Engineering", color: "text-blue-400", desc: "React, Next.js, and complex full-stack ecosystems." },
          { icon: Palette, title: "Cinematic UI/UX", color: "text-pink-400", desc: "Premium, animated, and highly polished visual interfaces." },
          { icon: Cpu, title: "AI Integration", color: "text-purple-400", desc: "LLMs, Prompt Engineering, and AI application tools." },
        ].map((skill, idx) => {
           const Icon = skill.icon;
           return (
             <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }} className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                 <Icon className={`w-6 h-6 ${skill.color}`} />
               </div>
               <h3 className="text-xl font-bold mb-3">{skill.title}</h3>
               <p className="text-white/50 text-sm leading-relaxed">{skill.desc}</p>
             </motion.div>
           )
        })}
      </div>
    </div>
  )
}
