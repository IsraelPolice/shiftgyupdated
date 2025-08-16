import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield,
  Bell,
  Globe,
  ChevronDown,
  ChevronRight,
  Crown,
  Moon,
  Sun,
  User,
  LogOut,
  AlertTriangle,
  Clock,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAI } from '../../contexts/AIContext';

// MY TEAM Dropdown Component
const MyTeamDropdown = ({ isOpen, onClose, language }) => {
  const navigate = useNavigate();
  
  const menuItems = {
    he: [
      { label: 'עובדים', href: '/employees', icon: '👥' },
      { label: 'מחלקות', href: '/departments', icon: '🏢' }
    ],
    en: [
      { label: 'Employees', href: '/employees', icon: '👥' },
      { label: 'Departments', href: '/departments', icon: '🏢' }
    ]
  };

  const handleNavigation = (href) => {
    navigate(href);
    onClose(); // Close dropdown after navigation
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-[1001]">
      {(menuItems[language] || menuItems.en || []).map((item, index) => (
        <button
          key={index}
          onClick={() => handleNavigation(item.href)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg transition-colors"
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-gray-700 hover:text-gray-900">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// Shift Planning Dropdown Component
const ShiftPlanningDropdown = ({ isOpen, onClose, language }) => {
  const navigate = useNavigate();
  const { hasFeatureAccess, showFeatureModal } = useUpgrade();
  
  const menuItems = {
    he: [
      { label: 'לוחות זמנים', href: '/schedules', icon: '📅' },
      { label: 'תבניות', href: '/templates', icon: '📋' },
      { label: 'משימות', href: '/tasks', icon: '✅', premium: true, featureId: 'tasks' },
      { label: 'סקרים', href: '/surveys', icon: '📊', premium: true, featureId: 'surveys' }
    ],
    en: [
      { label: 'Schedules', href: '/schedules', icon: '📅' },
      { label: 'Templates', href: '/templates', icon: '📋' },
      { label: 'Tasks', href: '/tasks', icon: '✅', premium: true, featureId: 'tasks' },
      { label: 'Surveys', href: '/surveys', icon: '📊', premium: true, featureId: 'surveys' }
    ]
  };

  const handleNavigation = (item) => {
    if (item.premium && !hasFeatureAccess(item.featureId)) {
      showFeatureModal(item.featureId);
    } else {
      navigate(item.href);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border z-[1001]">
      {(menuItems[language] || menuItems.en || []).map((item, index) => {
        const hasAccess = !item.premium || hasFeatureAccess(item.featureId);
        
        return (
          <button
            key={index}
            onClick={() => handleNavigation(item)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between first:rounded-t-lg last:rounded-b-lg transition-colors ${
              !hasAccess ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-700 hover:text-gray-900">{item.label}</span>
            </div>
            {item.premium && !hasAccess && (
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-orange-600 font-medium">
                  {language === 'he' ? 'פרימיום' : 'Premium'}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Main Navigation Component
export default function DashboardNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Security Department',
      message: 'Manager needed immediately',
      time: '2 min ago',
      read: false,
      actionUrl: '/departments'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pending Approvals',
      message: 'Time-off and shift requests',
      time: '1 hour ago',
      read: false,
      actionUrl: '/schedules'
    },
    {
      id: 3,
      type: 'info',
      title: 'Department Performance',
      message: 'Weekly report available',
      time: '3 hours ago',
      read: false,
      actionUrl: '/reports'
    }
  ]);
  const { language, setLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowAIPanel } = useAI();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setShowUserDropdown(false);
      setShowNotifications(false);
    };
    
    if (activeDropdown !== null || showUserDropdown || showNotifications) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown, showUserDropdown, showNotifications]);

  const handleDropdownClick = (dropdownId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
    setShowUserDropdown(false);
    setShowNotifications(false);
  };

  const handleUserDropdownClick = (e) => {
    e.stopPropagation();
    setShowUserDropdown(!showUserDropdown);
    setActiveDropdown(null);
    setShowNotifications(false);
  };

  const handleNotificationsClick = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setActiveDropdown(null);
    setShowUserDropdown(false);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate to related page
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }

    // Close dropdown
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const handleLogout = () => {
    if (confirm(language === 'he' ? 'האם אתה בטוח שברצונך להתנתק?' : 'Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
    setShowUserDropdown(false);
  };

  const isActivePath = (href: string) => {
    if (href === '/dashboard' || href === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 w-full fixed top-0 left-0 right-0 z-[1000]">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">ShiftGy</span>
              </Link>
            </div>
            
            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Dashboard */}
              <button
                onClick={() => navigate('/')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath('/') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {language === 'he' ? 'לוח בקרה' : 'Dashboard'}
              </button>

              {/* MY TEAM - Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => handleDropdownClick('myteam', e)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath('/employees') || isActivePath('/departments') 
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{language === 'he' ? 'הצוות שלי' : 'My Team'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'myteam' ? 'rotate-180' : ''}`} />
                </button>
                
                <MyTeamDropdown 
                  isOpen={activeDropdown === 'myteam'}
                  onClose={() => setActiveDropdown(null)}
                  language={language}
                />
              </div>

              {/* Shift Planning - Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => handleDropdownClick('shiftplanning', e)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath('/schedules') || isActivePath('/templates') || isActivePath('/tasks') || isActivePath('/surveys')
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{language === 'he' ? 'תכנון משמרות' : 'Shift Planning'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'shiftplanning' ? 'rotate-180' : ''}`} />
                </button>
                
                <ShiftPlanningDropdown 
                  isOpen={activeDropdown === 'shiftplanning'}
                  onClose={() => setActiveDropdown(null)}
                  language={language}
                />
              </div>

              {/* Reports */}
              <button
                onClick={() => navigate('/reports')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath('/reports') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {language === 'he' ? 'דוחות' : 'Reports'}
              </button>

              {/* Support */}
              <button
                onClick={() => navigate('/support')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath('/support') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {language === 'he' ? 'תמיכה' : 'Support'}
              </button>

              {/* Settings */}
              <button
                onClick={() => navigate('/settings')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath('/settings') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {language === 'he' ? 'הגדרות' : 'Settings'}
              </button>

              {/* Smart Insights */}
              <button
                onClick={() => setShowAIPanel(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all"
              >
                {language === 'he' ? 'תובנות חכמות' : 'Smart Insights'}
              </button>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative notifications-container">
                <button
                  onClick={handleNotificationsClick}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[1002] max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {language === 'he' ? 'התראות' : 'Notifications'}
                      </h3>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {language === 'he' ? 'סמן הכל כנקרא' : 'Mark all as read'}
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Notification Icon */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notification.type === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                              }`}>
                                {notification.type === 'urgent' && <AlertTriangle className="w-4 h-4" />}
                                {notification.type === 'warning' && <Clock className="w-4 h-4" />}
                                {notification.type === 'info' && <Info className="w-4 h-4" />}
                              </div>

                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>

                              {/* Unread Indicator */}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {language === 'he' ? 'אין התראות' : 'No notifications'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/notifications');
                        }}
                        className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {language === 'he' ? 'צפה בכל ההתראות' : 'View all notifications'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-6 h-6" />
                ) : (
                  <Sun className="w-6 h-6" />
                )}
              </button>
              
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'he' ? 'עב' : 'EN'}</span>
              </button>
              
              {/* User Profile */}
              <div className="relative user-dropdown-container">
                <button
                  onClick={handleUserDropdownClick}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:block font-medium">{user?.role || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-[1002]">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'User'} • {user?.department}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {language === 'he' ? 'הגדרות פרופיל' : 'Profile Settings'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/support');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      {language === 'he' ? 'עזרה ותמיכה' : 'Help & Support'}
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === 'he' ? 'התנתק' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Click outside to close dropdown */}
        {activeDropdown !== null && (
          <div 
            className="fixed inset-0 z-[999]" 
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </nav>
    </>
  );
}