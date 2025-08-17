import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function Departments() {
  const { language, isRTL } = useLanguage();
  const { currentCompany } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample departments data - only for demo company
  const demoDepartments = [
    {
      id: 1,
      name: 'Sales',
      nameHe: 'מכירות',
      description: 'Sales and customer acquisition team',
      descriptionHe: 'צוות מכירות ורכישת לקוחות',
      manager: 'Sarah Johnson',
      employeeCount: 12,
      activeShifts: 8,
      status: 'active',
      location: 'Floor 1, Building A',
      locationHe: 'קומה 1, בניין א',
      email: 'sales@shiftgy.com',
      phone: '+1 (555) 123-4567',
      color: 'blue',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Operations',
      nameHe: 'תפעול',
      description: 'Operations and logistics management',
      descriptionHe: 'ניהול תפעול ולוגיסטיקה',
      manager: 'Michael Chen',
      employeeCount: 18,
      activeShifts: 15,
      status: 'active',
      location: 'Floor 2, Building A',
      locationHe: 'קומה 2, בניין א',
      email: 'operations@shiftgy.com',
      phone: '+1 (555) 234-5678',
      color: 'green',
      lastActivity: '1 hour ago'
    },
    {
      id: 3,
      name: 'Customer Service',
      nameHe: 'שירות לקוחות',
      description: 'Customer support and service team',
      descriptionHe: 'צוות תמיכה ושירות לקוחות',
      manager: 'Emily Davis',
      employeeCount: 8,
      activeShifts: 6,
      status: 'active',
      location: 'Floor 3, Building B',
      locationHe: 'קומה 3, בניין ב',
      email: 'support@shiftgy.com',
      phone: '+1 (555) 345-6789',
      color: 'purple',
      lastActivity: '30 minutes ago'
    },
    {
      id: 4,
      name: 'Security',
      nameHe: 'אבטחה',
      description: 'Security and safety management',
      descriptionHe: 'ניהול אבטחה ובטיחות',
      manager: 'Alex Thompson',
      employeeCount: 6,
      activeShifts: 4,
      status: 'warning',
      location: 'Ground Floor, All Buildings',
      locationHe: 'קומת קרקע, כל הבניינים',
      email: 'security@shiftgy.com',
      phone: '+1 (555) 456-7890',
      color: 'red',
      lastActivity: '15 minutes ago'
    }
  ];
  
  // Initialize departments based on company
  const [departments, setDepartments] = useState(() => {
    if (currentCompany?.id === 'company-1') {
      return demoDepartments;
    }
    // For new companies, start with just a General department
    return [
      {
        id: 1,
        name: 'General',
        nameHe: 'כללי',
        description: 'General department for all employees',
        descriptionHe: 'מחלקה כללית לכל העובדים',
        manager: currentCompany?.mainContactName || 'Admin',
        employeeCount: 1,
        activeShifts: 0,
        status: 'active',
        location: 'Main Office',
        locationHe: 'משרד ראשי',
        email: currentCompany?.mainContactEmail || 'admin@company.com',
        phone: '+1 (555) 123-4567',
        color: 'blue',
        lastActivity: 'Just created'
      }
    ];
  });

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.nameHe.includes(searchTerm) ||
                         dept.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dept.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // פונקציה לחישוב השבוע הנוכחי (ראשון עד שבת)
  const getCurrentWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = ראשון, 1 = שני, וכו'
    
    // חישוב תחילת השבוע (יום ראשון)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // חישוב סוף השבוע (יום שבת)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return {
      start: startOfWeek.toISOString().split('T')[0], // פורמט YYYY-MM-DD
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  // פונקציות ניווט
  const handleTotalEmployeesClick = () => {
    navigate('/employees');
  };

  const handleActiveShiftsClick = () => {
    const weekRange = getCurrentWeekRange();
    // ניווט לעמוד SCHEDULES עם טווח השבוע הנוכחי
    navigate(`/schedules?startDate=${weekRange.start}&endDate=${weekRange.end}&view=week`);
  };

  const CreateDepartmentModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      nameHe: '',
      description: '',
      descriptionHe: '',
      manager: '',
      location: '',
      locationHe: '',
      email: '',
      phone: '',
      color: 'blue'
    });

    const colorOptions = [
      { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
      { value: 'green', label: 'Green', class: 'bg-green-500' },
      { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
      { value: 'red', label: 'Red', class: 'bg-red-500' },
      { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
      { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' ? 'יצירת מחלקה חדשה' : 'Create New Department'}
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Department Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'שם מחלקה (אנגלית)' : 'Department Name (English)'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sales"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'שם מחלקה (עברית)' : 'Department Name (Hebrew)'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="למשל: מכירות"
                    value={formData.nameHe}
                    onChange={(e) => setFormData({...formData, nameHe: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'תיאור (אנגלית)' : 'Description (English)'}
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description of the department"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'תיאור (עברית)' : 'Description (Hebrew)'}
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="תיאור קצר של המחלקה"
                    value={formData.descriptionHe}
                    onChange={(e) => setFormData({...formData, descriptionHe: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Manager and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מנהל מחלקה' : 'Department Manager'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'he' ? 'שם המנהל' : 'Manager name'}
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'אימייל' : 'Email'}
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="department@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Location and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מיקום' : 'Location'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'he' ? 'מיקום המחלקה' : 'Department location'}
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'טלפון' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'צבע מחלקה' : 'Department Color'}
                </label>
                <div className="flex gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({...formData, color: color.value})}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>
            <button
              onClick={() => {
                // Handle department creation here
                console.log('Creating department:', formData);
                setShowCreateModal(false);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {language === 'he' ? 'יצור מחלקה' : 'Create Department'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'he' ? 'מחלקות' : 'Departments'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'he' ? 'נהל מחלקות הארגון ומידע הצוות' : 'Manage organization departments and team information'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {language === 'he' ? 'הוסף מחלקה' : 'Add Department'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'סך מחלקות' : 'Total Departments'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleTotalEmployeesClick}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer text-left"
              aria-label={language === 'he' ? 'עבור לעמוד עובדים' : 'Go to employees page'}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'סך עובדים' : 'Total Employees'}</p>
                </div>
              </div>
            </button>
            <button 
              onClick={handleActiveShiftsClick}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer text-left"
              aria-label={language === 'he' ? 'עבור לעמוד לוחות זמנים - שבוע נוכחי' : 'Go to schedules page - current week'}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.reduce((sum, dept) => sum + dept.activeShifts, 0)}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'משמרות פעילות' : 'Active Shifts'}</p>
                </div>
              </div>
            </button>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.filter(d => d.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'מחלקות פעילות' : 'Active Departments'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={language === 'he' ? 'חפש מחלקות...' : 'Search departments...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'he' ? 'כל הסטטוסים' : 'All Statuses'}</option>
              <option value="active">{language === 'he' ? 'פעיל' : 'Active'}</option>
              <option value="warning">{language === 'he' ? 'אזהרה' : 'Warning'}</option>
            </select>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map(department => (
            <div key={department.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Department Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${department.color}-100 rounded-lg flex items-center justify-center`}>
                      <Building2 className={`w-5 h-5 text-${department.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'he' ? department.nameHe : department.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          department.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <span className="text-xs text-gray-500">
                          {department.status === 'active' 
                            ? (language === 'he' ? 'פעיל' : 'Active')
                            : (language === 'he' ? 'אזהרה' : 'Warning')
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'he' ? department.descriptionHe : department.description}
                </p>
              </div>

              {/* Department Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{department.employeeCount}</p>
                    <p className="text-xs text-gray-500">{language === 'he' ? 'עובדים' : 'Employees'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{department.activeShifts}</p>
                    <p className="text-xs text-gray-500">{language === 'he' ? 'משמרות פעילות' : 'Active Shifts'}</p>
                  </div>
                </div>

                {/* Department Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{language === 'he' ? 'מנהל:' : 'Manager:'} {department.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{language === 'he' ? department.locationHe : department.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{language === 'he' ? 'פעילות אחרונה:' : 'Last activity:'} {department.lastActivity}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'he' ? 'לא נמצאו מחלקות' : 'No departments found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' ? 'נסה לשנות את מונחי החיפוש או הסינון' : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        )}
      </div>

      {/* Create Department Modal */}
      {showCreateModal && <CreateDepartmentModal />}
    </div>
  );
}