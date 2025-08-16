export interface ScheduledReport {
  id: string;
  title: string;
  type: 'presence' | 'shifts' | 'tasks' | 'surveys' | 'kudos' | 'attendance_accuracy';
  dateRange: 'daily' | 'weekly' | 'monthly' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  departmentFilters: string[];
  employeeFilters: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  sendTime: string;
  recipients: ReportRecipient[];
  format: 'pdf' | 'excel';
  emailSubject?: string;
  emailBody?: string;
  includeEmptyResults: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  nextRun: Date;
}

export interface ReportConfiguration {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  allowedRoles: string[];
  defaultView: 'table' | 'bar' | 'line' | 'donut';
  allowExport: boolean;
  pinnedToOverview: boolean;
  pinnedOrder: number | null;
}

export interface AlertRule {
  id: string;
  reportId: string;
  name: string;
  metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  threshold: number;
  frequency: 'real-time' | 'daily' | 'weekly';
  recipients: {
    roles: string[];
    users: string[];
  };
  deliveryMethods: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  isActive: boolean;
  lastTriggered?: Date;
}

export interface ReportRecipient {
  type: 'email' | 'user' | 'manager';
  value: string;
}

export interface ReportHistory {
  id: string;
  reportId: string;
  runDate: Date;
  status: 'success' | 'failed' | 'pending';
  recipientCount: number;
  downloadUrl?: string;
}

export interface AttendanceAccuracyRecord {
  employeeId: string;
  employeeName: string;
  date: string;
  scheduledShiftStart: string;
  scheduledShiftEnd: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: 'on_time' | 'late' | 'no_show' | 'left_early' | 'overtime';
  totalScheduledDuration: number; // in minutes
  actualDuration?: number; // in minutes
  deviation: number; // +/- minutes from scheduled
  department: string;
  location: string;
}