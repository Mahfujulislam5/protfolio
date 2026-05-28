import { motion } from "motion/react";
import { Users, FolderGit2, Download, Eye, TrendingUp, Cpu, Server, Activity, BarChart3 } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-sm text-white/50">Welcome back to your control center.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/5 text-xs font-medium text-white/70">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Projects", value: "24", trend: "+12%", icon: FolderGit2, color: "text-blue-400" },
          { label: "Active Prompts", value: "148", trend: "+5%", icon: Cpu, color: "text-purple-400" },
          { label: "Total Visitors", value: "24.5k", trend: "+18%", icon: Users, color: "text-green-400" },
          { label: "Downloads", value: "1,240", trend: "+2%", icon: Download, color: "text-pink-400" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className={`w-16 h-16 ${stat.color}`} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className="p-3 rounded-2xl glass bg-white/5">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </span>
              </div>
              <div className="relative z-10">
                <span className="block text-3xl font-display font-bold mb-1">{stat.value}</span>
                <span className="text-sm font-medium text-white/50">{stat.label}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder for Analytics Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/5 min-h-[350px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Traffic Overview</h3>
            <select className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-white/30 border-2 border-dashed border-white/5 rounded-2xl">
            <BarChart3 className="w-8 h-8" />
            <p className="text-sm">Chart visualization loaded here (e.g. Recharts)</p>
          </div>
        </motion.div>

        {/* Server Status / Quick Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2"><Server className="w-5 h-5 text-accent" /> System Status</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Database Load</span>
                <span className="text-primary font-medium">24%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="w-[24%] bg-primary h-full rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Storage (Cloudinary / DB)</span>
                <span className="text-accent font-medium">68%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="w-[68%] bg-accent h-full rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">API Route Calls</span>
                <span className="text-green-400 font-medium">12%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="w-[12%] bg-green-400 h-full rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
             <span>Vercel Hosted</span>
             <span>Firebase Firestore</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
