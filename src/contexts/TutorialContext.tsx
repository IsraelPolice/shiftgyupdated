import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tutorial, TutorialStep, TutorialProgress, AdminCertification } from '../types/tutorials';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

interface TutorialContextType {
  // Tutorial Management
  availableTutorials: Tutorial[];
  activeTutorial: Tutorial | null;
  currentStep: number;
  isActive: boolean;
  
  // Progress Tracking
  tutorialProgress: TutorialProgress[];
  completedTutorials: string[];
  certifications: AdminCertification[];
  
  // Tutorial Controls
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  pauseTutorial: () => void;
  resumeTutorial: () => void;
  
  // Progress Queries
  getTutorialProgress: (tutorialId: string) => TutorialProgress | null;
  isTutorialCompleted: (tutorialId: string) => boolean;
  getCompletionPercentage: () => number;
  getUnlockedFeatures: () => string[];
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

// Mock tutorial data for admin onboarding
const adminTutorials: Tutorial[] = [
  {
    id: 'company-setup-wizard',
    title: 'Company Setup Wizard',
    description: 'Complete company setup in 15 minutes',
    estimatedTime: 15,
    category: 'setup',
    difficulty: 'beginner',
    steps: [
      {
        id: 'admin-welcome',
        title: 'Admin Welcome',
        content: 'Welcome! Let\'s set up ShiftGy for your organization. Complete company setup in 15 minutes.',
        highlight: '.admin-dashboard',
        position: 'center',
        showNext: true,
        showSkip: true
      },
      {
        id: 'company-info',
        title: 'Company Information',
        content: 'Enter your company name, address, and contact information for accurate system configuration.',
        highlight: '.company-form',
        interactive: true,
        action: 'Fill in your company details',
        position: 'right'
      },
      {
        id: 'business-hours',
        title: 'Business Hours & Time Zones',
        content: 'Configure your business hours and time zone for accurate scheduling and reporting.',
        highlight: '.time-settings',
        position: 'left'
      },
      {
        id: 'department-structure',
        title: 'Department Structure',
        content: 'Create departments to organize your employees effectively and streamline management.',
        highlight: '.department-creation',
        interactive: true,
        action: 'Add your first department',
        position: 'top'
      },
      {
        id: 'employee-import',
        title: 'Employee Import & Creation',
        content: 'Import existing employees or add them manually. We support CSV import and bulk operations.',
        highlight: '.employee-management',
        position: 'bottom'
      }
      // Additional steps would be defined here...
    ]
  },
  {
    id: 'admin-dashboard-tutorial',
    title: 'Admin Dashboard Tutorial',
    description: 'Master your system-wide control center',
    estimatedTime: 7,
    category: 'management',
    difficulty: 'beginner',
    steps: [
      {
        id: 'dashboard-overview',
        title: 'Admin Dashboard Overview',
        content: 'Your system-wide control center for monitoring and management of the entire organization.',
        highlight: '.admin-dashboard',
        position: 'center'
      },
      {
        id: 'system-health',
        title: 'System Health Monitoring',
        content: 'Monitor system performance, user activity, and potential issues in real-time.',
        highlight: '.system-health-widgets',
        position: 'top'
      },
      {
        id: 'company-stats',
        title: 'Company-wide Statistics',
        content: 'View organization-wide metrics: total employees, departments, active schedules.',
        highlight: '.aggregate-stats',
        position: 'left'
      }
      // Additional steps...
    ]
  },
  {
    id: 'user-management-tutorial',
    title: 'User Management Tutorial',
    description: 'Comprehensive user administration',
    estimatedTime: 8,
    category: 'management',
    difficulty: 'intermediate',
    steps: [
      {
        id: 'user-directory',
        title: 'User Directory Overview',
        content: 'Manage all system users: employees, managers, and other admins with comprehensive tools.',
        highlight: '.user-directory',
        position: 'center'
      },
      {
        id: 'adding-users',
        title: 'Adding New Users',
        content: 'Add individual users or bulk import from CSV/Excel files for efficient onboarding.',
        highlight: '.add-user-form',
        interactive: true,
        action: 'Try adding a new employee',
        position: 'right'
      }
      // Additional steps...
    ]
  },
  {
    id: 'advanced-analytics-tutorial',
    title: 'Advanced Analytics Tutorial',
    description: 'Business intelligence for your organization',
    estimatedTime: 6,
    category: 'analytics',
    difficulty: 'advanced',
    steps: [
      {
        id: 'analytics-overview',
        title: 'Advanced Analytics Overview',
        content: 'Comprehensive business intelligence for your entire organization with predictive insights.',
        highlight: '.analytics-dashboard',
        position: 'center'
      },
      {
        id: 'performance-metrics',
        title: 'Company-wide Performance Metrics',
        content: 'Monitor overall productivity, attendance, and efficiency metrics across all departments.',
        highlight: '.performance-kpis',
        position: 'top'
      }
      // Additional steps...
    ]
  }
];

const mockCertifications: AdminCertification[] = [
  {
    id: 'system-administrator',
    name: 'System Administrator',
    description: 'Complete system setup and basic administration',
    requiredTutorials: ['company-setup-wizard', 'admin-dashboard-tutorial'],
    badgeIcon: '🛡️',
    unlockedFeatures: ['advanced-user-management', 'system-health-monitoring']
  },
  {
    id: 'advanced-admin',
    name: 'Advanced Administrator',
    description: 'Master all administrative functions',
    requiredTutorials: ['company-setup-wizard', 'admin-dashboard-tutorial', 'user-management-tutorial', 'advanced-analytics-tutorial'],
    badgeIcon: '👑',
    unlockedFeatures: ['advanced-analytics', 'custom-integrations', 'enterprise-features']
  }
];

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [availableTutorials] = useState<Tutorial[]>(adminTutorials);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress[]>([]);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [certifications] = useState<AdminCertification[]>(mockCertifications);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const { user } = useAuth();
  const { language } = useLanguage();

  const startTutorial = (tutorialId: string) => {
    const tutorial = availableTutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      setActiveTutorial(tutorial);
      setCurrentStep(0);
      setIsActive(true);
      setStartTime(new Date());
      
      // Create or update progress
      const existingProgress = tutorialProgress.find(p => p.tutorialId === tutorialId);
      if (!existingProgress) {
        const newProgress: TutorialProgress = {
          tutorialId,
          userId: user?.id || '',
          currentStep: 0,
          completed: false,
          startedAt: new Date(),
          timeSpent: 0
        };
        setTutorialProgress(prev => [...prev, newProgress]);
      }
    }
  };

  const nextStep = () => {
    if (activeTutorial && currentStep < activeTutorial.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      updateProgress();
    } else if (activeTutorial && currentStep === activeTutorial.steps.length - 1) {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      updateProgress();
    }
  };

  const skipTutorial = () => {
    setActiveTutorial(null);
    setIsActive(false);
    setCurrentStep(0);
    setStartTime(null);
  };

  const completeTutorial = () => {
    if (activeTutorial) {
      setCompletedTutorials(prev => [...prev, activeTutorial.id]);
      updateProgress(true);
      setActiveTutorial(null);
      setIsActive(false);
      setCurrentStep(0);
      setStartTime(null);
    }
  };

  const pauseTutorial = () => {
    setIsActive(false);
    updateProgress();
  };

  const resumeTutorial = () => {
    setIsActive(true);
  };

  const updateProgress = (completed = false) => {
    if (activeTutorial && startTime) {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      
      setTutorialProgress(prev => prev.map(progress => 
        progress.tutorialId === activeTutorial.id
          ? {
              ...progress,
              currentStep,
              completed,
              completedAt: completed ? new Date() : undefined,
              timeSpent
            }
          : progress
      ));
    }
  };

  const getTutorialProgress = (tutorialId: string): TutorialProgress | null => {
    return tutorialProgress.find(p => p.tutorialId === tutorialId) || null;
  };

  const isTutorialCompleted = (tutorialId: string): boolean => {
    return completedTutorials.includes(tutorialId);
  };

  const getCompletionPercentage = (): number => {
    if (availableTutorials.length === 0) return 0;
    return Math.round((completedTutorials.length / availableTutorials.length) * 100);
  };

  const getUnlockedFeatures = (): string[] => {
    const unlockedFeatures: string[] = [];
    
    certifications.forEach(cert => {
      const hasAllRequiredTutorials = cert.requiredTutorials.every(tutorialId => 
        completedTutorials.includes(tutorialId)
      );
      
      if (hasAllRequiredTutorials) {
        unlockedFeatures.push(...cert.unlockedFeatures);
      }
    });
    
    return [...new Set(unlockedFeatures)];
  };

  return (
    <TutorialContext.Provider value={{
      availableTutorials,
      activeTutorial,
      currentStep,
      isActive,
      tutorialProgress,
      completedTutorials,
      certifications,
      startTutorial,
      nextStep,
      prevStep,
      skipTutorial,
      completeTutorial,
      pauseTutorial,
      resumeTutorial,
      getTutorialProgress,
      isTutorialCompleted,
      getCompletionPercentage,
      getUnlockedFeatures
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}