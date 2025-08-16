import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScheduledReport, ReportHistory } from '../types/reports';

interface ReportsContextType {
  scheduledReports: ScheduledReport[];
  reportHistory: ReportHistory[];
  createScheduledReport: (report: Omit<ScheduledReport, 'id' | 'createdAt' | 'nextRun'>) => void;
  updateScheduledReport: (id: string, updates: Partial<ScheduledReport>) => void;
  deleteScheduledReport: (id: string) => void;
  duplicateScheduledReport: (id: string) => void;
  runReportNow: (id: string) => Promise<void>;
  getReportHistory: (reportId: string) => ReportHistory[];
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Mock data
const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    title: 'Weekly Presence Report',
    type: 'presence',
    dateRange: 'weekly',
    departmentFilters: ['Sales', 'Operations'],
    employeeFilters: [],
    frequency: 'weekly',
    sendTime: '09:00',
    recipients: [
      { type: 'email', value: 'manager@company.com' },
      { type: 'user', value: 'admin' }
    ],
    format: 'pdf',
    emailSubject: 'Weekly Presence Report',
    emailBody: 'Please find attached the weekly presence report.',
    includeEmptyResults: false,
    isActive: true,
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    nextRun: new Date('2024-01-22T09:00:00')
  },
  {
    id: '2',
    title: 'Monthly Task Summary',
    type: 'tasks',
    dateRange: 'monthly',
    departmentFilters: [],
    employeeFilters: [],
    frequency: 'monthly',
    sendTime: '08:00',
    recipients: [
      { type: 'manager', value: 'all' }
    ],
    format: 'excel',
    includeEmptyResults: true,
    isActive: true,
    createdBy: 'admin',
    createdAt: new Date('2024-01-10'),
    nextRun: new Date('2024-02-01T08:00:00')
  }
];

const mockReportHistory: ReportHistory[] = [
  {
    id: '1',
    reportId: '1',
    runDate: new Date('2024-01-15T09:00:00'),
    status: 'success',
    recipientCount: 2,
    downloadUrl: '/reports/weekly-presence-2024-01-15.pdf'
  },
  {
    id: '2',
    reportId: '1',
    runDate: new Date('2024-01-08T09:00:00'),
    status: 'success',
    recipientCount: 2,
    downloadUrl: '/reports/weekly-presence-2024-01-08.pdf'
  }
];

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>(mockReportHistory);

  const createScheduledReport = (reportData: Omit<ScheduledReport, 'id' | 'createdAt' | 'nextRun'>) => {
    const newReport: ScheduledReport = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date(),
      nextRun: calculateNextRun(reportData.frequency, reportData.sendTime)
    };
    setScheduledReports(prev => [...prev, newReport]);
  };

  const updateScheduledReport = (id: string, updates: Partial<ScheduledReport>) => {
    setScheduledReports(prev => 
      prev.map(report => 
        report.id === id 
          ? { ...report, ...updates, nextRun: calculateNextRun(updates.frequency || report.frequency, updates.sendTime || report.sendTime) }
          : report
      )
    );
  };

  const deleteScheduledReport = (id: string) => {
    setScheduledReports(prev => prev.filter(report => report.id !== id));
  };

  const duplicateScheduledReport = (id: string) => {
    const report = scheduledReports.find(r => r.id === id);
    if (report) {
      const duplicated = {
        ...report,
        id: Date.now().toString(),
        title: `${report.title} (Copy)`,
        createdAt: new Date(),
        nextRun: calculateNextRun(report.frequency, report.sendTime)
      };
      setScheduledReports(prev => [...prev, duplicated]);
    }
  };

  const runReportNow = async (id: string) => {
    const report = scheduledReports.find(r => r.id === id);
    if (report) {
      const historyEntry: ReportHistory = {
        id: Date.now().toString(),
        reportId: id,
        runDate: new Date(),
        status: 'success',
        recipientCount: report.recipients.length,
        downloadUrl: `/reports/${report.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${report.format}`
      };
      setReportHistory(prev => [historyEntry, ...prev]);
    }
  };

  const getReportHistory = (reportId: string): ReportHistory[] => {
    return reportHistory.filter(h => h.reportId === reportId);
  };

  const calculateNextRun = (frequency: string, sendTime: string): Date => {
    const now = new Date();
    const [hours, minutes] = sendTime.split(':').map(Number);
    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    switch (frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay()));
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1, 1);
        break;
    }

    return nextRun;
  };

  return (
    <ReportsContext.Provider value={{
      scheduledReports,
      reportHistory,
      createScheduledReport,
      updateScheduledReport,
      deleteScheduledReport,
      duplicateScheduledReport,
      runReportNow,
      getReportHistory
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}