import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, onSnapshot, Timestamp, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { PresenceLog, PresenceSettings, EmployeePresenceConfig } from '../types/presence';

interface PresenceContextType {
  presenceSettings: PresenceSettings;
  updatePresenceSettings: (settings: PresenceSettings) => void;
  employeeConfigs: EmployeePresenceConfig[];
  updateEmployeeConfig: (config: EmployeePresenceConfig) => void;
  presenceLogs: PresenceLog[];
  clockIn: (employeeId: string, method?: string, location?: string) => Promise<void>;
  clockOut: (employeeId: string) => Promise<void>;
  getCurrentPresence: (employeeId: string) => PresenceLog | null;
  isEmployeePresenceEnabled: (employeeId: string) => boolean;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

// Mock data
const mockPresenceSettings: PresenceSettings = {
  enabled: true,
  reminderTime: '09:00',
  remindClockOut: true,
  allowGeoLocation: false,
  defaultMethod: 'manual'
};

const mockEmployeeConfigs: EmployeePresenceConfig[] = [
  { employeeId: '1', requireClockInOut: true, enabled: true },
  { employeeId: '2', requireClockInOut: true, enabled: true },
  { employeeId: '3', requireClockInOut: false, enabled: false }
];

const mockPresenceLogs: PresenceLog[] = [
  {
    id: '1',
    employeeId: '1',
    clockInTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    totalMinutes: 0,
    method: 'manual',
    location: 'Office',
    shiftId: null
  }
];

// Helper function to get current location
const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [presenceSettings, setPresenceSettings] = useState<PresenceSettings>(mockPresenceSettings);
  const [employeeConfigs, setEmployeeConfigs] = useState<EmployeePresenceConfig[]>(mockEmployeeConfigs);
  const [presenceLogs, setPresenceLogs] = useState<PresenceLog[]>([]);

  // Check if user is a mock user (demo/test user)
  const isMockUser = (user: any) => {
    if (!user) return false;
    const mockEmails = ['admin@shiftgy.com', 'manager@shiftgy.com', 'employee@shiftgy.com', 'super@shiftgy.com'];
    return mockEmails.includes(user.email) || user.email?.includes('mock') || user.email?.includes('demo');
  };

  useEffect(() => {
    // Don't attempt Firestore operations for mock users or when offline
    if (!user || isMockUser(user)) {
      // Use mock data for demo users
      setPresenceSettings(mockPresenceSettings);
      setEmployeeConfigs(mockEmployeeConfigs);
      setPresenceLogs(mockPresenceLogs);
      return;
    }
    
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'presenceSettings', 'global'));
        if (settingsDoc.exists()) {
          setPresenceSettings(settingsDoc.data() as PresenceSettings);
        } else {
          // Create default settings if they don't exist
          await setDoc(doc(db, 'presenceSettings', 'global'), mockPresenceSettings);
          setPresenceSettings(mockPresenceSettings);
        }
      } catch (error) {
        console.warn('Error fetching presence settings, using mock data:', error);
        // Fallback to mock data if Firestore is unavailable
        setPresenceSettings(mockPresenceSettings);
      }
    };
    
    const fetchEmployeeConfigs = async () => {
      try {
        const configsQuery = query(collection(db, 'employeeConfigs'));
        const configsSnapshot = await getDocs(configsQuery);
        const configsList = configsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as EmployeePresenceConfig[];
        setEmployeeConfigs(configsList);
      } catch (error) {
        console.warn('Error fetching employee configs, using mock data:', error);
        // Fallback to mock data if Firestore is unavailable
        setEmployeeConfigs(mockEmployeeConfigs);
      }
    };
    
    // Subscribe to presence logs
    let unsubscribe = () => {};
    
    try {
      const q = query(collection(db, 'presenceLogs'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const logs: PresenceLog[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            employeeId: data.employeeId,
            clockInTime: data.clockInTime.toDate(),
            clockOutTime: data.clockOutTime ? data.clockOutTime.toDate() : undefined,
            totalMinutes: data.totalMinutes,
            method: data.method,
            location: data.location,
            shiftId: data.shiftId
          });
        });
        setPresenceLogs(logs);
      }, (error) => {
        console.warn('Error subscribing to presence logs, using mock data:', error);
        // Fallback to mock data if Firestore is unavailable
        setPresenceLogs(mockPresenceLogs);
      });
    } catch (error) {
      console.warn('Error setting up presence logs subscription:', error);
      setPresenceLogs(mockPresenceLogs);
    }
    
    fetchSettings();
    fetchEmployeeConfigs();
    
    return () => unsubscribe();
  }, [user]);

  const updatePresenceSettings = (settings: PresenceSettings) => {
    // For mock users, just update local state
    if (!user || isMockUser(user)) {
      setPresenceSettings(settings);
      return;
    }

    setDoc(doc(db, 'presenceSettings', 'global'), settings)
      .then(() => {
        setPresenceSettings(settings);
      })
      .catch(error => {
        console.warn('Error updating presence settings, updating locally:', error);
        // Update locally even if Firestore fails
        setPresenceSettings(settings);
      });
  };

  const updateEmployeeConfig = (config: EmployeePresenceConfig) => {
    // For mock users, just update local state
    if (!user || isMockUser(user)) {
      setEmployeeConfigs(prev => 
        prev.map(c => c.employeeId === config.employeeId ? config : c)
      );
      return;
    }

    // Check if config already exists
    const configQuery = query(
      collection(db, 'employeeConfigs'), 
      where('employeeId', '==', config.employeeId)
    );
    
    getDocs(configQuery).then(snapshot => {
      if (!snapshot.empty) {
        // Update existing config
        const docId = snapshot.docs[0].id;
        updateDoc(doc(db, 'employeeConfigs', docId), config)
          .then(() => {
            setEmployeeConfigs(prev => 
              prev.map(c => c.employeeId === config.employeeId ? config : c)
            );
          })
          .catch(error => {
            console.warn('Error updating employee config, updating locally:', error);
            setEmployeeConfigs(prev => 
              prev.map(c => c.employeeId === config.employeeId ? config : c)
            );
          });
      } else {
        // Create new config
        addDoc(collection(db, 'employeeConfigs'), config)
          .then(docRef => {
            setEmployeeConfigs(prev => [...prev, { ...config, id: docRef.id }]);
          })
          .catch(error => {
            console.warn('Error creating employee config, updating locally:', error);
            setEmployeeConfigs(prev => [...prev, config]);
          });
      }
    }).catch(error => {
      console.warn('Error querying employee configs, updating locally:', error);
      setEmployeeConfigs(prev => 
        prev.map(c => c.employeeId === config.employeeId ? config : c)
      );
    });
  };

  const clockIn = async (employeeId: string, method: string = 'manual', location?: string) => {
    // For mock users, just update local state
    if (!user || isMockUser(user)) {
      const mockLog: PresenceLog = {
        id: Date.now().toString(),
        employeeId,
        clockInTime: new Date(),
        totalMinutes: 0,
        method,
        location,
        shiftId: null
      };
      setPresenceLogs(prev => [...prev, mockLog]);
      return;
    }

    try {
      // Get current location if enabled and permission granted
      let locationString = location;
      if (presenceSettings.allowGeoLocation && !location) {
        try {
          const locationData = await getCurrentLocation();
          if (locationData) {
            const { latitude, longitude } = locationData.coords;
            locationString = `${latitude},${longitude}`;
          }
        } catch (error) {
          console.warn('Could not get location:', error);
        }
      }
      
      // Create new presence log in Firestore
      await addDoc(collection(db, 'presenceLogs'), {
        employeeId,
        clockInTime: Timestamp.now(),
        clockOutTime: null,
        totalMinutes: 0,
        method,
        location: locationString,
        shiftId: null
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  };

  const clockOut = async (employeeId: string) => {
    // For mock users, just update local state
    if (!user || isMockUser(user)) {
      setPresenceLogs(prev => 
        prev.map(log => {
          if (log.employeeId === employeeId && !log.clockOutTime) {
            const clockOutTime = new Date();
            const totalMinutes = Math.floor(
              (clockOutTime.getTime() - log.clockInTime.getTime()) / (1000 * 60)
            );
            return { ...log, clockOutTime, totalMinutes };
          }
          return log;
        })
      );
      return;
    }

    try {
      // Find the active log for this employee
      const activeLogQuery = query(
        collection(db, 'presenceLogs'),
        where('employeeId', '==', employeeId),
        where('clockOutTime', '==', null)
      );
      
      const snapshot = await getDocs(activeLogQuery);
      
      if (snapshot.empty) {
        throw new Error('No active clock-in found for employee');
      }
      
      const logDoc = snapshot.docs[0];
      const clockInTime = logDoc.data().clockInTime.toDate();
      const clockOutTime = new Date();
      const totalMinutes = Math.floor(
        (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60)
      );
      
      await updateDoc(doc(db, 'presenceLogs', logDoc.id), {
        clockOutTime: Timestamp.now(),
        totalMinutes
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      throw error;
    }
  };

  const getCurrentPresence = (employeeId: string): PresenceLog | null => {
    return presenceLogs.find(log => 
      log.employeeId === employeeId && !log.clockOutTime
    ) || null;
  };

  const isEmployeePresenceEnabled = (employeeId: string): boolean => {
    const config = employeeConfigs.find(c => c.employeeId === employeeId);
    return config ? config.enabled : false;
  };

  const value: PresenceContextType = {
    presenceSettings,
    updatePresenceSettings,
    employeeConfigs,
    updateEmployeeConfig,
    presenceLogs,
    clockIn,
    clockOut,
    getCurrentPresence,
    isEmployeePresenceEnabled
  };

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (context === undefined) {
    throw new Error('usePresence must be used within a PresenceProvider');
  }
  return context;
}