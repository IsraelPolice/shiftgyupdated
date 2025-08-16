import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Tasks() {
  const { language, isRTL } = useLanguage();

  return (
    <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'he' ? 'משימות' : 'Tasks'}
          </h1>
          <p className="text-gray-600">
            {language === 'he' ? 'נהל משימות וביצועים' : 'Manage tasks and performance'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500 text-center py-8">
            {language === 'he' ? 'ממשק המשימות יטען כאן' : 'Tasks interface will load here'}
          </p>
        </div>
      </div>
    </div>
  );
}