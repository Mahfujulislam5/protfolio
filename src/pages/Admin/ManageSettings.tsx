import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Settings, ShieldCheck, Mail, Database, Github, Twitter, Linkedin, Save, Loader2, Key, Users } from "lucide-react";

export function ManageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States
  const [platformName, setPlatformName] = useState("Cinematic Portfolio");
  const [contactEmail, setContactEmail] = useState("mahfujul848@gmail.com");
  
  const [socials, setSocials] = useState({
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com"
  });

  const [geminiKey, setGeminiKey] = useState("");
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [adminEmailsStr, setAdminEmailsStr] = useState("mahfujul848@gmail.com");

  useEffect(() => {
    const unsubGlobal = onSnapshot(doc(db, "settings", "global"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.platformName) setPlatformName(data.platformName);
        if (data.contactEmail) setContactEmail(data.contactEmail);
        if (data.socials) setSocials(data.socials);
      }
    });

    const unsubApiKeys = onSnapshot(doc(db, "settings", "apikeys"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.geminiKey) setGeminiKey(data.geminiKey);
        if (data.openrouterKey) setOpenrouterKey(data.openrouterKey);
      }
    });

    const unsubAdmins = onSnapshot(doc(db, "settings", "admins"), (docSnapshot) => {
      if (docSnapshot.exists() && docSnapshot.data().emails) {
         setAdminEmailsStr(docSnapshot.data().emails.join(", "));
      }
      setLoading(false);
    });

    return () => {
      unsubGlobal();
      unsubApiKeys();
      unsubAdmins();
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "global"), {
        platformName,
        contactEmail,
        socials,
        updatedAt: Date.now()
      }, { merge: true });

      await setDoc(doc(db, "settings", "apikeys"), {
        geminiKey: geminiKey.trim(),
        openrouterKey: openrouterKey.trim(),
        updatedAt: Date.now()
      }, { merge: true });

      const emailList = adminEmailsStr.split(",").map(e => e.trim()).filter(e => e.length > 0);
      if (!emailList.includes("mahfujul848@gmail.com")) {
          emailList.push("mahfujul848@gmail.com");
      }
      
      await setDoc(doc(db, "settings", "admins"), {
        emails: emailList,
        updatedAt: Date.now()
      }, { merge: true });

      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/50 text-center py-10">Loading settings...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Global Site Config</h1>
          <p className="text-sm text-white/50">Manage platform-level variables and API keys.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Settings */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6"
          >
             <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /> Platform Defaults</h3>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">Platform Name</label>
                  <input type="text" value={platformName} onChange={e => setPlatformName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">Contact Email</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Mail className="w-4 h-4 text-white/30" />
                     </div>
                     <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                  </div>
                </div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6"
          >
             <h3 className="text-xl font-bold flex items-center gap-2"><Key className="w-5 h-5 text-orange-400" /> API Keys</h3>
             <p className="text-sm text-white/50">These keys are securely used by the backend to power the AI features.</p>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">Gemini API Key</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Key className="w-4 h-4 text-white/30" />
                     </div>
                     <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">OpenRouter API Key (For GPT models)</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Key className="w-4 h-4 text-white/30" />
                     </div>
                     <input type="password" value={openrouterKey} onChange={e => setOpenrouterKey(e.target.value)} placeholder="sk-or-v1-..." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                  </div>
                </div>
             </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6"
          >
             <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /> Social Links</h3>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">GitHub URL</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Github className="w-4 h-4 text-white/30" />
                     </div>
                     <input type="url" value={socials.github} onChange={e => setSocials({...socials, github: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">Twitter / X URL</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Twitter className="w-4 h-4 text-white/30" />
                     </div>
                     <input type="url" value={socials.twitter} onChange={e => setSocials({...socials, twitter: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">LinkedIn URL</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Linkedin className="w-4 h-4 text-white/30" />
                     </div>
                     <input type="url" value={socials.linkedin} onChange={e => setSocials({...socials, linkedin: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium text-sm" />
                  </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Access Control side */}
        <div className="space-y-8">
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full pointer-events-none"></div>
             <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-400" /> Admin Access</h3>
             
             <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-2">
                <p className="text-xs text-green-400 font-medium">Control who can log in to the admin panel. Only Gmail accounts listed here can access the dashboard. Separate multiple emails with commas. The master admin (mahfujul848@gmail.com) can never be removed.</p>
             </div>

             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 ml-1">Authorized Admin Emails (comma separated)</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                       <Users className="w-4 h-4 text-white/30" />
                     </div>
                     <textarea 
                       rows={4}
                       value={adminEmailsStr} 
                       onChange={e => setAdminEmailsStr(e.target.value)} 
                       placeholder="admin1@gmail.com, admin2@gmail.com" 
                       className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-3 pl-10 outline-none focus:border-green-400 focus:bg-black/60 transition-all font-mono text-sm leading-relaxed" 
                     />
                  </div>
                </div>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
