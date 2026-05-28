import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

interface Settings {
  platformName: string;
  contactEmail: string;
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}

const defaultSettings: Settings = {
  platformName: "MH.dev",
  contactEmail: "mahfujul848@gmail.com",
  socials: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com"
  }
};

const SettingsContext = createContext<Settings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setSettings({
          platformName: (data.platformName === "Nexus AI Portfolio" ? "MH.dev" : data.platformName) || defaultSettings.platformName,
          contactEmail: data.contactEmail || defaultSettings.contactEmail,
          socials: {
            ...defaultSettings.socials,
            ...(data.socials || {})
          }
        });
      }
    });

    return () => unsub();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
