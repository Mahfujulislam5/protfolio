import { motion } from "motion/react";
import { Monitor, Smartphone, Sparkles, Image as ImageIcon, MessageSquare, PenTool, LayoutTemplate } from "lucide-react";

const categories = [
  { name: "Websites", icon: Monitor, color: "from-blue-500 to-cyan-400" },
  { name: "Android Apps", icon: Smartphone, color: "from-emerald-500 to-teal-400" },
  { name: "AI Tools", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { name: "Posters", icon: ImageIcon, color: "from-orange-500 to-amber-400" },
  { name: "Prompts", icon: MessageSquare, color: "from-rose-500 to-red-400" },
  { name: "UI Design", icon: PenTool, color: "from-indigo-500 to-blue-500" },
  { name: "Templates", icon: LayoutTemplate, color: "from-slate-500 to-gray-400" },
];

export function Categories() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Explore By Category</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold">Discover Content</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <a href={`/category/${cat.name.toLowerCase().replace(' ', '-')}`} className="group relative block">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl`}></div>
                  <div className="relative flex flex-col items-center justify-center p-6 md:p-8 w-32 md:w-40 h-32 md:h-40 glass-card rounded-3xl border border-white/5 group-hover:border-white/20 transition-all duration-300 group-hover:-translate-y-2">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${cat.color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center">{cat.name}</span>
                  </div>
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
