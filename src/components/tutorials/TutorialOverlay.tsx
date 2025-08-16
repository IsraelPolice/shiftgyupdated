import React, { useEffect, useState } from 'react';
import { X, ArrowRight, ArrowLeft, Play, CheckCircle, Clock, Target } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TutorialOverlay() {
  const {
    activeTutorial,
    currentStep,
    isActive,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial
  } = useTutorial();
  
  const { language, isRTL } = useLanguage();
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive && activeTutorial) {
      const step = activeTutorial.steps[currentStep];
      if (step.highlight) {
        const element = document.querySelector(step.highlight) as HTMLElement;
        setHighlightElement(element);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.position = 'relative';
          element.style.zIndex = '1001';
          element.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.3), 0 0 0 8px rgba(79, 70, 229, 0.1)';
          element.style.borderRadius = '8px';
        }
      }
    }

    return () => {
      if (highlightElement) {
        highlightElement.style.position = '';
        highlightElement.style.zIndex = '';
        highlightElement.style.boxShadow = '';
        highlightElement.style.borderRadius = '';
      }
    };
  }, [isActive, activeTutorial, currentStep, highlightElement]);

  if (!isActive || !activeTutorial) return null;

  const step = activeTutorial.steps[currentStep];
  const isLastStep = currentStep === activeTutorial.steps.length - 1;
  const isFirstStep = currentStep === 0;

  const getTooltipPosition = () => {
    if (!highlightElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = highlightElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    
    let top = rect.bottom + 20;
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    
    // Adjust for screen boundaries
    if (left < 20) left = 20;
    if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20;
    if (top + tooltipHeight > window.innerHeight - 20) top = rect.top - tooltipHeight - 20;
    
    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-1000" />
      
      {/* Tutorial Tooltip */}
      <div
        className="fixed z-1002 bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm"
        style={getTooltipPosition()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-xs text-gray-500">
                  {language === 'he' ? `שלב ${currentStep + 1} מתוך ${activeTutorial.steps.length}` : `Step ${currentStep + 1} of ${activeTutorial.steps.length}`}
                </p>
              </div>
            </div>
            <button
              onClick={skipTutorial}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / activeTutorial.steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed mb-4">{step.content}</p>
          
          {step.interactive && step.action && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">{step.action}</span>
              </div>
            </div>
          )}
          
          {/* Tutorial Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activeTutorial.estimatedTime} {language === 'he' ? 'דקות' : 'min'}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>{activeTutorial.category}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isFirstStep
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {language === 'he' ? 'הקודם' : 'Previous'}
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={skipTutorial}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                {language === 'he' ? 'דלג' : 'Skip'}
              </button>
              
              <button
                onClick={isLastStep ? completeTutorial : nextStep}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {language === 'he' ? 'סיים' : 'Complete'}
                  </>
                ) : (
                  <>
                    {language === 'he' ? 'הבא' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}