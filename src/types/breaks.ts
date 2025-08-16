export interface ShiftBreak {
  id: string;
  shiftId: string;
  startRange: string;
  endRange: string;
  duration: number; // in minutes
  maxConcurrentEmployees: number;
  assignedUserIds: string[];
}

export interface BreakSettings {
  enabled: boolean;
  breaksPerShift: number;
  defaultDuration: number;
  autoAssign: boolean;
  maxConcurrentBreaks: number;
}

export interface BreakAssignment {
  id: string;
  employeeId: string;
  shiftId: string;
  breakId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed';
}