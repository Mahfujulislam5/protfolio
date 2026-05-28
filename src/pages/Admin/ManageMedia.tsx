import React, { useState } from "react";
import { motion } from "motion/react";
import { UploadCloud, Folder, File, Image as ImageIcon, Video, Search, Trash2, Filter } from "lucide-react";

export function ManageMedia() {
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for display purposes
  const mediaFiles = [
    { id: 1, type: "image", name: "hero-bg-2024.jpg", size: "2.4 MB", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
    { id: 2, type: "image", name: "cyberpunk-ui-v2.png", size: "1.1 MB", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, type: "video", name: "app-showcase-reel.mp4", size: "14.2 MB" },
    { id: 4, type: "document", name: "resume-2024.pdf", size: "450 KB" },
    { id: 5, type: "image", name: "logo-glass.png", size: "800 KB" },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold">Media Library</h1>
          <p className="text-sm text-white/50">Manage your synced assets across Cloudinary and Firebase Storage.</p>
        </div>
        <button 
          onClick={() => setIsUploading(!isUploading)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20"
        >
          {isUploading ? "Cancel Upload" : <><UploadCloud className="w-4 h-4" /> Upload Files</>}
        </button>
      </div>

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-12 border border-white/20 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 bg-white/[0.02] shrink-0"
        >
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/50 mb-2">
             <UploadCloud className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-bold">Drag & Drop files here</h3>
           <p className="text-sm text-white/40 max-w-md mx-auto">Supports JPG, PNG, GIF, MP4, and PDF up to 50MB. Files are automatically compressed and deployed to CDN.</p>
           <button className="mt-4 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors">
              Browse Files
           </button>
        </motion.div>
      )}

      {/* Library Interface */}
      <div className="flex-1 glass-card rounded-[2rem] border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
         {/* Toolbar */}
         <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between bg-black/20 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
               <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium whitespace-nowrap">All Media</button>
               <button className="px-4 py-2 rounded-lg text-white/50 hover:bg-white/5 text-sm font-medium whitespace-nowrap">Images</button>
               <button className="px-4 py-2 rounded-lg text-white/50 hover:bg-white/5 text-sm font-medium whitespace-nowrap">Videos</button>
               <button className="px-4 py-2 rounded-lg text-white/50 hover:bg-white/5 text-sm font-medium whitespace-nowrap">Documents</button>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                 <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input type="text" placeholder="Search files..." className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm w-48 focus:w-64 transition-all outline-none focus:border-white/30" />
               </div>
               <button className="p-2 rounded-lg glass text-white/50 hover:text-white"><Filter className="w-4 h-4" /></button>
            </div>
         </div>

         {/* Grid */}
         <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
               {/* Folders */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                 <Folder className="w-8 h-8 text-blue-400 fill-blue-400/20" />
                 <div><p className="font-bold text-sm">Projects</p><p className="text-[10px] text-white/40">12 items</p></div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                 <Folder className="w-8 h-8 text-orange-400 fill-orange-400/20" />
                 <div><p className="font-bold text-sm">Blog Assets</p><p className="text-[10px] text-white/40">45 items</p></div>
               </div>

               {/* Files */}
               {mediaFiles.map(file => (
                 <div key={file.id} className="group relative aspect-square glass-card rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-all cursor-pointer">
                    {file.type === 'image' && file.url ? (
                      <img src={file.url} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/40">
                         {file.type === 'video' ? <Video className="w-8 h-8 text-white/20" /> : <File className="w-8 h-8 text-white/20" />}
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                       <p className="text-xs font-bold truncate">{file.name}</p>
                       <div className="flex items-center justify-between mt-1">
                         <span className="text-[10px] text-white/60 uppercase">{file.size}</span>
                         <button className="text-red-400/80 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                       </div>
                    </div>

                    {/* Icon Badge */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                       {file.type === 'image' && <ImageIcon className="w-3 h-3 text-blue-400" />}
                       {file.type === 'video' && <Video className="w-3 h-3 text-purple-400" />}
                       {file.type === 'document' && <File className="w-3 h-3 text-green-400" />}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}
