import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  isWidgetVisible: boolean;
  showWidget: () => void;
  hideWidget: () => void;
  toggleWidget: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  
  // Check session storage on mount
  useEffect(() => {
    const storedVisibility = sessionStorage.getItem('accessibilityWidgetVisible');
    if (storedVisibility !== null) {
      setIsWidgetVisible(storedVisibility === 'true');
    }
  }, []);
  
  // Update session storage when visibility changes
  useEffect(() => {
    sessionStorage.setItem('accessibilityWidgetVisible', isWidgetVisible.toString());
  }, [isWidgetVisible]);
  
  const showWidget = () => setIsWidgetVisible(true);
  const hideWidget = () => setIsWidgetVisible(false);
  const toggleWidget = () => setIsWidgetVisible(prev => !prev);
  
  return (
    <AccessibilityContext.Provider value={{
      isWidgetVisible,
      showWidget,
      hideWidget,
      toggleWidget
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}