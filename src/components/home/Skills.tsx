import { motion } from "motion/react";
import { Code2, Database, Layout } from "lucide-react";

export function Skills() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Technical Arsenal</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold">Skills & Technologies</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend Category */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-6">
              <Layout className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-2xl font-bold mb-6">Frontend Space</h4>
            
            <div className="space-y-6">
              {[
                { name: "React / Next.js", progress: 95 },
                { name: "Tailwind CSS", progress: 98 },
                { name: "Framer Motion", progress: 85 },
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-white/80">{skill.name}</span>
                    <span className="text-white/50 text-sm">{skill.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Backend Category */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mb-6">Backend & Auth</h4>
            
            <div className="space-y-6">
              {[
                { name: "Firebase Platform", progress: 90 },
                { name: "Node.js", progress: 80 },
                { name: "Cloudinary", progress: 85 },
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-white/80">{skill.name}</span>
                    <span className="text-white/50 text-sm">{skill.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI & More */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-6">
              <Code2 className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold mb-6">AI & Tools</h4>
            
            <div className="space-y-6">
              {[
                { name: "Prompt Engineering", progress: 95 },
                { name: "API Integration", progress: 90 },
                { name: "UI/UX Architecture", progress: 85 },
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-white/80">{skill.name}</span>
                    <span className="text-white/50 text-sm">{skill.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
