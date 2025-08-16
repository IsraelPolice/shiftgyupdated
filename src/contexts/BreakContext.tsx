import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ShiftBreak, BreakSettings, BreakAssignment } from '../types/breaks';

interface BreakContextType {
  breakSettings: BreakSettings;
  updateBreakSettings: (settings: BreakSettings) => void;
  shiftBreaks: ShiftBreak[];
  breakAssignments: BreakAssignment[];
  addShiftBreak: (shiftBreak: ShiftBreak) => void;
  updateShiftBreak: (id: string, shiftBreak: Partial<ShiftBreak>) => void;
  deleteShiftBreak: (id: string) => void;
  assignBreak: (assignment: BreakAssignment) => void;
  swapBreaks: (assignment1Id: string, assignment2Id: string) => void;
  getBreaksForShift: (shiftId: string) => ShiftBreak[];
  getBreakAssignmentsForShift: (shiftId: string) => BreakAssignment[];
  getActiveBreaksAtTime: (time: string) => BreakAssignment[];
}

const BreakContext = createContext<BreakContextType | undefined>(undefined);

// Mock data
const mockBreakSettings: BreakSettings = {
  enabled: true,
  breaksPerShift: 2,
  defaultDuration: 20,
  autoAssign: false,
  maxConcurrentBreaks: 3
};

const mockShiftBreaks: ShiftBreak[] = [
  {
    id: '1',
    shiftId: 'shift1',
    startRange: '10:00',
    endRange: '12:00',
    duration: 20,
    maxConcurrentEmployees: 2,
    assignedUserIds: ['1', '2']
  },
  {
    id: '2',
    shiftId: 'shift1',
    startRange: '13:00',
    endRange: '15:00',
    duration: 40,
    maxConcurrentEmployees: 3,
    assignedUserIds: ['1', '3', '4']
  }
];

const mockBreakAssignments: BreakAssignment[] = [
  {
    id: '1',
    employeeId: '1',
    shiftId: 'shift1',
    breakId: '1',
    startTime: '10:30',
    endTime: '10:50',
    status: 'scheduled'
  },
  {
    id: '2',
    employeeId: '2',
    shiftId: 'shift1',
    breakId: '1',
    startTime: '11:00',
    endTime: '11:20',
    status: 'scheduled'
  }
];

export function BreakProvider({ children }: { children: ReactNode }) {
  const [breakSettings, setBreakSettings] = useState<BreakSettings>(mockBreakSettings);
  const [shiftBreaks, setShiftBreaks] = useState<ShiftBreak[]>(mockShiftBreaks);
  const [breakAssignments, setBreakAssignments] = useState<BreakAssignment[]>(mockBreakAssignments);

  const updateBreakSettings = (settings: BreakSettings) => {
    setBreakSettings(settings);
  };

  const addShiftBreak = (shiftBreak: ShiftBreak) => {
    setShiftBreaks(prev => [...prev, shiftBreak]);
  };

  const updateShiftBreak = (id: string, updates: Partial<ShiftBreak>) => {
    setShiftBreaks(prev => 
      prev.map(sb => sb.id === id ? { ...sb, ...updates } : sb)
    );
  };

  const deleteShiftBreak = (id: string) => {
    setShiftBreaks(prev => prev.filter(sb => sb.id !== id));
  };

  const assignBreak = (assignment: BreakAssignment) => {
    setBreakAssignments(prev => [...prev, assignment]);
  };

  const swapBreaks = (assignment1Id: string, assignment2Id: string) => {
    setBreakAssignments(prev => {
      const assignment1 = prev.find(a => a.id === assignment1Id);
      const assignment2 = prev.find(a => a.id === assignment2Id);
      
      if (assignment1 && assignment2) {
        return prev.map(a => {
          if (a.id === assignment1Id) {
            return { ...a, startTime: assignment2.startTime, endTime: assignment2.endTime };
          }
          if (a.id === assignment2Id) {
            return { ...a, startTime: assignment1.startTime, endTime: assignment1.endTime };
          }
          return a;
        });
      }
      return prev;
    });
  };

  const getBreaksForShift = (shiftId: string): ShiftBreak[] => {
    return shiftBreaks.filter(sb => sb.shiftId === shiftId);
  };

  const getBreakAssignmentsForShift = (shiftId: string): BreakAssignment[] => {
    return breakAssignments.filter(ba => ba.shiftId === shiftId);
  };

  const getActiveBreaksAtTime = (time: string): BreakAssignment[] => {
    return breakAssignments.filter(ba => {
      const breakStart = ba.startTime;
      const breakEnd = ba.endTime;
      return time >= breakStart && time <= breakEnd;
    });
  };

  return (
    <BreakContext.Provider value={{
      breakSettings,
      updateBreakSettings,
      shiftBreaks,
      breakAssignments,
      addShiftBreak,
      updateShiftBreak,
      deleteShiftBreak,
      assignBreak,
      swapBreaks,
      getBreaksForShift,
      getBreakAssignmentsForShift,
      getActiveBreaksAtTime
    }}>
      {children}
    </BreakContext.Provider>
  );
}

export function useBreaks() {
  const context = useContext(BreakContext);
  if (context === undefined) {
    throw new Error('useBreaks must be used within a BreakProvider');
  }
  return context;
}