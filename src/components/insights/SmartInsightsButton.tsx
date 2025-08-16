import React, { useState, useEffect } from 'react';
import { Brain, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SmartInsightsButtonProps {
  onClick: () => void;
  hasNewInsights?: boolean;
  insightCount?: number;
}

const SmartInsightsButton: React.FC<SmartInsightsButtonProps> = ({ 
  onClick, 
  hasNewInsights = true, 
  insightCount = 3 
}) => {
  const { language } = useLanguage();
  const [isPulsing, setIsPulsing] = useState(hasNewInsights);

  useEffect(() => {
    setIsPulsing(hasNewInsights);
  }, [hasNewInsights]);

  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium 
        transition-all duration-300 hover:shadow-lg transform hover:scale-105
        ${hasNewInsights 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }
        ${isPulsing ? 'animate-pulse-ring' : ''}
      `}
      aria-label={language === 'he' ? 'תובנות חכמות' : 'Smart Insights'}
    >
      {/* Icon with animation */}
      <div className="relative">
        <Brain className={`w-4 h-4 mr-2 ${hasNewInsights ? 'text-white' : 'text-blue-600'}`} />
        {hasNewInsights && (
          <div className="absolute -top-1 -right-1">
            <Zap className="w-3 h-3 text-yellow-300 animate-bounce" />
          </div>
        )}
      </div>

      {/* Text */}
      <span className="hidden sm:inline">
        {language === 'he' ? 'תובנות חכמות' : 'Smart Insights'}
      </span>

      {/* Badge */}
      {hasNewInsights && insightCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
          {insightCount}
        </span>
      )}

      {/* Pulse ring effect */}
      {hasNewInsights && (
        <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-20 animate-ping"></div>
      )}
    </button>
  );
};

export default SmartInsightsButton;