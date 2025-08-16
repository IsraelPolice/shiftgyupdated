import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// AI Data Types
interface ConflictPrediction {
  id: string;
  type: 'understaffed' | 'overstaffed' | 'skill_mismatch' | 'availability_conflict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedShifts: string[];
  suggestedActions: string[];
  confidence: number;
  timeframe: string;
}

interface TeamCompatibility {
  employeeA: string;
  employeeB: string;
  compatibilityScore: number;
  workingHistory: number;
  conflictHistory: number;
  recommendedPairing: boolean;
}

interface SatisfactionMetrics {
  overall: number;
  byDepartment: Record<string, number>;
  byEmployee: Record<string, number>;
  trends: Array<{ date: string; score: number }>;
  factors: Array<{ factor: string; impact: number }>;
}

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'optimization' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedActions?: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIContextType {
  // Analytics
  conflictPredictions: ConflictPrediction[];
  teamCompatibility: TeamCompatibility[];
  satisfactionMetrics: SatisfactionMetrics;
  aiInsights: AIInsight[];
  
  // Chat Assistant
  chatMessages: ChatMessage[];
  isTyping: boolean;
  
  // UI State
  showAIPanel: boolean;
  showSatisfactionSimulator: boolean;
  showChatAssistant: boolean;
  aiEnabled: boolean;
  
  // Actions
  setShowAIPanel: (show: boolean) => void;
  setShowSatisfactionSimulator: (show: boolean) => void;
  setShowChatAssistant: (show: boolean) => void;
  setAIEnabled: (enabled: boolean) => void;
  sendChatMessage: (message: string) => void;
  generateInsights: (scheduleData: any) => void;
  updateSatisfactionMetrics: (assignments: any) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// Mock data generators
const generateMockConflicts = (): ConflictPrediction[] => [
  {
    id: '1',
    type: 'understaffed',
    severity: 'high',
    description: 'Friday evening shift may be understaffed by 2 employees',
    affectedShifts: ['friday-evening'],
    suggestedActions: [
      'Consider moving employees from less busy shifts',
      'Offer overtime incentives',
      'Check availability of part-time staff'
    ],
    confidence: 0.85,
    timeframe: 'Next week'
  },
  {
    id: '2',
    type: 'skill_mismatch',
    severity: 'medium',
    description: 'Morning shift lacks experienced cashiers',
    affectedShifts: ['monday-morning', 'tuesday-morning'],
    suggestedActions: [
      'Schedule at least one experienced cashier per shift',
      'Provide additional training for new staff'
    ],
    confidence: 0.72,
    timeframe: 'This week'
  }
];

const generateMockCompatibility = (): TeamCompatibility[] => [
  {
    employeeA: '1',
    employeeB: '2',
    compatibilityScore: 0.92,
    workingHistory: 45,
    conflictHistory: 1,
    recommendedPairing: true
  },
  {
    employeeA: '2',
    employeeB: '3',
    compatibilityScore: 0.68,
    workingHistory: 12,
    conflictHistory: 3,
    recommendedPairing: false
  }
];

const generateMockSatisfaction = (): SatisfactionMetrics => ({
  overall: 0.78,
  byDepartment: {
    'Sales': 0.82,
    'Operations': 0.75,
    'Customer Service': 0.80
  },
  byEmployee: {
    '1': 0.85,
    '2': 0.79,
    '3': 0.72,
    '4': 0.81
  },
  trends: [
    { date: '2024-01-15', score: 0.75 },
    { date: '2024-01-16', score: 0.77 },
    { date: '2024-01-17', score: 0.78 },
    { date: '2024-01-18', score: 0.76 },
    { date: '2024-01-19', score: 0.78 }
  ],
  factors: [
    { factor: 'Workload Balance', impact: 0.3 },
    { factor: 'Shift Preferences', impact: 0.25 },
    { factor: 'Team Chemistry', impact: 0.2 },
    { factor: 'Schedule Flexibility', impact: 0.15 },
    { factor: 'Communication', impact: 0.1 }
  ]
});

const generateMockInsights = (): AIInsight[] => [
  {
    id: '1',
    type: 'optimization',
    title: 'Optimize Weekend Coverage',
    description: 'Moving Sarah to Saturday morning could improve team efficiency by 15%',
    confidence: 0.87,
    impact: 'medium',
    actionable: true,
    suggestedActions: ['Move Sarah Johnson to Saturday morning shift']
  },
  {
    id: '2',
    type: 'prediction',
    title: 'Potential Burnout Risk',
    description: 'Michael Chen showing signs of schedule fatigue - consider lighter workload',
    confidence: 0.73,
    impact: 'high',
    actionable: true,
    suggestedActions: ['Reduce Michael\'s shifts this week', 'Offer flexible scheduling options']
  }
];

export function AIProvider({ children }: { children: ReactNode }) {
  const [conflictPredictions, setConflictPredictions] = useState<ConflictPrediction[]>([]);
  const [teamCompatibility, setTeamCompatibility] = useState<TeamCompatibility[]>([]);
  const [satisfactionMetrics, setSatisfactionMetrics] = useState<SatisfactionMetrics>({
    overall: 0,
    byDepartment: {},
    byEmployee: {},
    trends: [],
    factors: []
  });
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // UI State
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showSatisfactionSimulator, setShowSatisfactionSimulator] = useState(false);
  const [showChatAssistant, setShowChatAssistant] = useState(false);
  const [aiEnabled, setAIEnabled] = useState(true);

  // Initialize mock data
  useEffect(() => {
    if (aiEnabled) {
      setConflictPredictions(generateMockConflicts());
      setTeamCompatibility(generateMockCompatibility());
      setSatisfactionMetrics(generateMockSatisfaction());
      setAIInsights(generateMockInsights());
    }
  }, [aiEnabled]);

  const sendChatMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date(),
        suggestions: ['Show schedule conflicts', 'Optimize this week', 'Team satisfaction report']
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "I can help you optimize your schedule. Based on current data, I see some opportunities for improvement.",
      "Let me analyze your team's workload distribution. I notice some potential conflicts next week.",
      "Your team satisfaction is currently at 78%. Would you like me to suggest ways to improve it?",
      "I can help you find the best employees for specific shifts based on their skills and availability."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateInsights = (scheduleData: any) => {
    // Simulate AI analysis of schedule data
    const newInsights = generateMockInsights();
    setAIInsights(newInsights);
  };

  const updateSatisfactionMetrics = (assignments: any) => {
    // Simulate real-time satisfaction calculation
    const newMetrics = generateMockSatisfaction();
    setSatisfactionMetrics(newMetrics);
  };

  return (
    <AIContext.Provider value={{
      conflictPredictions,
      teamCompatibility,
      satisfactionMetrics,
      aiInsights,
      chatMessages,
      isTyping,
      showAIPanel,
      showSatisfactionSimulator,
      showChatAssistant,
      aiEnabled,
      setShowAIPanel,
      setShowSatisfactionSimulator,
      setShowChatAssistant,
      setAIEnabled,
      sendChatMessage,
      generateInsights,
      updateSatisfactionMetrics
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}