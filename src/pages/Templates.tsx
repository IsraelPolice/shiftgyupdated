import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Copy, Users, 
  Clock, Calendar, Tag, AlertTriangle, CheckCircle,
  Settings, Eye, MoreVertical, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// Template interface with comprehensive rules
interface JobTemplate {
  id: string;
  name: string;
  category: 'student' | 'partial' | 'full-time' | 'special';
  description: string;
  
  // Basic constraints
  maxShiftsPerWeek: number;
  maxHoursPerShift: number;
  minHoursPerShift: number;
  weeklyHoursLimit: number;
  
  // Day restrictions
  allowedDays: string[];
  forbiddenDays: string[];
  isFlexible: boolean; // Employee can choose from allowed days
  
  // Advanced rules
  maxConsecutiveDays: number;
  minRestBetweenShifts: number; // hours
  canWorkWeekends: boolean;
  canWorkNights: boolean;
  
  // Preferences
  preferredTimeSlots: string[];
  canWorkOvertime: boolean;
  emergencyAvailable: boolean;
  
  // System
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  assignedEmployees: number;
  companyId?: string;
  
  // Seasonal adjustments
  seasonalRules?: {
    summer?: Partial<JobTemplate>;
    winter?: Partial<JobTemplate>;
  };
}

// Mock templates data - only for demo company
const demoTemplates: JobTemplate[] = [
  {
    id: '1',
    name: 'Student Flexible',
    category: 'student',
    description: 'For students who can choose their work days',
    maxShiftsPerWeek: 3,
    maxHoursPerShift: 6,
    minHoursPerShift: 4,
    weeklyHoursLimit: 18,
    allowedDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    forbiddenDays: ['Friday', 'Saturday'],
    isFlexible: true,
    maxConsecutiveDays: 2,
    minRestBetweenShifts: 12,
    canWorkWeekends: false,
    canWorkNights: false,
    preferredTimeSlots: ['morning', 'afternoon'],
    canWorkOvertime: false,
    emergencyAvailable: false,
    isActive: true,
    isDefault: false,
    createdAt: '2024-01-01',
    assignedEmployees: 5,
    companyId: 'company-1'
  },
  {
    id: '2', 
    name: 'Student Fixed Schedule',
    category: 'student',
    description: 'Fixed days for students with regular schedule',
    maxShiftsPerWeek: 4,
    maxHoursPerShift: 7,
    minHoursPerShift: 6,
    weeklyHoursLimit: 28,
    allowedDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    forbiddenDays: ['Saturday', 'Sunday', 'Tuesday'],
    isFlexible: false,
    maxConsecutiveDays: 2,
    minRestBetweenShifts: 16,
    canWorkWeekends: false,
    canWorkNights: false,
    preferredTimeSlots: ['morning', 'afternoon'],
    canWorkOvertime: false,
    emergencyAvailable: true,
    isActive: true,
    isDefault: false,
    createdAt: '2024-01-05',
    assignedEmployees: 3,
    companyId: 'company-1'
  },
  {
    id: '3',
    name: '60% Position',
    category: 'partial',
    description: 'Part-time position with reduced hours',
    maxShiftsPerWeek: 4,
    maxHoursPerShift: 6.5,
    minHoursPerShift: 6,
    weeklyHoursLimit: 26,
    allowedDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    forbiddenDays: [],
    isFlexible: true,
    maxConsecutiveDays: 3,
    minRestBetweenShifts: 12,
    canWorkWeekends: true,
    canWorkNights: false,
    preferredTimeSlots: ['morning', 'afternoon'],
    canWorkOvertime: true,
    emergencyAvailable: true,
    isActive: true,
    isDefault: false,
    createdAt: '2024-01-10',
    assignedEmployees: 8,
    companyId: 'company-1'
  }
];

export default function Templates() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { hasPermission, currentCompany } = useAuth();
  
  const [templates, setTemplates] = useState<JobTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Load templates on component mount
  useEffect(() => {
    if (!currentCompany?.id) return;

    // For demo company, use mock data
    if (currentCompany.id === 'company-1') {
      const savedTemplates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
      const allTemplates = [...demoTemplates, ...savedTemplates];
      setTemplates(allTemplates);
    } else {
      // For real companies, load from localStorage with company-specific key
      const savedTemplates = JSON.parse(localStorage.getItem(`jobTemplates_${currentCompany.id}`) || '[]');
      setTemplates(savedTemplates);
    }
  }, [currentCompany?.id]);

  const canManageTemplates = hasPermission('manage_schedules');

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || template.category === categoryFilter;
    const matchesActive = showInactive || template.isActive;
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  const handleCreateTemplate = () => {
    navigate('/templates/builder');
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/templates/builder/${templateId}`);
  };

  const handleDuplicateTemplate = (template: JobTemplate) => {
    if (!currentCompany?.id) return;

    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isActive: false,
      isDefault: false,
      assignedEmployees: 0,
      createdAt: new Date().toISOString(),
      companyId: currentCompany.id
    };
    
    setTemplates(prev => {
      const updated = [...prev, duplicated];
      // Save to localStorage with company-specific key
      const savedTemplates = currentCompany.id === 'company-1' 
        ? updated.filter(t => !demoTemplates.find(demo => demo.id === t.id))
        : updated;
      localStorage.setItem(`jobTemplates_${currentCompany.id}`, JSON.stringify(savedTemplates));
      return updated;
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (!currentCompany?.id) return;

    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      
      // Update localStorage with company-specific key
      const savedTemplates = currentCompany.id === 'company-1' 
        ? updatedTemplates.filter(t => !demoTemplates.find(demo => demo.id === t.id))
        : updatedTemplates;
      localStorage.setItem(`jobTemplates_${currentCompany.id}`, JSON.stringify(savedTemplates));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-700',
      partial: 'bg-yellow-100 text-yellow-700', 
      'full-time': 'bg-green-100 text-green-700',
      special: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      student: <Users className="w-4 h-4" />,
      partial: <Clock className="w-4 h-4" />,
      'full-time': <Calendar className="w-4 h-4" />,
      special: <Tag className="w-4 h-4" />
    };
    return icons[category] || <Users className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'he' ? 'תבניות עבודה' : 'Job Templates'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'he' 
              ? 'הגדר חוקי עבודה חכמים לעובדים שיחולו אוטומטית בתזמון המשמרות'
              : 'Define smart work rules for employees that automatically apply during shift scheduling'
            }
          </p>
        </div>
        
        {canManageTemplates && (
          <button
            onClick={handleCreateTemplate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'he' ? 'צור תבנית חדשה' : 'Create Template'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Employees</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + t.assignedEmployees, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Hours/Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length > 0 ? Math.round(templates.reduce((sum, t) => sum + t.weeklyHoursLimit, 0) / templates.length) : 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length > 0 ? new Set(templates.map(t => t.category)).size : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={language === 'he' ? 'חפש תבניות...' : 'Search templates...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'he' ? 'כל הקטגוריות' : 'All Categories'}</option>
            <option value="student">{language === 'he' ? 'סטודנט' : 'Student'}</option>
            <option value="partial">{language === 'he' ? 'משרה חלקית' : 'Partial'}</option>
            <option value="full-time">{language === 'he' ? 'משרה מלאה' : 'Full-time'}</option>
            <option value="special">{language === 'he' ? 'מיוחד' : 'Special'}</option>
          </select>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {language === 'he' ? 'הצג לא פעילות' : 'Show Inactive'}
            </span>
          </label>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                  {getCategoryIcon(template.category)}
                  {template.category}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditTemplate(template.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            {/* Key Rules */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Max Shifts/Week:</span>
                <span className="font-medium">{template.maxShiftsPerWeek}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hours/Shift:</span>
                <span className="font-medium">{template.minHoursPerShift}-{template.maxHoursPerShift}h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Weekly Limit:</span>
                <span className="font-medium">{template.weeklyHoursLimit}h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Flexibility:</span>
                <span className={`font-medium ${template.isFlexible ? 'text-green-600' : 'text-orange-600'}`}>
                  {template.isFlexible ? 'Flexible' : 'Fixed'}
                </span>
              </div>
            </div>

            {/* Assigned Employees */}
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-gray-600">Assigned Employees:</span>
              <span className="font-medium text-blue-600">{template.assignedEmployees}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {template.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                )}
                <span className={`text-sm font-medium ${template.isActive ? 'text-green-700' : 'text-orange-700'}`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <button
                onClick={() => navigate(`/templates/${template.id}/preview`)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || categoryFilter 
              ? 'Try adjusting your filters or search terms'
              : 'Create your first job template to get started'
            }
          </p>
          {canManageTemplates && (
            <button
              onClick={handleCreateTemplate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </button>
          )}
        </div>
      )}
    </div>
  );
}