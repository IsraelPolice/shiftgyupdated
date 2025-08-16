export interface PresenceLog {
  id: string;
  employeeId: string;
  clockInTime: Date;
  clockOutTime?: Date;
  totalMinutes?: number;
  method: 'manual' | 'scheduled' | 'automatic';
  location?: string;
  shiftId?: string;
}

export interface PresenceSettings {
  enabled: boolean;
  reminderTime?: string;
  remindClockOut: boolean;
  allowGeoLocation: boolean;
  defaultMethod: 'manual' | 'automatic';
}

export interface EmployeePresenceConfig {
  employeeId: string;
  requireClockInOut: boolean;
  enabled: boolean;
}