import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppSettings {
  clockInRequiresLocation: boolean;
  clockInRequiresPhoto: boolean;
  allowBreakExtensions: boolean;
  maxBreakDuration: number;
  requireManagerApproval: boolean;
  enableNotifications: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  timezone: string;
  country: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  clockInRequiresLocation: true,
  clockInRequiresPhoto: false,
  allowBreakExtensions: false,
  maxBreakDuration: 30,
  requireManagerApproval: true,
  enableNotifications: true,
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  timezone: 'UTC',
  country: 'US',
  currency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage or API
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('appSettings');
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;