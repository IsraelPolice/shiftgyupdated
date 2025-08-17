import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Bell,
  Globe,
  X,
  Shield,
  TrendingUp,
  MapPin,
  Settings,
  User,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

// Footer Component
const Footer = () => {
  const { language, t } = useLanguage();
  
  const footerItems = [
    { label: t('dashboard.accessibility'), href: '/accessibility' },
    { label: t('dashboard.about'), href: '/about' },
    { label: t('dashboard.terms'), href: '/terms' },
    { label: t('dashboard.privacy'), href: '/privacy' },
    { label: t('dashboard.contact'), href: '/contact' }
  ];
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          {footerItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

// Clock In/Out Widget Component
const ClockInOutWidget = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [shiftTime, setShiftTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSignedIn) {
      interval = setInterval(() => {
        setShiftTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSignedIn]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignedIn(!isSignedIn);
      if (!isSignedIn) {
        setShiftTime(0);
      }
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="sticky top-5 mb-6 flex flex-col items-center">
      {/* Main Clock Widget */}
      <div 
        onClick={handleClockToggle}
        className={`
          relative w-36 h-36 rounded-full cursor-pointer
          transform transition-all duration-300 ease-in-out
          hover:scale-105 active:scale-95
          ${isSignedIn 
            ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200' 
            : 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-200'
          }
          shadow-2xl hover:shadow-3xl
          ${isAnimating ? 'animate-pulse' : ''}
          border-4 border-white
        `}
      >
        {/* Animated Ring */}
        <div className={`
          absolute inset-0 rounded-full border-4 border-dashed
          ${isSignedIn ? 'border-red-300' : 'border-green-300'}
          animate-spin-slow opacity-30
        `} />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          {/* Clock Icon with Animation */}
          <div className={`
            transition-transform duration-300
            ${isAnimating ? 'rotate-180' : 'rotate-0'}
          `}>
            <Clock className="w-10 h-10 mb-2 drop-shadow-lg" />
          </div>
          
          {/* Main Text */}
          <span className="text-lg font-bold tracking-wide drop-shadow-lg">
            {isSignedIn ? t('dashboard.sign_out') : t('dashboard.sign_in')}
          </span>
          
          {/* Timer Display */}
          {isSignedIn && (
            <div className="mt-2 text-center animate-fade-in">
              <div className="text-xs opacity-80">{t('dashboard.shift_time')}</div>
              <div className="text-sm font-mono font-bold">
                {formatTime(shiftTime)}
              </div>
            </div>
          )}
        </div>
        
        {/* Pulse Effect for Active State */}
        {isSignedIn && (
          <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping" />
        )}
      </div>
      
      {/* Status Indicator */}
      <div className={`
        mt-3 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-300
        ${isSignedIn 
          ? 'bg-red-50 text-red-700 border border-red-200' 
          : 'bg-green-50 text-green-700 border border-green-200'
        }
      `}>
        {isSignedIn ? `🔴 ${t('dashboard.currently_working')}` : `🟢 ${t('dashboard.ready_to_start')}`}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const { user, currentCompany } = useAuth();
  const { language, isRTL, t } = useLanguage();
  const navigate = useNavigate();
  
  // Real company data - start with empty state for new companies
  const [companyData, setCompanyData] = useState({
    activeDepartments: 0,
    totalEmployees: 0,
    activeShifts: 0,
    attendanceRate: 0,
    pendingApprovals: 0,
    criticalDepartments: 0,
    needAttentionDepartments: 0,
    onDutyStaff: 0,
    coverageRate: 0
  });
  
  // Load real company data
  useEffect(() => {
    if (currentCompany) {
      // In a real app, this would fetch data from Firestore
      // For now, check if this is a new company (created today)
      const isNewCompany = currentCompany.createdAt && 
        new Date(currentCompany.createdAt).toDateString() === new Date().toDateString();
      
      if (isNewCompany) {
        // Show empty state for new companies
        setCompanyData({
          activeDepartments: 0, // No departments initially
          totalEmployees: 1, // Just the admin user
          activeShifts: 0,
          attendanceRate: 0,
          pendingApprovals: 0,
          criticalDepartments: 0,
          needAttentionDepartments: 0,
          onDutyStaff: 0,
          coverageRate: 0
        });
      } else if (currentCompany.id === 'company-1') {
        // Only show demo data for the specific demo company
        setCompanyData({
          activeDepartments: 4,
          totalEmployees: 247,
          activeShifts: 42,
          attendanceRate: 94.2,
          pendingApprovals: 7,
          criticalDepartments: 2,
          needAttentionDepartments: 3,
          onDutyStaff: 89,
          coverageRate: 87
        });
      } else {
        // All other companies start empty
        setCompanyData({
          activeDepartments: 0,
          totalEmployees: 1,
          activeShifts: 0,
          attendanceRate: 0,
          pendingApprovals: 0,
          criticalDepartments: 0,
          needAttentionDepartments: 0,
          onDutyStaff: 0,
          coverageRate: 0
        });
      }
    }
  }, [currentCompany]);

  // Stats data with proper text labels
  const statsData = [
    {
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      value: companyData.activeDepartments,
      label: language === 'he' ? 'מחלקות פעילות' : 'Active Departments',
      color: 'blue'
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      value: companyData.totalEmployees,
      label: language === 'he' ? 'סך עובדים' : 'Total Employees',
      color: 'green'
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      value: companyData.activeShifts,
      label: language === 'he' ? 'משמרות פעילות' : 'Active Shifts',
      color: 'purple'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      value: companyData.attendanceRate > 0 ? `${companyData.attendanceRate}%` : '0%',
      label: language === 'he' ? 'שיעור נוכחות' : 'Attendance Rate',
      color: 'orange'
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      value: companyData.pendingApprovals,
      label: language === 'he' ? 'אישורים ממתינים' : 'Pending Approvals',
      color: 'red'
    }
  ];

  // Check if this is a new company
  const isNewCompany = currentCompany?.createdAt && 
    new Date(currentCompany.createdAt).toDateString() === new Date().toDateString();
  
  // Show different department data based on company
  const departments = currentCompany?.id === 'company-1' ? [
    { 
      name: language === 'he' ? 'מכירות' : 'Sales', 
      manager: 'Sarah Johnson', 
      staff: '8/10', 
      status: 'warning', 
      issues: [language === 'he' ? '2 עובדים מאחרים' : '2 employees late'],
      borderColor: 'border-yellow-400'
    },
    { 
      name: language === 'he' ? 'תפעול' : 'Operations', 
      manager: 'Michael Chen', 
      staff: '12/12', 
      status: 'good', 
      issues: [],
      borderColor: 'border-green-400'
    },
    { 
      name: language === 'he' ? 'שירות לקוחות' : 'Customer Service', 
      manager: 'Emily Davis', 
      staff: '6/8', 
      status: 'warning', 
      issues: [language === 'he' ? 'חסר כוח אדם' : 'Understaffed'],
      borderColor: 'border-yellow-400'
    },
    { 
      name: language === 'he' ? 'אבטחה' : 'Security', 
      manager: 'Alex Thompson', 
      staff: '4/6', 
      status: 'critical', 
      issues: [
        language === 'he' ? 'נדרש מנהל' : 'Manager needed', 
        language === 'he' ? 'פער בכיסוי' : 'Coverage gap'
      ],
      borderColor: 'border-red-400'
    }
  ] : [];

  const attendanceData = isNewCompany ? [
    { day: language === 'he' ? 'ב' : 'Mon', rate: 0 },
    { day: language === 'he' ? 'ג' : 'Tue', rate: 0 },
    { day: language === 'he' ? 'ד' : 'Wed', rate: 0 },
    { day: language === 'he' ? 'ה' : 'Thu', rate: 0 },
    { day: language === 'he' ? 'ו' : 'Fri', rate: 0 },
    { day: language === 'he' ? 'ש' : 'Sat', rate: 0 },
    { day: language === 'he' ? 'א' : 'Sun', rate: 0 }
  ] : currentCompany?.id === 'company-1' ? [
    { day: language === 'he' ? 'ב' : 'Mon', rate: 96 },
    { day: language === 'he' ? 'ג' : 'Tue', rate: 94 },
    { day: language === 'he' ? 'ד' : 'Wed', rate: 98 },
    { day: language === 'he' ? 'ה' : 'Thu', rate: 92 },
    { day: language === 'he' ? 'ו' : 'Fri', rate: 95 },
    { day: language === 'he' ? 'ש' : 'Sat', rate: 89 },
    { day: language === 'he' ? 'א' : 'Sun', rate: 91 }
  ] : [
    { day: language === 'he' ? 'ב' : 'Mon', rate: 0 },
    { day: language === 'he' ? 'ג' : 'Tue', rate: 0 },
    { day: language === 'he' ? 'ד' : 'Wed', rate: 0 },
    { day: language === 'he' ? 'ה' : 'Thu', rate: 0 },
    { day: language === 'he' ? 'ו' : 'Fri', rate: 0 },
    { day: language === 'he' ? 'ש' : 'Sat', rate: 0 },
    { day: language === 'he' ? 'א' : 'Sun', rate: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'empty': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'critical': return 'bg-red-50 border-red-200';
      case 'empty': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Calculate department counts for alerts
  const criticalDepartments = departments.filter(dept => dept.status === 'critical').length;
  const needAttentionDepartments = departments.filter(dept => dept.status === 'warning').length;

  // Get user's first name for welcome message
  const getFirstName = () => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
  };

  // Get user's full name for welcome message
  const getFullName = () => {
    return user?.name || '';
  };

  // Calculate current week range for navigation
  const getCurrentWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return {
      start: startOfWeek.toISOString().split('T')[0], // YYYY-MM-DD format
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  // Navigation handlers for alerts
  const handleCriticalDepartmentsClick = () => {
    navigate('/schedules?filter=critical&view=departments');
  };

  const handleAttentionDepartmentsClick = () => {
    navigate('/schedules?filter=warning&view=departments');
  };

  const handlePendingApprovalsClick = () => {
    navigate('/schedules?view=approvals');
  };

  // Navigation handlers for dashboard tiles
  const handleActiveDepartmentsClick = () => {
    navigate('/departments');
  };

  const handleTotalEmployeesClick = () => {
    navigate('/employees');
  };

  const handleActiveShiftsClick = () => {
    const weekRange = getCurrentWeekRange();
    navigate(`/schedules?startDate=${weekRange.start}&endDate=${weekRange.end}&view=week`);
  };

  const handleAttendanceRateClick = () => {
    navigate('/reports?tab=attendance');
  };

  const handlePendingApprovalsStatsClick = () => {
    navigate('/schedules?view=approvals&filter=pending');
  };
  
  // Show welcome message for new companies
  if (isNewCompany) {
    return (
      <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Welcome Message for New Company */}
        <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {language === 'he' 
                ? `ברוכים הבאים ל-ShiftGY, ${currentCompany?.name}!`
                : `Welcome to ShiftGY, ${currentCompany?.name}!`
              }
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {language === 'he' 
                ? 'המערכת שלך מוכנה! בואו נתחיל להגדיר את הארגון שלך'
                : 'Your system is ready! Let\'s start setting up your organization'
              }
            </p>
          </div>
        </div>

        {/* Getting Started Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'he' ? 'בואו נתחיל' : 'Let\'s Get Started'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'he' 
                ? 'בצע את השלבים הבאים כדי להגדיר את המערכת שלך'
                : 'Follow these steps to set up your system'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Add Employees */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'he' ? '1. הוסף עובדים' : '1. Add Employees'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'he' 
                  ? 'התחל על ידי הוספת חברי הצוות שלך למערכת'
                  : 'Start by adding your team members to the system'
                }
              </p>
              <button
                onClick={() => navigate('/employees')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {language === 'he' ? 'הוסף עובדים' : 'Add Employees'}
                <Users className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Step 2: Create Schedules */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'he' ? '2. צור משמרות' : '2. Create Schedules'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'he' 
                  ? 'הגדר משמרות ולוחות זמנים לצוות שלך'
                  : 'Set up shifts and schedules for your team'
                }
              </p>
              <button
                onClick={() => navigate('/schedules')}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {language === 'he' ? 'צור משמרות' : 'Create Schedules'}
                <Calendar className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Step 3: Configure Settings */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'he' ? '3. הגדר את המערכת' : '3. Configure System'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'he' 
                  ? 'התאם את ההגדרות לצרכי הארגון שלך'
                  : 'Customize settings for your organization'
                }
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                {language === 'he' ? 'הגדרות' : 'Settings'}
                <Settings className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Quick Stats for New Company */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {language === 'he' ? 'סטטוס הארגון' : 'Organization Status'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">{language === 'he' ? 'מחלקות' : 'Departments'}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">{language === 'he' ? 'עובדים' : 'Employees'}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">{language === 'he' ? 'משמרות' : 'Shifts'}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {language === 'he' ? 'מוכן' : 'Ready'}
                </p>
                <p className="text-sm text-gray-600">{language === 'he' ? 'להתחלה' : 'to Start'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome Message Section */}
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-2">
            {language === 'he' 
              ? `ברוך שובך ${getFullName()}`
              : `Welcome back ${getFullName()}`
            }
          </h1>
          <p className="text-blue-100 text-lg">
            {language === 'he' 
              ? 'הנה מה שקורה עם הצוות שלך היום'
              : 'Here\'s what\'s happening with your team today'
            }
          </p>
        </div>
      </div>

      {/* System Alerts Section */}
      {(criticalDepartments > 0 || needAttentionDepartments > 0 || companyData.pendingApprovals > 0) && (
        <div className="bg-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-1 text-sm font-medium">
                <span className="text-white">
                  {language === 'he' ? 'דחוף:' : 'URGENT:'}
                </span>
                
                {criticalDepartments > 0 && (
                  <>
                    <button
                      onClick={handleCriticalDepartmentsClick}
                      className="text-white underline hover:text-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-1"
                      aria-label={language === 'he' ? 'עבור לניהול מחלקות חסרות כוח אדם' : 'Go to critically understaffed departments'}
                    >
                      {language === 'he' 
                        ? `${criticalDepartments} מחלקות חסרות כוח אדם קריטי`
                        : `${criticalDepartments} departments critically understaffed`
                      }
                    </button>
                    {(needAttentionDepartments > 0 || companyData.pendingApprovals > 0) && (
                      <span className="text-white mx-1">|</span>
                    )}
                  </>
                )}
                
                {needAttentionDepartments > 0 && (
                  <>
                    <button
                      onClick={handleAttentionDepartmentsClick}
                      className="text-white underline hover:text-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-1"
                      aria-label={language === 'he' ? 'עבור למחלקות הדורשות תשומת לב' : 'Go to departments needing attention'}
                    >
                      {language === 'he' 
                        ? `${needAttentionDepartments} מחלקות דורשות תשומת לב`
                        : `${needAttentionDepartments} departments need attention`
                      }
                    </button>
                    {companyData.pendingApprovals > 0 && (
                      <span className="text-white mx-1">|</span>
                    )}
                  </>
                )}
                
                {companyData.pendingApprovals > 0 && (
                  <button
                    onClick={handlePendingApprovalsClick}
                    className="text-white underline hover:text-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-1"
                    aria-label={language === 'he' ? 'עבור לתור האישורים' : 'Go to pending approvals queue'}
                  >
                    {language === 'he' 
                      ? `${companyData.pendingApprovals} אישורים ממתינים`
                      : `${companyData.pendingApprovals} pending approvals`
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Active Departments - Clickable */}
          <button
            onClick={handleActiveDepartmentsClick}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
            aria-label={language === 'he' ? 'עבור לעמוד מחלקות' : 'Go to departments page'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{language === 'he' ? 'מחלקות פעילות' : 'Active Departments'}</p>
              </div>
            </div>
          </button>

          {/* Total Employees - Clickable */}
          <button
            onClick={handleTotalEmployeesClick}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
            aria-label={language === 'he' ? 'עבור לעמוד עובדים' : 'Go to employees page'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{language === 'he' ? 'סך עובדים' : 'Total Employees'}</p>
              </div>
            </div>
          </button>

          {/* Active Shifts - Clickable */}
          <button
            onClick={handleActiveShiftsClick}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
            aria-label={language === 'he' ? 'עבור לעמוד משמרות - שבוע נוכחי' : 'Go to schedules page - current week'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{language === 'he' ? 'משמרות פעילות' : 'Active Shifts'}</p>
              </div>
            </div>
          </button>

          {/* Attendance Rate - Clickable */}
          <button
            onClick={handleAttendanceRateClick}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
            aria-label={language === 'he' ? 'עבור לדוחות נוכחות' : 'Go to attendance reports'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{language === 'he' ? 'שיעור נוכחות' : 'Attendance Rate'}</p>
              </div>
            </div>
          </button>

          {/* Pending Approvals - Clickable */}
          <button
            onClick={handlePendingApprovalsStatsClick}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
            aria-label={language === 'he' ? 'עבור לתור האישורים' : 'Go to pending approvals queue'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{language === 'he' ? 'אישורים ממתינים' : 'Pending Approvals'}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area (3 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Overview Cards */}
          <div className="lg:col-span-4 space-y-6 lg:order-1">
            {/* Organization Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'סקירת ארגון' : 'Organization Overview'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{language === 'he' ? 'מחלקות פעילות' : 'Active Departments'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{language === 'he' ? 'צוות במשמרת' : 'On-Duty Staff'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{language === 'he' ? 'שיעור כיסוי' : 'Coverage Rate'}</span>
                  <span className="font-semibold text-green-600">0%</span>
                </div>
              </div>
            </div>

            {/* Attendance Heatmap */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'מפת חום נוכחות' : 'Attendance Heatmap'}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {attendanceData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day.day}</div>
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                        day.rate === 0 ? 'bg-gray-200 text-gray-500' :
                        day.rate >= 95 ? 'bg-green-500 text-white' :
                        day.rate >= 90 ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}
                    >
                      {day.rate === 0 ? '—' : day.rate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'סטטוס תאימות' : 'Compliance Status'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{language === 'he' ? 'תאימות כניסה' : 'Clock-in Compliance'}</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 font-medium">—</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{language === 'he' ? 'תאימות הפסקות' : 'Break Compliance'}</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 font-medium">—</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{language === 'he' ? 'התראות שעות נוספות' : 'Overtime Alerts'}</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 font-medium">{language === 'he' ? '0 פעילות' : '0 Active'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Departments Status */}
          <div className="lg:col-span-5 lg:order-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className={`text-lg font-semibold text-gray-900 dark:text-white mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'סטטוס מחלקות' : 'Departments Status'}
              </h3>
              {departments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'he' ? 'אין מחלקות עדיין' : 'No departments yet'}
                  </h4>
                  <p className="text-gray-500 mb-4">
                    {language === 'he' 
                      ? 'התחל על ידי יצירת המחלקות הראשונות שלך'
                      : 'Start by creating your first departments'
                    }
                  </p>
                  <button
                    onClick={() => navigate('/departments')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    {language === 'he' ? 'צור מחלקות' : 'Create Departments'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getStatusBg(dept.status)} ${
                      isRTL ? 'border-r-4' : 'border-l-4'
                    } ${dept.borderColor}`}>
                      <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(dept.status)}`} />
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <h4 className="font-medium text-gray-900 dark:text-white">{dept.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {language === 'he' ? `מנהל: ${dept.manager}` : `Manager: ${dept.manager}`}
                            </p>
                          </div>
                        </div>
                        <div className={isRTL ? 'text-left' : 'text-right'}>
                          <p className="font-semibold text-gray-900 dark:text-white">{dept.staff}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {language === 'he' ? 'צוות' : 'Staff'}
                          </p>
                        </div>
                      </div>
                      {dept.issues.length > 0 && (
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          {dept.issues.map((issue, idx) => (
                            <div key={idx} className={`text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                              {dept.status === 'empty' ? (
                                <Users className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Clock Widget & Actions (Left in RTL) */}
          <div className={`lg:col-span-3 space-y-6 ${isRTL ? 'lg:order-1' : 'lg:order-3'}`}>
            <ClockInOutWidget />

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'פעולות קריטיות נדרשות' : 'Critical Actions Needed'}
              </h3>
              <div className="space-y-3">
                {criticalDepartments > 0 || needAttentionDepartments > 0 || companyData.pendingApprovals > 0 ? (
                  <>
                    {criticalDepartments > 0 && (
                      <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">
                            {language === 'he' ? 'מחלקת אבטחה' : 'Security Department'}
                          </span>
                        </div>
                        <p className="text-xs text-red-700 dark:text-red-300">
                          {language === 'he' ? 'נדרש מנהל מיד' : 'Manager needed immediately'}
                        </p>
                        <button 
                          className="mt-2 text-xs text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 font-medium underline"
                          onClick={() => navigate('/schedules')}
                          aria-label="Go to schedules page to take action"
                        >
                          {language === 'he' ? 'בצע פעולה ←' : 'Take Action →'}
                        </button>
                      </div>
                    )}
                    
                    {companyData.pendingApprovals > 0 && (
                      <div className={`p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            {language === 'he' ? 'אישורים ממתינים' : 'Pending Approvals'}
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          {language === 'he' ? 'בקשות חופשה ושינוי משמרות' : 'Time-off and shift requests'}
                        </p>
                        <button 
                          className="mt-2 text-xs text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium underline"
                          onClick={() => navigate('/schedules')}
                          aria-label="Go to schedules page to review pending approvals"
                        >
                          {language === 'he' ? 'בדוק עכשיו ←' : 'Review Now →'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`p-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'he' ? 'הכל נראה טוב!' : 'Everything looks good!'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'he' 
                        ? 'אין פעולות קריטיות נדרשות כרגע'
                        : 'No critical actions needed right now'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}