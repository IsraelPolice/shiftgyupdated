import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  RemoteTask, 
  RemoteKPI, 
  RemoteCheckIn, 
  HybridShiftConfig,
  ShiftPreference,
  PreferenceMatch,
  AIScheduleSuggestion,
  SwapSuggestion,
  HybridAnalytics,
  TeamPreferenceAnalytics
} from '../types/hybrid';

interface HybridWorkContextType {
  // Remote Work Management
  remoteTasks: RemoteTask[];
  remoteKPIs: RemoteKPI[];
  remoteCheckIns: RemoteCheckIn[];
  hybridConfigs: HybridShiftConfig[];
  
  // Shift Preferences
  shiftPreferences: ShiftPreference[];
  preferenceMatches: PreferenceMatch[];
  aiSuggestions: AIScheduleSuggestion[];
  swapSuggestions: SwapSuggestion[];
  
  // Analytics
  hybridAnalytics: HybridAnalytics[];
  teamAnalytics: TeamPreferenceAnalytics[];
  
  // Remote Work Actions
  createRemoteTask: (task: Omit<RemoteTask, 'id' | 'createdAt'>) => void;
  updateRemoteTask: (id: string, updates: Partial<RemoteTask>) => void;
  createRemoteKPI: (kpi: Omit<RemoteKPI, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRemoteKPI: (id: string, updates: Partial<RemoteKPI>) => void;
  recordCheckIn: (checkIn: Omit<RemoteCheckIn, 'id'>) => void;
  configureHybridShift: (config: HybridShiftConfig) => void;
  
  // Preference Actions
  submitShiftPreferences: (preferences: Omit<ShiftPreference, 'id' | 'submittedAt' | 'status'>) => void;
  generateAISuggestions: (weekStartDate: string) => void;
  acceptAISuggestion: (suggestionId: string, shiftId: string) => void;
  createSwapSuggestion: (suggestion: Omit<SwapSuggestion, 'id' | 'createdAt' | 'status'>) => void;
  respondToSwapSuggestion: (id: string, response: 'accepted' | 'declined') => void;
  
  // Analytics Actions
  getHybridAnalytics: (employeeId: string, period: string) => HybridAnalytics | null;
  getTeamAnalytics: (weekStartDate: string) => TeamPreferenceAnalytics | null;
  getPreferenceFulfillmentRate: (employeeId: string) => number;
}

const HybridWorkContext = createContext<HybridWorkContextType | undefined>(undefined);

// Mock data for demonstration
const mockRemoteTasks: RemoteTask[] = [
  {
    id: '1',
    shiftId: 'remote-shift-1',
    employeeId: '1',
    title: 'Complete Q4 Sales Report',
    description: 'Analyze sales data and prepare comprehensive quarterly report',
    priority: 'high',
    estimatedHours: 4,
    deadline: '2024-01-25T17:00:00Z',
    status: 'in_progress',
    deliverables: ['Sales analysis spreadsheet', 'Executive summary', 'Trend charts'],
    createdAt: '2024-01-22T09:00:00Z'
  },
  {
    id: '2',
    shiftId: 'remote-shift-2',
    employeeId: '2',
    title: 'Customer Support Tickets',
    description: 'Handle priority customer support tickets remotely',
    priority: 'medium',
    estimatedHours: 6,
    status: 'pending',
    deliverables: ['Resolved tickets log', 'Customer satisfaction survey'],
    createdAt: '2024-01-22T08:00:00Z'
  }
];

const mockRemoteKPIs: RemoteKPI[] = [
  {
    id: '1',
    employeeId: '1',
    shiftId: 'remote-shift-1',
    title: 'Sales Calls Completed',
    description: 'Number of customer calls made during remote shift',
    targetValue: 25,
    currentValue: 18,
    unit: 'calls',
    status: 'behind',
    dueDate: '2024-01-25T17:00:00Z',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-24T14:30:00Z'
  }
];

const mockShiftPreferences: ShiftPreference[] = [
  {
    id: '1',
    employeeId: '1',
    weekStartDate: '2024-01-22',
    preferences: [
      { shiftId: 'morning-mon', rank: 1, strength: 95, reason: 'Better work-life balance' },
      { shiftId: 'afternoon-tue', rank: 2, strength: 75 },
      { shiftId: 'morning-fri', rank: 3, strength: 60 }
    ],
    submittedAt: '2024-01-20T10:00:00Z',
    status: 'submitted'
  }
];

export function HybridWorkProvider({ children }: { children: ReactNode }) {
  const [remoteTasks, setRemoteTasks] = useState<RemoteTask[]>(mockRemoteTasks);
  const [remoteKPIs, setRemoteKPIs] = useState<RemoteKPI[]>(mockRemoteKPIs);
  const [remoteCheckIns, setRemoteCheckIns] = useState<RemoteCheckIn[]>([]);
  const [hybridConfigs, setHybridConfigs] = useState<HybridShiftConfig[]>([]);
  const [shiftPreferences, setShiftPreferences] = useState<ShiftPreference[]>(mockShiftPreferences);
  const [preferenceMatches, setPreferenceMatches] = useState<PreferenceMatch[]>([]);
  const [aiSuggestions, setAISuggestions] = useState<AIScheduleSuggestion[]>([]);
  const [swapSuggestions, setSwapSuggestions] = useState<SwapSuggestion[]>([]);
  const [hybridAnalytics, setHybridAnalytics] = useState<HybridAnalytics[]>([]);
  const [teamAnalytics, setTeamAnalytics] = useState<TeamPreferenceAnalytics[]>([]);

  const createRemoteTask = (taskData: Omit<RemoteTask, 'id' | 'createdAt'>) => {
    const newTask: RemoteTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setRemoteTasks(prev => [...prev, newTask]);
  };

  const updateRemoteTask = (id: string, updates: Partial<RemoteTask>) => {
    setRemoteTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const createRemoteKPI = (kpiData: Omit<RemoteKPI, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newKPI: RemoteKPI = {
      ...kpiData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRemoteKPIs(prev => [...prev, newKPI]);
  };

  const updateRemoteKPI = (id: string, updates: Partial<RemoteKPI>) => {
    setRemoteKPIs(prev => prev.map(kpi => 
      kpi.id === id ? { ...kpi, ...updates, updatedAt: new Date().toISOString() } : kpi
    ));
  };

  const recordCheckIn = (checkInData: Omit<RemoteCheckIn, 'id'>) => {
    const newCheckIn: RemoteCheckIn = {
      ...checkInData,
      id: Date.now().toString()
    };
    setRemoteCheckIns(prev => [...prev, newCheckIn]);
  };

  const configureHybridShift = (config: HybridShiftConfig) => {
    setHybridConfigs(prev => {
      const existing = prev.findIndex(c => c.shiftId === config.shiftId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = config;
        return updated;
      }
      return [...prev, config];
    });
  };

  const submitShiftPreferences = (preferencesData: Omit<ShiftPreference, 'id' | 'submittedAt' | 'status'>) => {
    const newPreferences: ShiftPreference = {
      ...preferencesData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };
    setShiftPreferences(prev => [...prev, newPreferences]);
  };

  const generateAISuggestions = (weekStartDate: string) => {
    // Mock AI suggestion generation
    const suggestion: AIScheduleSuggestion = {
      id: Date.now().toString(),
      weekStartDate,
      suggestions: [
        {
          shiftId: 'morning-mon',
          recommendedEmployeeId: '1',
          confidence: 85,
          reasoning: ['Employee ranked this as 1st preference', 'High historical performance on Monday mornings'],
          alternativeOptions: [
            {
              employeeId: '2',
              score: 70,
              tradeoffs: ['Lower preference rank', 'Good availability']
            }
          ]
        }
      ],
      overallSatisfactionScore: 87,
      businessOptimizationScore: 92,
      generatedAt: new Date().toISOString()
    };
    setAISuggestions(prev => [...prev, suggestion]);
  };

  const acceptAISuggestion = (suggestionId: string, shiftId: string) => {
    // Implementation would apply the AI suggestion to actual schedule
    console.log(`Accepting AI suggestion ${suggestionId} for shift ${shiftId}`);
  };

  const createSwapSuggestion = (suggestionData: Omit<SwapSuggestion, 'id' | 'createdAt' | 'status'>) => {
    const newSuggestion: SwapSuggestion = {
      ...suggestionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'suggested'
    };
    setSwapSuggestions(prev => [...prev, newSuggestion]);
  };

  const respondToSwapSuggestion = (id: string, response: 'accepted' | 'declined') => {
    setSwapSuggestions(prev => prev.map(suggestion =>
      suggestion.id === id ? { ...suggestion, status: response } : suggestion
    ));
  };

  const getHybridAnalytics = (employeeId: string, period: string): HybridAnalytics | null => {
    return hybridAnalytics.find(analytics => 
      analytics.employeeId === employeeId && analytics.period === period
    ) || null;
  };

  const getTeamAnalytics = (weekStartDate: string): TeamPreferenceAnalytics | null => {
    return teamAnalytics.find(analytics => analytics.weekStartDate === weekStartDate) || null;
  };

  const getPreferenceFulfillmentRate = (employeeId: string): number => {
    // Calculate based on historical preference matches
    const employeePreferences = shiftPreferences.filter(p => p.employeeId === employeeId);
    if (employeePreferences.length === 0) return 0;
    
    // Mock calculation - in real implementation, would check actual assignments
    return 78; // 78% fulfillment rate
  };

  return (
    <HybridWorkContext.Provider value={{
      remoteTasks,
      remoteKPIs,
      remoteCheckIns,
      hybridConfigs,
      shiftPreferences,
      preferenceMatches,
      aiSuggestions,
      swapSuggestions,
      hybridAnalytics,
      teamAnalytics,
      createRemoteTask,
      updateRemoteTask,
      createRemoteKPI,
      updateRemoteKPI,
      recordCheckIn,
      configureHybridShift,
      submitShiftPreferences,
      generateAISuggestions,
      acceptAISuggestion,
      createSwapSuggestion,
      respondToSwapSuggestion,
      getHybridAnalytics,
      getTeamAnalytics,
      getPreferenceFulfillmentRate
    }}>
      {children}
    </HybridWorkContext.Provider>
  );
}

export function useHybridWork() {
  const context = useContext(HybridWorkContext);
  if (context === undefined) {
    throw new Error('useHybridWork must be used within a HybridWorkProvider');
  }
  return context;
}