import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  MessageCircle, 
  Edit, 
  MoreVertical,
  Menu,
  Bell,
  User,
  ChevronDown,
  X,
  Check,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// Mock employee data
const mockEmployees = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Shift Manager',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=2',
    status: 'available',
    department: 'Management',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Sales Associate',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=2',
    status: 'on_shift',
    department: 'Sales',
    lastActive: '30 minutes ago'
  },
  {
    id: '3',
    name: 'Emily Davis',
    position: 'Cashier',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=2',
    status: 'busy',
    department: 'Operations',
    lastActive: '1 hour ago'
  },
  {
    id: '4',
    name: 'Alex Thompson',
    position: 'Stock Associate',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=2',
    status: 'off',
    department: 'Operations',
    lastActive: '3 hours ago'
  },
  {
    id: '5',
    name: 'Jessica Wong',
    position: 'Customer Service',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=2',
    status: 'available',
    department: 'Customer Service',
    lastActive: '45 minutes ago'
  }
];

const statusConfig = {
  available: { 
    label: { en: 'Available', he: 'זמין' }, 
    color: 'bg-green-500', 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-700' 
  },
  on_shift: { 
    label: { en: 'On Shift', he: 'במשמרת' }, 
    color: 'bg-blue-500', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-700' 
  },
  busy: { 
    label: { en: 'Busy', he: 'עסוק' }, 
    color: 'bg-orange-500', 
    bgColor: 'bg-orange-100', 
    textColor: 'text-orange-700' 
  },
  off: { 
    label: { en: 'Off', he: 'לא פעיל' }, 
    color: 'bg-gray-500', 
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-700' 
  }
};

const quickFilters = [
  { id: 'all', label: { en: 'All', he: 'הכל' } },
  { id: 'available', label: { en: 'Available', he: 'זמין' } },
  { id: 'busy', label: { en: 'Busy', he: 'עסוק' } },
  { id: 'off', label: { en: 'Off', he: 'לא פעיל' } },
  { id: 'on_shift', label: { en: 'On Shift', he: 'במשמרת' } }
];

export default function MobileEmployees() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [swipedCard, setSwipedCard] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phone.includes(searchTerm);
    const matchesFilter = selectedFilter === 'all' || employee.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  // Handle employee card tap
  const handleEmployeeTap = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  // Handle swipe actions
  const handleSwipeAction = (employeeId, action) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (action === 'call') {
      window.location.href = `tel:${employee.phone}`;
    } else if (action === 'message') {
      window.location.href = `sms:${employee.phone}`;
    }
    setSwipedCard(null);
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-4 mb-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  // Employee card component
  const EmployeeCard = ({ employee }) => {
    const status = statusConfig[employee.status];
    const isSwipedOut = swipedCard === employee.id;

    return (
      <div className="relative mb-4 overflow-hidden">
        {/* Swipe actions background */}
        <div className={`absolute inset-0 bg-blue-500 rounded-xl flex items-center justify-end px-6 transition-transform duration-300 ${
          isSwipedOut ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex space-x-4">
            <button
              onClick={() => handleSwipeAction(employee.id, 'call')}
              className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              aria-label={language === 'he' ? 'התקשר' : 'Call'}
            >
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleSwipeAction(employee.id, 'message')}
              className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              aria-label={language === 'he' ? 'שלח הודעה' : 'Message'}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main card */}
        <div 
          className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-transform duration-300 ${
            isSwipedOut ? '-translate-x-32' : 'translate-x-0'
          }`}
          onClick={() => handleEmployeeTap(employee)}
          onTouchStart={(e) => {
            const startX = e.touches[0].clientX;
            const handleTouchMove = (e) => {
              const currentX = e.touches[0].clientX;
              const diff = startX - currentX;
              if (diff > 50) {
                setSwipedCard(employee.id);
              } else if (diff < -50) {
                setSwipedCard(null);
              }
            };
            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-white`}></div>
            </div>

            {/* Employee info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base truncate">{employee.name}</h3>
              <p className="text-sm text-gray-600 truncate">{employee.position}</p>
              <div className="flex items-center mt-1">
                <Phone className="w-3 h-3 text-gray-400 mr-1" />
                <p className="text-xs text-gray-500">{employee.phone}</p>
              </div>
            </div>

            {/* Status and actions */}
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                {status.label[language]}
              </span>
              
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${employee.phone}`;
                  }}
                  className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"
                  aria-label={language === 'he' ? 'התקשר' : 'Call'}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `sms:${employee.phone}`;
                  }}
                  className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                  aria-label={language === 'he' ? 'שלח הודעה' : 'Message'}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit action
                  }}
                  className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center"
                  aria-label={language === 'he' ? 'ערוך' : 'Edit'}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={language === 'he' ? 'פתח תפריט' : 'Open menu'}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            {language === 'he' ? 'עובדים' : 'Employees'}
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={language === 'he' ? 'התראות' : 'Notifications'}
            >
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={language === 'he' ? 'חפש עובד...' : 'Search employee...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <button
            onClick={() => setShowFilterSheet(true)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center"
            aria-label={language === 'he' ? 'סנן' : 'Filter'}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="fixed top-32 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-44 pb-20 px-4">
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="flex justify-center py-4">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Employee List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'he' ? 'לא נמצאו עובדים' : 'No employees found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'he' ? 'נסה לשנות את קריטריוני החיפוש' : 'Try adjusting your search criteria'}
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium">
              {language === 'he' ? 'הוסף עובד' : 'Add Employee'}
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-blue-700 transition-colors"
        aria-label={language === 'he' ? 'הוסף עובד' : 'Add Employee'}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilterSheet(false)}>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'he' ? 'סנן עובדים' : 'Filter Employees'}
              </h2>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'מחלקה' : 'Department'}
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>{language === 'he' ? 'כל המחלקות' : 'All Departments'}</option>
                  <option>Sales</option>
                  <option>Operations</option>
                  <option>Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'סוג העסקה' : 'Employment Type'}
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>{language === 'he' ? 'כל הסוגים' : 'All Types'}</option>
                  <option>{language === 'he' ? 'משרה מלאה' : 'Full-time'}</option>
                  <option>{language === 'he' ? 'משרה חלקית' : 'Part-time'}</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilterSheet(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
              >
                {language === 'he' ? 'החל מסננים' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
              <button
                onClick={() => setShowEmployeeDetails(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'he' ? 'פרטי עובד' : 'Employee Details'}
              </h2>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <Edit className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center mb-6">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h3>
                <p className="text-gray-600">{selectedEmployee.position}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusConfig[selectedEmployee.status].bgColor} ${statusConfig[selectedEmployee.status].textColor}`}>
                  {statusConfig[selectedEmployee.status].label[language]}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {language === 'he' ? 'פרטי קשר' : 'Contact Information'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedEmployee.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = `tel:${selectedEmployee.phone}`}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {language === 'he' ? 'התקשר' : 'Call'}
                  </button>
                  <button
                    onClick={() => window.location.href = `sms:${selectedEmployee.phone}`}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {language === 'he' ? 'הודעה' : 'Message'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">ShiftGY</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Navigation items would go here */}
              <nav className="space-y-2">
                <a href="/dashboard" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
                  {language === 'he' ? 'לוח בקרה' : 'Dashboard'}
                </a>
                <a href="/employees" className="block py-3 px-4 text-blue-600 bg-blue-50 rounded-lg font-medium">
                  {language === 'he' ? 'עובדים' : 'Employees'}
                </a>
                <a href="/schedules" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
                  {language === 'he' ? 'משמרות' : 'Schedules'}
                </a>
                <a href="/reports" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
                  {language === 'he' ? 'דוחות' : 'Reports'}
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Tap outside to close swipe actions */}
      {swipedCard && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setSwipedCard(null)}
        />
      )}
    </div>
  );
}