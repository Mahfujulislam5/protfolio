import { motion } from "motion/react";
import { ArrowUpRight, Github, ExternalLink, FolderGit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Link } from "react-router-dom";

export function FeaturedWork() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(
        collection(db, "projects"),
        where("status", "==", "published"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      setFeaturedProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  if (featuredProjects.length === 0) return null;

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Featured Work.</h2>
            <p className="text-white/60 max-w-xl text-lg">A selection of recent projects, from experimental AI tools to production-ready SaaS platforms.</p>
          </div>
          <Link to="/projects" className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium">
            View all projects <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex flex-col gap-24">
          {featuredProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col gap-8 md:gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
            >
              <div className="w-full md:w-3/5 group relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 bg-black/50">
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderGit2 className="w-16 h-16 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              </div>

              <div className="w-full md:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-primary text-sm font-mono tracking-wider">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="h-px bg-white/20 w-12"></div>
                  <span className="text-white/50 text-sm">{project.category || 'Portfolio'}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">{project.title}</h3>
                <p className="text-white/60 mb-8 leading-relaxed text-lg">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {project.tags && project.tags.map((tech: string, i: number) => (
                    <span key={i} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {project.liveDemo && (
                     <a href={project.liveDemo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors">
                       Live Demo <ExternalLink className="w-4 h-4" />
                     </a>
                  )}
                  {project.github && (
                     <a href={project.github} target="_blank" rel="noreferrer" className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                       <Github className="w-5 h-5" />
                     </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
