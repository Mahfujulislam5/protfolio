import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  LayoutDashboard, Home, Image as ImageIcon, Tags, FolderGit2, 
  MessageSquare, Wrench, Sparkles, Smartphone, PenTool, FileText, 
  Library, Megaphone, Search, Menu, LayoutPanelTop, 
  Palette, BarChart3, Settings, LogOut, X 
} from "lucide-react";

const sidebarNav = [
  { group: "Overview", items: [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 }
  ]},
  { group: "Content", items: [
    { name: "Projects", path: "/admin/projects", icon: FolderGit2 },
    { name: "AI Prompts", path: "/admin/prompts", icon: MessageSquare },
    { name: "Tools", path: "/admin/tools", icon: Wrench },
    { name: "Premium Tools", path: "/admin/premium-tools", icon: Sparkles },
    { name: "Apps", path: "/admin/apps", icon: Smartphone },
    { name: "Designs", path: "/admin/designs", icon: PenTool },
    { name: "Blog", path: "/admin/blog", icon: FileText },
    { name: "Media Library", path: "/admin/media", icon: Library },
  ]},
  { group: "Site Management", items: [
    { name: "Homepage", path: "/admin/homepage", icon: Home },
    { name: "Hero Banner", path: "/admin/hero", icon: ImageIcon },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Ads Manager", path: "/admin/ads", icon: Megaphone },
    { name: "SEO Settings", path: "/admin/seo", icon: Search },
    { name: "Navbar", path: "/admin/navbar", icon: Menu },
    { name: "Footer", path: "/admin/footer", icon: LayoutPanelTop },
    { name: "Appearance", path: "/admin/appearance", icon: Palette },
  ]},
  { group: "System", items: [
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ]}
];

export function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) return <div className="h-screen bg-[#030014] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold flex items-center gap-2 text-white">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs shadow-lg shadow-primary/20">M</div>
          Admin<span className="text-primary font-normal">Panel</span>
        </Link>
        <button className="p-1 rounded-md hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide w-full">
        {sidebarNav.map((section, sIdx) => (
          <div key={sIdx} className="mb-8 last:mb-0">
            <h3 className="px-3 text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
              {section.group}
            </h3>
            <nav className="flex flex-col gap-1 w-full">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 w-full">
        <div className="glass rounded-xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
             <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-8 h-8 rounded-full shrink-0" />
             <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-bold truncate">{user.displayName || 'Admin'}</span>
               <span className="text-[10px] text-white/40 truncate">{user.email}</span>
             </div>
          </div>
          <button onClick={() => signOut(auth)} className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-[#030014] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 w-full glass-card border-b border-white/5 z-20 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs shadow-lg shadow-primary/20">M</div>
           <span className="font-display font-bold text-lg">Admin<span className="text-primary font-normal">Panel</span></span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
           <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              className="w-3/4 max-w-sm h-full glass-card border-r border-white/5 flex flex-col bg-[#030014]"
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide pt-[72px]">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-full">
           <Outlet />
        </div>
      </main>
    </div>
  )
}
