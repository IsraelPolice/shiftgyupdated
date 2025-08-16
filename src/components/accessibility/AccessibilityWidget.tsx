import React, { useState, useEffect } from 'react';
import { Accessibility, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AccessibilityWidgetProps {
  onClose: () => void;
}

export default function AccessibilityWidget({ onClose }: AccessibilityWidgetProps) {
  const { t, language } = useLanguage();
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  
  const toggleOption = (option: string) => {
    setActiveOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };
  
  // Apply accessibility options to the document
  useEffect(() => {
    // High contrast
    if (activeOptions.includes('high-contrast')) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Large text
    if (activeOptions.includes('large-text')) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    // Highlight links
    if (activeOptions.includes('highlight-links')) {
      document.documentElement.classList.add('highlight-links');
    } else {
      document.documentElement.classList.remove('highlight-links');
    }
    
    // Dyslexia-friendly font
    if (activeOptions.includes('dyslexia-font')) {
      document.documentElement.classList.add('dyslexia-font');
    } else {
      document.documentElement.classList.remove('dyslexia-font');
    }
    
    // Reduce motion
    if (activeOptions.includes('reduce-motion')) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [activeOptions]);
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          <h3 className="font-medium">{language === 'he' ? 'נגישות' : 'Accessibility'}</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors"
          aria-label={language === 'he' ? 'סגור תפריט נגישות' : 'Close accessibility menu'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOptions.includes('high-contrast')}
              onChange={() => toggleOption('high-contrast')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{language === 'he' ? 'ניגודיות גבוהה' : 'High Contrast'}</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOptions.includes('large-text')}
              onChange={() => toggleOption('large-text')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{language === 'he' ? 'טקסט גדול' : 'Large Text'}</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOptions.includes('highlight-links')}
              onChange={() => toggleOption('highlight-links')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{language === 'he' ? 'הדגשת קישורים' : 'Highlight Links'}</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOptions.includes('dyslexia-font')}
              onChange={() => toggleOption('dyslexia-font')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{language === 'he' ? 'גופן ידידותי לדיסלקציה' : 'Dyslexia-Friendly Font'}</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOptions.includes('reduce-motion')}
              onChange={() => toggleOption('reduce-motion')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm">{language === 'he' ? 'הפחתת תנועה' : 'Reduce Motion'}</span>
          </label>
        </div>
        
        <div className="pt-2 mt-2 border-t border-gray-200 text-xs text-gray-500">
          {language === 'he' 
            ? 'בהתאם לתקנות נגישות לשירותי אינטרנט בישראל' 
            : 'Compliant with Israeli accessibility standards'}
        </div>
      </div>
    </div>
  );
}