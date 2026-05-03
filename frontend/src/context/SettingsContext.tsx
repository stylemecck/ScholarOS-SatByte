import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Settings {
  adsCode: string;
  announcement: string;
  adsterraSmartlink: string;
  adsterraSocialBar: string;
  adsterraNativeBanner: string;
  adsterraPopunder: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    adsCode: '',
    announcement: '',
    adsterraSmartlink: '',
    adsterraSocialBar: '',
    adsterraNativeBanner: '',
    adsterraPopunder: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
        setSettings({
          adsCode: response.data.adsCode || '',
          announcement: response.data.announcement || '',
          adsterraSmartlink: response.data.adsterraSmartlink || '',
          adsterraSocialBar: response.data.adsterraSocialBar || '',
          adsterraNativeBanner: response.data.adsterraNativeBanner || '',
          adsterraPopunder: response.data.adsterraPopunder || ''
        });
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
