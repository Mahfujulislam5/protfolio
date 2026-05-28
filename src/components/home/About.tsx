import { motion } from "motion/react";
import { CheckCircle2, Award, Zap } from "lucide-react";

export function About() {
  return (
    <section className="py-32 container mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Image Collage */}
        <div className="relative h-[600px] hidden md:block">
          <motion.div 
            initial={{ opacity: 0, x: -30, rotate: -5 }}
            whileInView={{ opacity: 1, x: 0, rotate: -5 }}
            viewport={{ once: true }}
            className="absolute top-10 left-0 w-64 h-80 glass-card p-2 rounded-3xl z-10 shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop" 
              alt="Coding" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 5 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="absolute top-32 right-10 w-72 h-96 glass-card p-2 rounded-3xl z-20 shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1627398240309-089a14405527?q=80&w=2670&auto=format&fit=crop" 
              alt="Design" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-10 left-20 glass-card px-6 py-4 rounded-2xl z-30 flex items-center gap-4 backdrop-blur-3xl"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold">100%</p>
              <p className="text-sm text-white/50">Client Satisfaction</p>
            </div>
          </motion.div>

          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
        </div>

        {/* Right Side: Bio & Experience */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <div>
            <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">About Me</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Architecting Digital Visions into Reality
            </h3>
          </div>
          
          <div className="space-y-4 text-lg text-white/60 font-light leading-relaxed">
            <p>
              With over half a decade of experience bridging the gap between elegant design and robust engineering, I build digital platforms that scale and captivate.
            </p>
            <p>
              My expertise lies in integrating cutting-edge AI technologies into modern web and mobile applications, crafting tools that empower creators and businesses alike.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {[
              "Full-Stack Development",
              "AI Integration & Prompt Eng.",
              "UI/UX Design Systems",
              "Cloud Architecture (Firebase)",
            ].map(skill => (
              <div key={skill} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-white/80 font-medium">{skill}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 mt-4 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i+10}`} 
                  alt={`Client ${i}`} 
                  className="w-12 h-12 rounded-full border-2 border-background"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold flex items-center gap-1">4.9/5 <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /></span>
              <span className="text-sm text-white/50">From 50+ reviews</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
