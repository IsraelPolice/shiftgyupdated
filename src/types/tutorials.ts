export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  highlight?: string;
  interactive?: boolean;
  action?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  showNext?: boolean;
  showPrev?: boolean;
  showSkip?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  category: 'setup' | 'management' | 'analytics' | 'billing' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
  prerequisites?: string[];
  completionRewards?: string[];
}

export interface TutorialProgress {
  tutorialId: string;
  userId: string;
  currentStep: number;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
}

export interface AdminCertification {
  id: string;
  name: string;
  description: string;
  requiredTutorials: string[];
  badgeIcon: string;
  unlockedFeatures: string[];
}

// Admin Tutorial Categories
export const ADMIN_TUTORIAL_CATEGORIES = {
  SETUP: 'setup',
  MANAGEMENT: 'management', 
  ANALYTICS: 'analytics',
  BILLING: 'billing',
  ADVANCED: 'advanced'
} as const;

// Tutorial Difficulty Levels
export const TUTORIAL_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;