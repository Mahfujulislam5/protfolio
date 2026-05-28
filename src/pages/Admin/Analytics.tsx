import React from "react";
import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function Analytics() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics System</h1>
          <p className="text-sm text-white/50">Comprehensive platform metrics and traffic analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Views", value: "45,231", icon: Eye, color: "text-blue-400" },
          { title: "Unique Visitors", value: "12,402", icon: Users, color: "text-purple-400" },
          { title: "Avg. Session", value: "3m 42s", icon: TrendingUp, color: "text-green-400" },
          { title: "Bounce Rate", value: "42.3%", icon: BarChart3, color: "text-orange-400" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:scale-150 transition-transform duration-700 pointer-events-none ${stat.color} fill-current`}><Icon className="w-full h-full" /></div>
              <div className="flex items-center gap-3 mb-4"><div className="p-2 rounded-xl bg-white/5"><Icon className={`w-5 h-5 ${stat.color}`} /></div><h3 className="font-medium text-sm text-white/50">{stat.title}</h3></div>
              <p className="text-3xl font-bold font-display">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 p-8 h-96 flex flex-col items-center justify-center relative overflow-hidden">
        <BarChart3 className="w-16 h-16 text-white/10 mb-4" />
        <h3 className="text-xl font-bold mb-2">Live Traffic Chart</h3>
        <p className="text-white/40 max-w-sm text-center text-sm">Detailed charts and graphs will populate here once enough session data is collected.</p>
      </div>
    </div>
  )
}
