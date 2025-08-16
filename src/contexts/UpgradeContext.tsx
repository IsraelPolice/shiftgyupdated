import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FeatureTrial {
  featureId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  warningShown: boolean;
}

export interface FeatureSubscription {
  featureId: string;
  isSubscribed: boolean;
  subscriptionDate?: Date;
  nextBillingDate?: Date;
  pricePerEmployee: number;
}

export interface AdvancedFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  pricePerEmployee: number;
  isEnabled: boolean;
  hasAccess: boolean;
  trial?: FeatureTrial;
  subscription?: FeatureSubscription;
  marketingCopy: {
    headline: string;
    subheadline: string;
    description: string;
    benefits: string[];
    valueProposition: string;
    screenshots?: string[];
  };
}

interface UpgradeContextType {
  features: AdvancedFeature[];
  startTrial: (featureId: string) => Promise<void>;
  cancelTrial: (featureId: string) => Promise<void>;
  subscribe: (featureId: string) => Promise<void>;
  unsubscribe: (featureId: string) => Promise<void>;
  getFeature: (featureId: string) => AdvancedFeature | undefined;
  hasFeatureAccess: (featureId: string) => boolean;
  getTrialDaysRemaining: (featureId: string) => number;
  calculateProRatedPrice: (featureId: string, employeeCount: number) => number;
  getUpcomingCharges: () => { featureId: string; amount: number; date: Date }[];
  showFeatureModal: (featureId: string) => void;
  hideFeatureModal: () => void;
  activeModal: string | null;
}

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined);

// Mock data for advanced features
const initialFeatures: AdvancedFeature[] = [
  {
    id: 'surveys',
    name: 'Employee Surveys',
    description: 'Create and manage employee satisfaction surveys, feedback forms, and engagement tracking',
    icon: 'MessageSquare',
    pricePerEmployee: 1.00,
    isEnabled: false,
    hasAccess: false,
    marketingCopy: {
      headline: 'Surveys & Feedback',
      subheadline: 'Unlock advanced workforce insights',
      description: 'Turn employee feedback into actionable insights. Create targeted surveys, gather real-time responses, and build a happier, more engaged workforce.',
      benefits: [
        'Gather employee feedback instantly',
        'Improve job satisfaction scores',
        'Make data-driven decisions',
        'Boost team engagement by 40%'
      ],
      valueProposition: 'Join 1,000+ managers who improve team satisfaction with Surveys',
      screenshots: [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    }
  },
  {
    id: 'tasks',
    name: 'Task Management',
    description: 'Assign tasks, track progress, and manage team productivity with advanced task workflows',
    icon: 'CheckSquare',
    pricePerEmployee: 1.50,
    isEnabled: false,
    hasAccess: false,
    marketingCopy: {
      headline: 'Task Management',
      subheadline: 'Transform your shift operations',
      description: 'Transform your shift management with intelligent task assignment. Ensure nothing falls through the cracks while boosting team accountability and productivity.',
      benefits: [
        'Assign tasks to shifts seamlessly',
        'Track completion in real-time',
        'Boost team productivity by 35%',
        'Never miss critical operations'
      ],
      valueProposition: 'Join 1,000+ managers who streamline operations with Tasks',
      screenshots: [
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    }
  },
  {
    id: 'presence',
    name: 'Presence Tracking',
    description: 'Advanced clock in/out tracking, location monitoring, and attendance analytics',
    icon: 'Clock',
    pricePerEmployee: 2.00,
    isEnabled: true, // Already enabled in demo
    hasAccess: true,
    marketingCopy: {
      headline: 'Presence Tracking',
      subheadline: 'Advanced attendance management',
      description: 'Monitor employee attendance with precision. Track clock in/out times, locations, and generate detailed attendance reports.',
      benefits: [
        'GPS location tracking',
        'Automated attendance reports',
        'Reduce time theft by 25%',
        'Streamline payroll processing'
      ],
      valueProposition: 'Join 1,000+ managers who optimize attendance with Presence Tracking'
    }
  },
  {
    id: 'breaks',
    name: 'Break Management',
    description: 'Automated break scheduling, compliance tracking, and break optimization',
    icon: 'Coffee',
    pricePerEmployee: 1.25,
    isEnabled: true, // Already enabled in demo
    hasAccess: true,
    marketingCopy: {
      headline: 'Break Management',
      subheadline: 'Optimize break scheduling',
      description: 'Automate break scheduling and ensure compliance. Optimize staff coverage while maintaining employee satisfaction.',
      benefits: [
        'Automated break scheduling',
        'Ensure labor law compliance',
        'Optimize staff coverage',
        'Improve employee satisfaction'
      ],
      valueProposition: 'Join 1,000+ managers who optimize breaks with Break Management'
    }
  },
  {
    id: 'advanced_reports',
    name: 'Advanced Reporting',
    description: 'Custom report builder, scheduled reports, and advanced analytics dashboards',
    icon: 'BarChart3',
    pricePerEmployee: 2.50,
    isEnabled: false,
    hasAccess: false,
    marketingCopy: {
      headline: 'Advanced Reporting',
      subheadline: 'Unlock powerful analytics',
      description: 'Create custom reports and gain deep insights into your workforce. Make informed decisions with advanced analytics and automated reporting.',
      benefits: [
        'Custom report builder',
        'Automated report scheduling',
        'Advanced analytics dashboards',
        'Export to multiple formats'
      ],
      valueProposition: 'Join 1,000+ managers who make data-driven decisions with Advanced Reporting'
    }
  }
];

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<AdvancedFeature[]>(initialFeatures);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const startTrial = async (featureId: string) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30-day trial

    setFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? {
              ...feature,
              isEnabled: true,
              hasAccess: true,
              trial: {
                featureId,
                startDate,
                endDate,
                isActive: true,
                warningShown: false
              }
            }
          : feature
      )
    );
    setActiveModal(null);
  };

  const cancelTrial = async (featureId: string) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? {
              ...feature,
              isEnabled: false,
              hasAccess: false,
              trial: undefined
            }
          : feature
      )
    );
  };

  const subscribe = async (featureId: string) => {
    const subscriptionDate = new Date();
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    setFeatures(prev => 
      prev.map(f => 
        f.id === featureId 
          ? {
              ...f,
              isEnabled: true,
              hasAccess: true,
              trial: undefined, // Remove trial when subscribing
              subscription: {
                featureId,
                isSubscribed: true,
                subscriptionDate,
                nextBillingDate,
                pricePerEmployee: feature.pricePerEmployee
              }
            }
          : f
      )
    );
    setActiveModal(null);
  };

  const unsubscribe = async (featureId: string) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? {
              ...feature,
              isEnabled: false,
              hasAccess: false,
              subscription: undefined
            }
          : feature
      )
    );
  };

  const getFeature = (featureId: string): AdvancedFeature | undefined => {
    return features.find(f => f.id === featureId);
  };

  const hasFeatureAccess = (featureId: string): boolean => {
    const feature = getFeature(featureId);
    return feature?.hasAccess || false;
  };

  const getTrialDaysRemaining = (featureId: string): number => {
    const feature = getFeature(featureId);
    if (!feature?.trial?.isActive) return 0;

    const now = new Date();
    const endDate = new Date(feature.trial.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const calculateProRatedPrice = (featureId: string, employeeCount: number): number => {
    const feature = getFeature(featureId);
    if (!feature) return 0;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate() + 1;
    
    const fullPrice = feature.pricePerEmployee * employeeCount;
    const proRatedPrice = (daysRemaining / daysInMonth) * fullPrice;
    
    return Math.round(proRatedPrice * 100) / 100; // Round to 2 decimal places
  };

  const getUpcomingCharges = (): { featureId: string; amount: number; date: Date }[] => {
    const employeeCount = 62; // Mock employee count
    
    return features
      .filter(f => f.subscription?.isSubscribed)
      .map(f => ({
        featureId: f.id,
        amount: f.pricePerEmployee * employeeCount,
        date: f.subscription!.nextBillingDate!
      }));
  };

  const showFeatureModal = (featureId: string) => {
    setActiveModal(featureId);
  };

  const hideFeatureModal = () => {
    setActiveModal(null);
  };
  return (
    <UpgradeContext.Provider value={{
      features,
      startTrial,
      cancelTrial,
      subscribe,
      unsubscribe,
      getFeature,
      hasFeatureAccess,
      getTrialDaysRemaining,
      calculateProRatedPrice,
      getUpcomingCharges,
      showFeatureModal,
      hideFeatureModal,
      activeModal
    }}>
      {children}
    </UpgradeContext.Provider>
  );
}

export function useUpgrade() {
  const context = useContext(UpgradeContext);
  if (context === undefined) {
    throw new Error('useUpgrade must be used within an UpgradeProvider');
  }
  return context;
}