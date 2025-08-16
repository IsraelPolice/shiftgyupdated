import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavigation from './DashboardNavigation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DashboardLayout() {
  const { isRTL } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <DashboardNavigation />
      
      <main className="flex-1 w-full pt-16">
        <div className="px-4 sm:px-6 lg:px-8 relative z-10">
            <Outlet />
        </div>
      </main>
    </div>
  );
}