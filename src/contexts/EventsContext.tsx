import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, EventType, EventRequest, DEFAULT_EVENT_TYPES } from '../types/events';

interface EventsContextType {
  events: Event[];
  eventTypes: EventType[];
  pendingRequests: EventRequest[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  approveEvent: (id: string, managerNotes?: string) => void;
  declineEvent: (id: string, reason: string) => void;
  getEventsForDate: (date: string) => Event[];
  getEventsForEmployee: (employeeId: string) => Event[];
  getPendingRequestsForManager: () => EventRequest[];
  addEventType: (eventType: Omit<EventType, 'id'>) => void;
  updateEventType: (id: string, updates: Partial<EventType>) => void;
  deleteEventType: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    type: DEFAULT_EVENT_TYPES[1], // Vacation
    title: 'Family Vacation',
    startDate: '2024-01-25',
    endDate: '2024-01-27',
    isAllDay: true,
    status: 'approved',
    notes: 'Pre-planned family trip',
    createdAt: '2024-01-15',
    approvedBy: 'manager',
    approvedAt: '2024-01-16'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Michael Chen',
    type: DEFAULT_EVENT_TYPES[2], // Early Leave
    title: 'Doctor Appointment',
    startDate: '2024-01-22',
    endDate: '2024-01-22',
    startTime: '14:00',
    endTime: '17:00',
    isAllDay: false,
    status: 'pending',
    notes: 'Annual checkup',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Emily Davis',
    type: DEFAULT_EVENT_TYPES[4], // Work From Home
    title: 'Remote Work',
    startDate: '2024-01-24',
    endDate: '2024-01-24',
    isAllDay: true,
    status: 'approved',
    notes: 'Home internet installation',
    createdAt: '2024-01-18',
    approvedBy: 'manager',
    approvedAt: '2024-01-18'
  }
];

const mockRequests: EventRequest[] = [
  {
    id: '1',
    event: mockEvents[1],
    requestedBy: '2',
    requestedAt: '2024-01-20',
    impactAnalysis: {
      affectedShifts: 1,
      coverageNeeded: true,
      suggestedReplacements: ['Alex Thompson', 'Jessica Wong']
    }
  }
];

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [eventTypes, setEventTypes] = useState<EventType[]>(DEFAULT_EVENT_TYPES);
  const [pendingRequests, setPendingRequests] = useState<EventRequest[]>(mockRequests);

  const createEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Create request if approval required
    if (eventData.type.requiresApproval) {
      const newRequest: EventRequest = {
        id: Date.now().toString(),
        event: newEvent,
        requestedBy: eventData.employeeId,
        requestedAt: new Date().toISOString()
      };
      setPendingRequests(prev => [...prev, newRequest]);
    }
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setPendingRequests(prev => prev.filter(req => req.event.id !== id));
  };

  const approveEvent = (id: string, managerNotes?: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { 
            ...event, 
            status: 'approved', 
            approvedBy: 'current-manager',
            approvedAt: new Date().toISOString()
          } 
        : event
    ));
    setPendingRequests(prev => prev.filter(req => req.event.id !== id));
  };

  const declineEvent = (id: string, reason: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { 
            ...event, 
            status: 'declined', 
            declineReason: reason
          } 
        : event
    ));
    setPendingRequests(prev => prev.filter(req => req.event.id !== id));
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(date);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  const getEventsForEmployee = (employeeId: string) => {
    return events.filter(event => event.employeeId === employeeId);
  };

  const getPendingRequestsForManager = () => {
    return pendingRequests;
  };

  const addEventType = (eventTypeData: Omit<EventType, 'id'>) => {
    const newEventType: EventType = {
      ...eventTypeData,
      id: Date.now().toString()
    };
    setEventTypes(prev => [...prev, newEventType]);
  };

  const updateEventType = (id: string, updates: Partial<EventType>) => {
    setEventTypes(prev => prev.map(type => 
      type.id === id ? { ...type, ...updates } : type
    ));
  };

  const deleteEventType = (id: string) => {
    if (eventTypes.find(type => type.id === id)?.isBuiltIn) {
      throw new Error('Cannot delete built-in event types');
    }
    setEventTypes(prev => prev.filter(type => type.id !== id));
  };

  return (
    <EventsContext.Provider value={{
      events,
      eventTypes,
      pendingRequests,
      createEvent,
      updateEvent,
      deleteEvent,
      approveEvent,
      declineEvent,
      getEventsForDate,
      getEventsForEmployee,
      getPendingRequestsForManager,
      addEventType,
      updateEventType,
      deleteEventType
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}