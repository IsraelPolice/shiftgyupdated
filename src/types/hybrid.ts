// Enhanced Hybrid & Remote Work Types
export interface RemoteTask {
  id: string;
  shiftId: string;
  employeeId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  deliverables: string[];
  createdAt: string;
  completedAt?: string;
}

export interface RemoteKPI {
  id: string;
  employeeId: string;
  shiftId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string; // 'calls', 'sales', 'hours', 'deliverables', etc.
  status: 'on_track' | 'behind' | 'exceeded' | 'at_risk';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RemoteCheckIn {
  id: string;
  employeeId: string;
  shiftId: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'pending' | 'completed' | 'missed' | 'late';
  notes?: string;
  productivity_rating?: number; // 1-5 scale
  blockers?: string[];
  next_steps?: string[];
}

export interface HybridShiftConfig {
  shiftId: string;
  isRemote: boolean;
  checkInFrequency: 'hourly' | 'bi_hourly' | 'custom' | 'none';
  customCheckInInterval?: number; // minutes
  requiredDeliverables: string[];
  kpiTargets: RemoteKPI[];
  collaborationTools: string[]; // 'zoom', 'slack', 'teams', etc.
}

// Enhanced Shift Preference System Types
export interface ShiftPreference {
  id: string;
  employeeId: string;
  weekStartDate: string; // ISO date string for the week
  preferences: {
    shiftId: string;
    rank: 1 | 2 | 3; // Top 3 preferences only
    strength: number; // 1-100 percentage
    reason?: string; // Optional explanation
  }[];
  submittedAt: string;
  status: 'draft' | 'submitted' | 'processed';
}

export interface PreferenceMatch {
  shiftId: string;
  employeeId: string;
  preferenceRank?: 1 | 2 | 3;
  preferenceStrength?: number;
  matchScore: number; // AI-calculated optimal fit score
  conflictsWith: string[]; // Other employee IDs who want same shift
  businessPriority: 'high' | 'medium' | 'low';
  fairnessScore: number; // Based on historical preference fulfillment
}

export interface AIScheduleSuggestion {
  id: string;
  weekStartDate: string;
  suggestions: {
    shiftId: string;
    recommendedEmployeeId: string;
    confidence: number; // 0-100
    reasoning: string[];
    alternativeOptions: {
      employeeId: string;
      score: number;
      tradeoffs: string[];
    }[];
  }[];
  overallSatisfactionScore: number; // Predicted team satisfaction
  businessOptimizationScore: number; // How well it meets business needs
  generatedAt: string;
}

export interface SwapSuggestion {
  id: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  fromShiftId: string;
  toShiftId: string;
  mutualBenefit: number; // Score indicating how much both benefit
  reasoning: string;
  status: 'suggested' | 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

// Analytics Types
export interface HybridAnalytics {
  employeeId: string;
  period: string; // 'week', 'month', 'quarter'
  remoteShiftsCount: number;
  onSiteShiftsCount: number;
  averageProductivity: number; // 1-5 scale
  kpiCompletionRate: number; // 0-100%
  checkInComplianceRate: number; // 0-100%
  taskCompletionRate: number; // 0-100%
  preferencesFulfilledRate: number; // 0-100%
  satisfactionTrend: 'improving' | 'stable' | 'declining';
}

export interface TeamPreferenceAnalytics {
  weekStartDate: string;
  totalPreferencesSubmitted: number;
  preferenceFulfillmentRate: number; // 0-100%
  conflictResolutionRate: number; // 0-100%
  employeeSatisfactionScore: number; // 1-5 scale
  schedulingEfficiencyGain: number; // Percentage improvement
  turnoverReduction: number; // Percentage
  topConflictShifts: {
    shiftId: string;
    conflictCount: number;
    resolutionStrategy: string;
  }[];
}