import React, { useState, useEffect } from "react";
import { Megaphone, Save, PieChart, Loader2, Code2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function AdsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoAdsEnabled: true,
    inFeedAdsEnabled: false,
    publisherId: "ca-pub-XXXXXXXXXXXXXXXX",
    adSlotId: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "ads");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "ads"), settings);
      alert("Ads configuration saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save ads configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white/50">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Monetization Engine</h1>
          <p className="text-sm text-white/50">Manage AdSense keys, custom placements, and revenue tracking.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Code2 className="w-5 h-5 text-blue-400" /> AdSense Credentials</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Google AdSense Publisher ID</label>
              <input type="text" name="publisherId" value={settings.publisherId} onChange={handleChange} placeholder="ca-pub-..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-green-400 mt-1 font-mono text-sm" />
              <p className="text-[10px] text-white/40 ml-1 mt-1">Found in your Google AdSense account settings.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 ml-1">Primary Ad Slot ID (for manual placement)</label>
              <input type="text" name="adSlotId" value={settings.adSlotId} onChange={handleChange} placeholder="e.g. 1234567890" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-green-400 mt-1 font-mono text-sm" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/5 p-8">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Megaphone className="w-5 h-5 text-green-400" /> Ad Placements</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between bg-black/40 p-4 border border-white/10 rounded-xl">
               <div>
                 <p className="font-bold text-sm">Google AdSense Auto-Ads</p>
                 <p className="text-xs text-white/50">Let Google place ads automatically on page.</p>
               </div>
               <input type="checkbox" name="autoAdsEnabled" checked={settings.autoAdsEnabled} onChange={handleChange} className="w-5 h-5 accent-green-500" />
             </div>
             
             <div className="flex items-center justify-between bg-black/40 p-4 border border-white/10 rounded-xl">
               <div>
                 <p className="font-bold text-sm">In-feed Prompts Ads</p>
                 <p className="text-xs text-white/50">Custom ad slots between prompt cards.</p>
               </div>
               <input type="checkbox" name="inFeedAdsEnabled" checked={settings.inFeedAdsEnabled} onChange={handleChange} className="w-5 h-5 accent-green-500" />
             </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 p-8 text-center text-white/40">
        <PieChart className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No revenue data collected for current billing cycle.</p>
      </div>
    </div>
  )
}
