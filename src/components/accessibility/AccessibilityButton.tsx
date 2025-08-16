import React from 'react';
import { Accessibility } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AccessibilityButtonProps {
  onClick: () => void;
}

export default function AccessibilityButton({ onClick }: AccessibilityButtonProps) {
  const { language } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 z-50 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label={language === 'he' ? 'פתח תפריט נגישות' : 'Open accessibility menu'}
    >
      <Accessibility className="w-6 h-6" />
    </button>
  );
}