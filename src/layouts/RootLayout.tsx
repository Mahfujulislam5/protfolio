import { Link, Outlet } from "react-router-dom";
import { Github, Twitter, Linkedin, ArrowUp, Bot } from "lucide-react";
import { useSettings } from "../lib/SettingsContext";
import { Chatbot } from "../components/Chatbot";

export function RootLayout() {
  const settings = useSettings();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030014] text-foreground selection:bg-primary/30 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-500/5 rounded-full blur-[200px] animate-[spin_30s_linear_infinite]" />
        {/* Subtle grid layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <header className="fixed top-0 w-full z-50 glass-card border-b border-white/5 backdrop-blur-2xl">
        <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              M
            </div>
            MH<span className="text-primary">.dev</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white/60">
            <Link to="/projects" className="hover:text-white transition-colors hover:scale-105">Projects</Link>
            <Link to="/prompts" className="hover:text-white transition-colors hover:scale-105">Prompts</Link>
            <Link to="/tools" className="hover:text-white transition-colors hover:scale-105">Tools</Link>
            <Link to="/categories" className="hover:text-white transition-colors hover:scale-105">Categories</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
               onClick={() => document.dispatchEvent(new CustomEvent('toggle-chatbot'))}
               className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-white/10 hover:bg-white/10 hover:text-primary transition-colors text-sm font-medium"
            >
              <Bot className="w-4 h-4" /> AI Assistant
            </button>
            <a href={`mailto:${settings.contactEmail}`} className="hidden md:flex px-6 py-2.5 rounded-full glass border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
              Hire Me
            </a>
            {/* Mobile menu toggle could go here */}
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full overflow-hidden">
        <Outlet />
      </main>
      
      <footer className="relative pt-24 pb-8 overflow-hidden border-t border-white/5 mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div className="flex flex-col gap-6">
              <Link to="/" className="text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  M
                </div>
                MH<span className="text-primary">.dev</span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Crafting cinematic web experiences and advanced AI tools for modern creators.
              </p>
              <div className="flex items-center gap-4">
                <a href={settings.socials.github} target="_blank" rel="noreferrer" className="p-2.5 glass rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"><Github className="w-4 h-4" /></a>
                <a href={settings.socials.twitter} target="_blank" rel="noreferrer" className="p-2.5 glass rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="p-2.5 glass rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-semibold text-lg text-white">Quick Links</h4>
              <nav className="flex flex-col gap-3 text-sm text-white/50">
                <Link to="/projects" className="hover:text-primary transition-colors w-fit">Featured Work</Link>
                <Link to="/prompts" className="hover:text-primary transition-colors w-fit">Prompt Library</Link>
                <Link to="/tools" className="hover:text-primary transition-colors w-fit">AI Tools</Link>
                <Link to="/about" className="hover:text-primary transition-colors w-fit">About Me</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-semibold text-lg text-white">Resources</h4>
              <nav className="flex flex-col gap-3 text-sm text-white/50">
                <Link to="/blog" className="hover:text-primary transition-colors w-fit">Articles</Link>
                <Link to="/templates" className="hover:text-primary transition-colors w-fit">Templates</Link>
                <Link to="/designs" className="hover:text-primary transition-colors w-fit">Design Assets</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-semibold text-lg text-white">Newsletter</h4>
              <p className="text-white/50 text-sm">Get the latest updates on AI tools and web development.</p>
              <form className="flex" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="bg-black/50 border border-white/10 border-r-0 rounded-l-xl px-4 py-3 outline-none focus:border-primary text-sm w-full" />
                <button className="bg-primary hover:bg-primary-dark transition-colors px-4 py-3 rounded-r-xl text-sm font-medium">Subscribe</button>
              </form>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} {settings.platformName}. All Rights Reserved.</p>
            <button onClick={scrollToTop} className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors">
              Back to Top <ArrowUp className="w-4 h-4 p-0.5 rounded-full bg-white/10" />
            </button>
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  )
}
