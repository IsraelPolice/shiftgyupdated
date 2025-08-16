export interface Event {
  id: string;
  employeeId: string;
  employeeName: string;
  type: EventType;
  title: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  status: 'pending' | 'approved' | 'declined';
  notes?: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  declineReason?: string;
}

export interface EventType {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  blocksEntireDay: boolean;
  requiresApproval: boolean;
  isBuiltIn: boolean;
}

export interface EventRequest {
  id: string;
  event: Event;
  requestedBy: string;
  requestedAt: string;
  managerNotes?: string;
  impactAnalysis?: {
    affectedShifts: number;
    coverageNeeded: boolean;
    suggestedReplacements: string[];
  };
}

// Built-in event types
export const DEFAULT_EVENT_TYPES: EventType[] = [
  {
    id: 'day-off',
    name: 'Day Off',
    color: '#EF4444',
    icon: 'calendar-x',
    description: 'Full day unavailable',
    blocksEntireDay: true,
    requiresApproval: true,
    isBuiltIn: true
  },
  {
    id: 'vacation',
    name: 'Vacation',
    color: '#3B82F6',
    icon: 'palm-tree',
    description: 'Planned time off',
    blocksEntireDay: true,
    requiresApproval: true,
    isBuiltIn: true
  },
  {
    id: 'early-leave',
    name: 'Early Leave',
    color: '#F59E0B',
    icon: 'clock-arrow-left',
    description: 'Leave before shift end',
    blocksEntireDay: false,
    requiresApproval: true,
    isBuiltIn: true
  },
  {
    id: 'late-arrival',
    name: 'Late Arrival',
    color: '#F97316',
    icon: 'clock-arrow-right',
    description: 'Arrive after shift start',
    blocksEntireDay: false,
    requiresApproval: true,
    isBuiltIn: true
  },
  {
    id: 'work-from-home',
    name: 'Work From Home',
    color: '#10B981',
    icon: 'house',
    description: 'Remote work day',
    blocksEntireDay: true,
    requiresApproval: false,
    isBuiltIn: true
  },
  {
    id: 'maternity-leave',
    name: 'Maternity Leave',
    color: '#8B5CF6',
    icon: 'heart',
    description: 'Extended leave',
    blocksEntireDay: true,
    requiresApproval: true,
    isBuiltIn: true
  }
];