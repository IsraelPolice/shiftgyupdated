import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign,
  TrendingUp,
  Building2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Reports() {
  const { language, isRTL } = useLanguage();
  const { currentCompany } = useAuth();
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Real company data - start with empty state for new companies
  const [reportsData, setReportsData] = useState({
    totalHours: 0,
    laborCost: 0,
    attendanceRate: 0,
    overtimeHours: 0,
    employeeCount: 0,
    departmentCount: 0,
    activeShifts: 0
  });

  // Load real company data
  useEffect(() => {
    if (currentCompany) {
      // Check if this is a new company (created today)
      const isNewCompany = currentCompany.createdAt && 
        new Date(currentCompany.createdAt).toDateString() === new Date().toDateString();
      
      if (isNewCompany || currentCompany.id !== 'company-1') {
        // Show empty state for new companies
        setReportsData({
          totalHours: 0,
          laborCost: 0,
          attendanceRate: 0,
          overtimeHours: 0,
          employeeCount: 1, // Just the admin user
          departmentCount: 1, // General department
          activeShifts: 0
        });
      } else {
        // Only show demo data for the specific demo company
        setReportsData({
          totalHours: 1247,
          laborCost: 23450,
          attendanceRate: 94.2,
          overtimeHours: 127,
          employeeCount: 8,
          departmentCount: 4,
          activeShifts: 42
        });
      }
      setIsLoading(false);
    }
  }, [currentCompany]);

  const isNewCompany = currentCompany?.createdAt && 
    new Date(currentCompany.createdAt).toDateString() === new Date().toDateString();

  return (
    <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'he' ? 'דוחות' : 'Reports'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'he' ? 'ניתוחים ותובנות על כוח העבודה שלך' : 'Analytics and insights for your workforce'}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                {language === 'he' ? 'רענן' : 'Refresh'}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                {language === 'he' ? 'ייצא' : 'Export'}
              </button>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-4 mb-6">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">{language === 'he' ? 'יומי' : 'Daily'}</option>
              <option value="weekly">{language === 'he' ? 'שבועי' : 'Weekly'}</option>
              <option value="monthly">{language === 'he' ? 'חודשי' : 'Monthly'}</option>
            </select>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{language === 'he' ? 'כל המחלקות' : 'All Departments'}</option>
              <option value="general">{language === 'he' ? 'כללי' : 'General'}</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{language === 'he' ? 'סך שעות' : 'Total Hours'}</p>
                <p className="text-3xl font-bold text-gray-900">{reportsData.totalHours.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    {reportsData.totalHours > 0 ? '+12%' : '0%'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{language === 'he' ? 'עלות עבודה' : 'Labor Cost'}</p>
                <p className="text-3xl font-bold text-gray-900">${reportsData.laborCost.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    {reportsData.laborCost > 0 ? '+8%' : '0%'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{language === 'he' ? 'שיעור נוכחות' : 'Attendance Rate'}</p>
                <p className="text-3xl font-bold text-gray-900">{reportsData.attendanceRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    {reportsData.attendanceRate > 0 ? '+5%' : '0%'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{language === 'he' ? 'שעות נוספות' : 'Overtime Hours'}</p>
                <p className="text-3xl font-bold text-gray-900">{reportsData.overtimeHours}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500 text-sm font-medium">
                    {reportsData.overtimeHours > 0 ? '+15%' : '0%'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {isNewCompany || reportsData.totalHours === 0 ? (
          /* Empty State for New Companies */
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'he' ? 'אין נתונים עדיין' : 'No Data Yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {language === 'he' 
                ? 'התחל להוסיף עובדים ולתזמן משמרות כדי לראות דוחות ותובנות'
                : 'Start adding employees and scheduling shifts to see reports and insights'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/employees'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                {language === 'he' ? 'הוסף עובדים' : 'Add Employees'}
              </button>
              <button
                onClick={() => window.location.href = '/schedules'}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {language === 'he' ? 'צור משמרות' : 'Create Schedules'}
              </button>
            </div>
          </div>
        ) : (
          /* Charts for companies with data */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'he' ? 'מגמת שעות חודשית' : 'Monthly Hours Trend'}
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                {language === 'he' ? 'גרף יוצג כאן' : 'Chart will be displayed here'}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'he' ? 'חלוקת שעות לפי מחלקות' : 'Department Hours Distribution'}
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                {language === 'he' ? 'גרף יוצג כאן' : 'Chart will be displayed here'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}