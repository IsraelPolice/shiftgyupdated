import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  Coffee,
  Info,
  Building2
} from 'lucide-react';
import { format as formatDate, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, getISOWeek, addMonths } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCompanySettings } from '../contexts/CompanySettingsContext';
import { isWeekendDay, detectShiftCategory } from '../utils/workWeekUtils';
import { TemplateValidationService, ValidationResult, JobTemplate } from '../services/TemplateValidationService';

// Employee interface for assignment system
interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  tags: string[];
  email: string;
  isActive: boolean;
  avatar?: string;
  assignedTemplate?: string;
  currentWeekShifts: any[];
}

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  weekendShiftStartTime?: string;
  weekendShiftEndTime?: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  location: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  breaks: Array<{
    startTime: string;
    duration: number;
  }>;
  notes?: string;
  isWeekend: boolean;
  category: 'regular' | 'weekend';
  assignedEmployees?: Employee[];
  maxEmployees?: number;
  requiredTags?: string[];
}

interface ShiftConfig {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  tagRequirement: 'none' | 'specific';
  requiredTags: string[];
  maxEmployees: number;
  weekendShiftStartTime?: string;
  weekendShiftEndTime?: string;
}

interface AutomaticBreak {
  id: string;
  earliestStart: string;
  latestEnd: string;
  duration: number;
  maxConcurrentEmployees: number;
}

// Cleaned up ScheduleData interface
interface ScheduleData {
  title: string;
  duration: 'daily' | 'weekly' | 'monthly';
  dateRange: { start: string; end: string; };
  defaultStartTime: string;
  defaultEndTime: string;
  weekendHoursOption: 'same' | 'different';
  weekendDayHours: Record<string, {start: string, end: string}>;
  includeWeekends: boolean;
  selectedWeekendDays: string[];
  shifts: ShiftConfig[];
  notes: string;
  breakMode: 'manual' | 'automatic';
  automaticBreaks: AutomaticBreak[];
  autoBreakWindow: { start: string; end: string };
  breakDuration: number;
  maxConcurrentBreaks: number;
  startDate: string;
  endDate: string;
}

// Mock employee data for assignment system
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Manager',
    department: 'Sales',
    location: 'Main Store',
    tags: ['manager', 'team_leader', 'english_speaker'],
    email: 'sarah.johnson@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: '1',
    currentWeekShifts: []
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Sales Associate',
    department: 'Sales',
    location: 'Main Store',
    tags: ['cashier', 'customer_service_expert'],
    email: 'michael.chen@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: '1',
    currentWeekShifts: []
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Cashier',
    department: 'Operations',
    location: 'Main Store',
    tags: ['cashier', 'waiter'],
    email: 'emily.davis@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: undefined,
    currentWeekShifts: []
  },
  {
    id: '4',
    name: 'Alex Thompson',
    role: 'Stock Associate',
    department: 'Operations',
    location: 'Warehouse',
    tags: ['driver_license', 'senior_staff'],
    email: 'alex.thompson@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: undefined,
    currentWeekShifts: []
  },
  {
    id: '5',
    name: 'Jessica Wong',
    role: 'Customer Service',
    department: 'Customer Service',
    location: 'Main Store',
    tags: ['customer_service_expert', 'english_speaker'],
    email: 'jessica.wong@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: undefined,
    currentWeekShifts: []
  },
  {
    id: '6',
    name: 'David Rodriguez',
    role: 'Security Guard',
    department: 'Security',
    location: 'All Locations',
    tags: ['security_certified', 'first_aid_certified'],
    email: 'david.rodriguez@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: undefined,
    currentWeekShifts: []
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    role: 'Cook',
    department: 'Kitchen',
    location: 'Main Store',
    tags: ['cook', 'senior_staff'],
    email: 'lisa.anderson@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: undefined,
    currentWeekShifts: []
  },
  {
    id: '8',
    name: 'Robert Kim',
    role: 'Maintenance',
    department: 'Operations',
    location: 'All Locations',
    tags: ['driver_license', 'first_aid_certified'],
    email: 'robert.kim@company.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    assignedTemplate: undefined,
    currentWeekShifts: []
  }
];

// Employee Assignment Modal Component
const EmployeeAssignmentModal = ({ 
  isOpen, 
  onClose, 
  shift, 
  onAssign 
}: {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift | null;
  onAssign: (shiftId: string, employees: Employee[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [templateWarnings, setTemplateWarnings] = useState<ValidationResult[]>([]);
  
  // Mock job templates for validation
  const mockJobTemplates: JobTemplate[] = [
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
      assignedEmployees: 5
    }
  ];
  const { language, isRTL } = useLanguage();

  // Initialize selected employees when modal opens
  useEffect(() => {
    if (shift?.assignedEmployees) {
      setSelectedEmployees(shift.assignedEmployees);
    } else {
      setSelectedEmployees([]);
    }
  }, [shift]);

  if (!isOpen || !shift) return null;

  // Helper function to get employee template
  const getEmployeeTemplate = (templateId: string): JobTemplate | null => {
    return mockJobTemplates.find(t => t.id === templateId) || null;
  };

  // Helper function to calculate shift duration
  const calculateShiftDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  // Filter employees based on search, tags, and shift requirements
  const filteredEmployees = mockEmployees.filter(employee => {
    if (!employee.isActive) return false;
    
    // Search filter
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Tag filter
    const matchesTagFilter = !tagFilter || employee.tags.includes(tagFilter);
    
    // Department filter
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    
    // Shift requirements filter
    const matchesShiftRequirements = !shift.requiredTags || shift.requiredTags.length === 0 ||
      shift.requiredTags.some(requiredTag => employee.tags.includes(requiredTag));
    
    return matchesSearch && matchesTagFilter && matchesDepartment && matchesShiftRequirements;
  });

  const maxEmployees = shift.maxEmployees || 1;
  const canSelectMore = selectedEmployees.length < maxEmployees;

  const toggleEmployee = (employee: Employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.find(emp => emp.id === employee.id);
      if (isSelected) {
        return prev.filter(emp => emp.id !== employee.id);
      } else if (canSelectMore) {
        return [...prev, employee];
      }
      return prev;
    });
  };

  const handleSave = () => {
    setTemplateWarnings([]); // Clear previous warnings
    
    // Validate against templates
    selectedEmployees.forEach(employee => {
      if (employee.assignedTemplate && shift) {
        const template = getEmployeeTemplate(employee.assignedTemplate);
        if (template) {
          const validationResults = TemplateValidationService.validateShiftAssignment(
            employee,
            {
              id: shift.id,
              date: shift.date,
              startTime: shift.startTime,
              endTime: shift.endTime,
              duration: calculateShiftDuration(shift.startTime, shift.endTime),
              dayOfWeek: new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' })
            },
            template
          );
          
          if (validationResults.length > 0) {
            setTemplateWarnings(prev => [...prev, ...validationResults]);
          }
        }
      }
    });

    onAssign(shift.id, selectedEmployees);
    onClose();
  };

  const getEmployeeInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' ? 'הקצאת עובדים למשמרת' : 'Assign Employees to Shift'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(new Date(shift.date), 'EEEE, MMMM dd, yyyy')} • {shift.startTime} - {shift.endTime}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">
                  {language === 'he' ? 'נבחרו:' : 'Selected:'} {selectedEmployees.length}/{maxEmployees}
                </span>
                {shift.requiredTags && shift.requiredTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {shift.requiredTags.map(tagId => {
                      const tag = availableTags.find(t => t.id === tagId);
                      return tag ? (
                        <span key={tagId} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {language === 'he' ? tag.nameHe : tag.nameEn}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'he' ? 'חפש עובדים...' : 'Search employees...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'he' ? 'כל המחלקות' : 'All Departments'}</option>
                <option value="Sales">{language === 'he' ? 'מכירות' : 'Sales'}</option>
                <option value="Operations">{language === 'he' ? 'תפעול' : 'Operations'}</option>
                <option value="Customer Service">{language === 'he' ? 'שירות לקוחות' : 'Customer Service'}</option>
                <option value="Security">{language === 'he' ? 'אבטחה' : 'Security'}</option>
                <option value="Kitchen">{language === 'he' ? 'מטבח' : 'Kitchen'}</option>
              </select>
              
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'he' ? 'כל התגים' : 'All Tags'}</option>
                {availableTags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {language === 'he' ? tag.nameHe : tag.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Template Warnings */}
        {templateWarnings.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Template Validation Warnings:</h4>
              {templateWarnings.map((warning, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    warning.severity === 'error'
                      ? 'bg-red-50 border-red-200'
                      : warning.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start">
                    {warning.severity === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2" />
                    ) : warning.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        warning.severity === 'error'
                          ? 'text-red-800'
                          : warning.severity === 'warning'
                          ? 'text-yellow-800'
                          : 'text-blue-800'
                      }`}>
                        {warning.message}
                      </p>
                      {warning.suggestion && (
                        <p className={`text-xs mt-1 ${
                          warning.severity === 'error'
                            ? 'text-red-600'
                            : warning.severity === 'warning'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}>
                          💡 {warning.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'he' ? 'לא נמצאו עובדים' : 'No employees found'}
                </h3>
                <p className="text-gray-500">
                  {language === 'he' ? 'נסה לשנות את קריטריוני החיפוש' : 'Try adjusting your search criteria'}
                </p>
              </div>
            ) : (
              filteredEmployees.map(employee => {
                const isSelected = selectedEmployees.find(emp => emp.id === employee.id);
                const canSelect = canSelectMore || isSelected;
                
                return (
                  <div
                    key={employee.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : canSelect
                          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => canSelect && toggleEmployee(employee)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {employee.avatar ? (
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                            {getEmployeeInitials(employee.name)}
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{employee.name}</h4>
                          {employee.assignedTemplate && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Template: {getEmployeeTemplate(employee.assignedTemplate)?.name || 'Unknown'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {employee.tags.slice(0, 3).map(tagId => {
                            const tag = availableTags.find(t => t.id === tagId);
                            const isRequired = shift.requiredTags?.includes(tagId);
                            return tag ? (
                              <span 
                                key={tagId} 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  isRequired 
                                    ? 'bg-green-100 text-green-700 border border-green-300' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {language === 'he' ? tag.nameHe : tag.nameEn}
                                {isRequired && ' ✓'}
                              </span>
                            ) : null;
                          })}
                          {employee.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{employee.tags.length - 3}
                            </span>
                          )}
                        </div>
                        {employee.assignedTemplate && (
                          <div className="text-xs text-gray-400 mt-1">
                            Template rules: Max {getEmployeeTemplate(employee.assignedTemplate)?.maxShiftsPerWeek || 0} shifts/week, 
                            {getEmployeeTemplate(employee.assignedTemplate)?.weeklyHoursLimit || 0}h limit
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        {isSelected && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {language === 'he' 
                ? `${selectedEmployees.length} מתוך ${maxEmployees} עובדים נבחרו`
                : `${selectedEmployees.length} of ${maxEmployees} employees selected`
              }
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {language === 'he' ? 'שמור הקצאה' : 'Save Assignment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Available tags for employee assignment
const availableTags = [
  { id: 'english_speaker', nameEn: 'English Speaker', nameHe: 'דובר אנגלית' },
  { id: 'team_leader', nameEn: 'Team Leader', nameHe: 'מוביל צוות' },
  { id: 'cook', nameEn: 'Cook', nameHe: 'טבח' },
  { id: 'waiter', nameEn: 'Waiter', nameHe: 'מלצר' },
  { id: 'cashier', nameEn: 'Cashier', nameHe: 'קופאי' },
  { id: 'security_certified', nameEn: 'Security Certified', nameHe: 'מוסמך אבטחה' },
  { id: 'driver_license', nameEn: 'Driver License', nameHe: 'רישיון נהיגה' },
  { id: 'first_aid_certified', nameEn: 'First Aid Certified', nameHe: 'מוסמך עזרה ראשונה' },
  { id: 'manager', nameEn: 'Manager', nameHe: 'מנהל' },
  { id: 'senior_staff', nameEn: 'Senior Staff', nameHe: 'צוות בכיר' },
  { id: 'customer_service_expert', nameEn: 'Customer Service Expert', nameHe: 'מומחה שירות לקוחות' }
];

// Default shift configuration
const defaultShift: ShiftConfig = {
  id: '1',
  name: '',
  startTime: '09:00',
  endTime: '17:00',
  maxEmployees: 1,
  tagRequirement: 'none',
  requiredTags: []
};

// Cleaned up initial schedule data
const initialScheduleData: ScheduleData = {
  title: '',
  duration: 'weekly',
  dateRange: { start: '', end: '' },
  defaultStartTime: '09:00',
  defaultEndTime: '17:00',
  weekendHoursOption: 'same',
  weekendDayHours: {},
  includeWeekends: false,
  selectedWeekendDays: [],
  shifts: [defaultShift],
  notes: '',
  breakMode: 'manual',
  automaticBreaks: [],
  autoBreakWindow: { start: '11:00', end: '15:00' },
  breakDuration: 30,
  maxConcurrentBreaks: 2,
  startDate: '',
  endDate: ''
};

// Schedule Creation Wizard Component
const ScheduleWizard = ({ isOpen, onClose, onSave, existingSchedule }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: ScheduleData) => void;
  existingSchedule?: ScheduleData;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { language, isRTL } = useLanguage();
  const { hasPermission } = useAuth();
  const { workWeekType } = useCompanySettings();
  
  const [scheduleData, setScheduleData] = useState<ScheduleData>(initialScheduleData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeInputErrors, setTimeInputErrors] = useState<Record<string, string>>({});

  // Initialize with existing schedule data if editing
  useEffect(() => {
    if (existingSchedule) {
      setScheduleData(existingSchedule);
    }
  }, [existingSchedule]);

  // Auto-generate title when start date changes
  const handleStartDateChange = (dateValue: string) => {
    console.log('📅 Start date changed to:', dateValue);
    
    const startDate = new Date(dateValue);
    let endDate: Date;
    let title: string;
    
    switch (scheduleData.duration) {
      case 'daily':
        endDate = startDate;
        title = `Daily Schedule (${formatDate(startDate, 'MMM dd, yyyy')})`;
        break;
      case 'monthly':
        endDate = addMonths(startDate, 1);
        endDate.setDate(endDate.getDate() - 1); // Last day of month
        title = `Monthly Schedule (${formatDate(startDate, 'MMM yyyy')})`;
        break;
      case 'weekly':
      default:
        endDate = addDays(startDate, 6);
        const weekNumber = getISOWeek(startDate);
        title = `Week ${weekNumber} (${formatDate(startDate, 'MMM dd')} - ${formatDate(endDate, 'MMM dd')})`;
        break;
    }
    
    const endDateString = formatDate(endDate, 'yyyy-MM-dd');
    
    console.log('📝 Generated title:', title);
    console.log('📅 End date calculated:', endDateString);
    
    setScheduleData(prev => ({
      ...prev,
      title,
      dateRange: { 
        start: dateValue, 
        end: endDateString
      },
      startDate: dateValue,
      endDate: endDateString
    }));
    
    if (errors.startDate) {
      setErrors(prev => ({ ...prev, startDate: '' }));
    }
  };

  // Helper function to validate time format
  const isValidTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Helper function to clear time input errors
  const clearTimeError = (errorKey: string) => {
    setTimeInputErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });
  };

  // Helper function to set time input error
  const setTimeError = (errorKey: string, message: string) => {
    setTimeInputErrors(prev => ({
      ...prev,
      [errorKey]: message
    }));
  };

  const handleWeekendStartTimeChange = (day: string, time: string) => {
    console.log(`⏰ Setting weekend start time for ${day}:`, time);
    
    // Validate time format
    if (time && !isValidTimeFormat(time)) {
      setTimeError(`${day}-start`, 'Invalid time format');
      return;
    }
    
    setScheduleData(prev => ({
      ...prev,
      weekendDayHours: {
        ...prev.weekendDayHours,
        [day]: {
          ...prev.weekendDayHours[day],
          start: time
        }
      }
    }));
    
    // Clear any existing errors for this field
    clearTimeError(`weekendStart${day}`);
    
    // Validate end time is after start time
    const currentEndTime = scheduleData.weekendDayHours[day]?.end;
    if (currentEndTime && time >= currentEndTime) {
      setTimeError(`weekendEnd${day}`, language === 'he' ? 'שעת סיום חייבת להיות אחרי שעת התחלה' : 'End time must be after start time');
    } else if (currentEndTime) {
      clearTimeError(`weekendEnd${day}`);
    }
  };

  const handleWeekendEndTimeChange = (day: string, time: string) => {
    console.log(`⏰ Setting weekend end time for ${day}:`, time);
    
    // Validate time format
    if (time && !isValidTimeFormat(time)) {
      setTimeError(`${day}-end`, 'Invalid time format');
      return;
    }
    
    setScheduleData(prev => ({
      ...prev,
      weekendDayHours: {
        ...prev.weekendDayHours,
        [day]: {
          ...prev.weekendDayHours[day],
          end: time
        }
      }
    }));
    
    // Clear any existing errors for this field
    clearTimeError(`weekendEnd${day}`);
    
    // Validate end time is after start time
    const currentStartTime = scheduleData.weekendDayHours[day]?.start;
    if (currentStartTime && time <= currentStartTime) {
      setTimeError(`weekendEnd${day}`, language === 'he' ? 'שעת סיום חייבת להיות אחרי שעת התחלה' : 'End time must be after start time');
    }
  };

  // Single unified toggleWeekendDay function
  const toggleWeekendDay = (day: string) => {
    console.log('🔄 Toggling weekend day:', day);
    console.log('📅 Current selectedWeekendDays:', scheduleData.selectedWeekendDays);
    
    setScheduleData(prev => {
      const isCurrentlySelected = prev.selectedWeekendDays.includes(day);
      const newSelectedDays = isCurrentlySelected
        ? prev.selectedWeekendDays.filter(d => d !== day)
        : [...prev.selectedWeekendDays, day];
      
      // Clean up hours for unselected days
      const newWeekendDayHours = { ...prev.weekendDayHours };
      if (isCurrentlySelected) {
        delete newWeekendDayHours[day];
        console.log(`🗑️ Removed hours for ${day}`);
      } else {
        // Initialize with default hours when selecting a day
        newWeekendDayHours[day] = {
          start: prev.defaultStartTime || '09:00',
          end: prev.defaultEndTime || '17:00'
        };
        console.log(`✨ Initialized hours for ${day}:`, newWeekendDayHours[day]);
      }
      
      console.log('✅ New selectedWeekendDays:', newSelectedDays);
      console.log(`📝 ${isCurrentlySelected ? 'Removed' : 'Added'} ${day} ${isCurrentlySelected ? 'from' : 'to'} weekend days`);
      
      return {
        ...prev,
        selectedWeekendDays: newSelectedDays,
        weekendDayHours: newWeekendDayHours
      };
    });
  };

  // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Add shift
  const addShift = () => {
    const newShift: ShiftConfig = {
      id: Date.now().toString(),
      name: '',
      startTime: '09:00',
      endTime: '17:00',
      tagRequirement: 'none',
      requiredTags: [],
      maxEmployees: 1
    };
    
    setScheduleData(prev => ({
      ...prev,
      shifts: [...prev.shifts, newShift]
    }));
  };

  // Remove shift
  const removeShift = (index: number) => {
    if (scheduleData.shifts.length <= 1) return; // Keep at least one shift
    
    setScheduleData(prev => ({
      ...prev,
      shifts: prev.shifts.filter((_, i) => i !== index)
    }));
  };

  // Update shift
  const updateShift = (index: number, field: keyof ShiftConfig, value: any) => {
    setScheduleData(prev => ({
      ...prev,
      shifts: prev.shifts.map((shift, i) => 
        i === index ? { ...shift, [field]: value } : shift
      )
    }));
  };

  // Toggle tag for specific shift
  const toggleShiftTag = (shiftIndex: number, tagId: string) => {
    setScheduleData(prev => ({
      ...prev,
      shifts: prev.shifts.map((shift, index) => {
        if (index === shiftIndex) {
          const requiredTags = shift.requiredTags.includes(tagId)
            ? shift.requiredTags.filter(t => t !== tagId)
            : [...shift.requiredTags, tagId];
          return { ...shift, requiredTags };
        }
        return shift;
      })
    }));
  };

  // Add automatic break
  const addAutomaticBreak = () => {
    const newBreak: AutomaticBreak = {
      id: Date.now().toString(),
      earliestStart: '10:00',
      latestEnd: '14:00',
      duration: 20,
      maxConcurrentEmployees: 3
    };
    
    setScheduleData(prev => ({
      ...prev,
      automaticBreaks: [...prev.automaticBreaks, newBreak]
    }));
  };

  // Remove automatic break
  const removeAutomaticBreak = (index: number) => {
    setScheduleData(prev => ({
      ...prev,
      automaticBreaks: prev.automaticBreaks.filter((_, i) => i !== index)
    }));
  };

  // Update automatic break
  const updateAutomaticBreak = (index: number, field: keyof AutomaticBreak, value: any) => {
    setScheduleData(prev => ({
      ...prev,
      automaticBreaks: prev.automaticBreaks.map((breakItem, i) => 
        i === index ? { ...breakItem, [field]: value } : breakItem
      )
    }));
  };

  const validateStep = (step: number): boolean => {
    console.log(`🔍 Validating step ${step}`);
    console.log('📊 Current schedule data:', {
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate,
      dateRangeStart: scheduleData.dateRange.start,
      dateRangeEnd: scheduleData.dateRange.end,
      shiftsCount: scheduleData.shifts.length
    });
    
    switch (step) {
      case 1:
        const step1Valid = !!(scheduleData.startDate && scheduleData.endDate);
        console.log(`✅ Step 1 validation result: ${step1Valid}`);
        return step1Valid;
      case 2:
        const step2Valid = scheduleData.shifts.length > 0 && 
                          scheduleData.shifts.every(shift => 
                            shift.startTime && shift.endTime && shift.maxEmployees > 0
                          );
        console.log(`✅ Step 2 validation result: ${step2Valid}`);
        return step2Valid;
      case 3:
        console.log(`✅ Step 3 validation result: true (review step)`);
        return true; // Review step doesn't need validation
      default:
        return false;
    }
  };

  const validateBreakConfiguration = (data: ScheduleData): { isValid: boolean; message: string } => {
    if (data.breakMode !== 'automatic') {
      return { isValid: true, message: '' };
    }

    // Validate each automatic break
    for (const breakItem of data.automaticBreaks) {
      if (!breakItem.earliestStart || !breakItem.latestEnd) {
        return {
          isValid: false,
          message: language === 'he' ? 'יש למלא את כל זמני ההפסקות' : 'All break times must be filled'
        };
      }
      
      // Validate time format and range
      const startMinutes = timeToMinutes(breakItem.earliestStart);
      const endMinutes = timeToMinutes(breakItem.latestEnd);
      
      if (endMinutes <= startMinutes) {
        return {
          isValid: false,
          message: language === 'he' ? 'זמן סיום הפסקה חייב להיות אחרי זמן התחלה' : 'Break end time must be after start time'
        };
      }
      
      if (endMinutes - startMinutes < breakItem.duration) {
        return {
          isValid: false,
          message: language === 'he' ? 'חלון הזמן קצר מדי למשך ההפסקה' : 'Time window too short for break duration'
        };
      }
    }
    
    return { isValid: true, message: '' };
  };

  const getWeekendDays = () => {
    if (!scheduleData.dateRange.start || !scheduleData.dateRange.end) return [];
    
    const start = new Date(scheduleData.dateRange.start);
    const end = new Date(scheduleData.dateRange.end);
    const weekendDays = [];
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (workWeekType.weekendDays.includes(dayOfWeek)) {
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
        weekendDays.push({
          date: formatDate(date, 'yyyy-MM-dd'),
          dayName: dayName,
          dayNameHe: dayOfWeek === 5 ? 'יום שישי' : dayOfWeek === 6 ? 'יום שבת' : dayName
        });
      }
    }
    
    return weekendDays;
  };

  const handleNext = () => {
    console.log(`🚀 Attempting to proceed from step ${currentStep}`);
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        console.log(`✅ Advanced to step ${currentStep + 1}`);
      }
    } else {
      console.log(`❌ Cannot proceed from step ${currentStep} - validation failed`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fixed generateShifts function with comprehensive logging
  const generateShifts = (): any[] => {
    console.log('🏭 Starting shift generation...');
    console.log('📊 Schedule data:', {
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate,
      includeWeekends: scheduleData.includeWeekends,
      weekendHoursOption: scheduleData.weekendHoursOption,
      selectedWeekendDays: scheduleData.selectedWeekendDays,
      weekendDayHours: scheduleData.weekendDayHours,
      shiftsCount: scheduleData.shifts.length
    });
    
    const shifts: any[] = [];
    const startDate = new Date(scheduleData.startDate);
    const endDate = new Date(scheduleData.endDate);
    
    console.log(`📅 Generating shifts from ${formatDate(startDate, 'yyyy-MM-dd')} to ${formatDate(endDate, 'yyyy-MM-dd')}`);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
      const isWeekend = workWeekType.weekendDays.includes(dayOfWeek);
      const dateString = formatDate(date, 'yyyy-MM-dd');
      
      console.log(`📆 Processing ${dayName} (${dateString}) - Weekend: ${isWeekend}`);
      
      if (isWeekend) {
        // Handle weekend shifts
        if (!scheduleData.includeWeekends) {
          console.log(`⏭️ Skipping ${dayName} - weekends not included`);
          continue;
        }
        
        if (scheduleData.weekendHoursOption === 'same') {
          // Use regular shift hours for all weekend days
          console.log(`🔄 Using same hours for weekend ${dayName}`);
          scheduleData.shifts.forEach(shiftConfig => {
            const shift = {
              id: `${shiftConfig.id}-${dateString}`,
              name: shiftConfig.name,
              date: dateString,
              startTime: shiftConfig.startTime,
              endTime: shiftConfig.endTime,
              maxEmployees: shiftConfig.maxEmployees,
              tagRequirement: shiftConfig.tagRequirement,
              requiredTags: shiftConfig.requiredTags,
              isWeekend: true,
              weekendShiftStartTime: shiftConfig.startTime,
              weekendShiftEndTime: shiftConfig.endTime,
              category: 'weekend'
            };
            shifts.push(shift);
            console.log(`✅ Created weekend shift for ${dayName}:`, shift);
          });
        } else if (scheduleData.weekendHoursOption === 'different') {
          // Only create shifts for specifically selected weekend days
          if (scheduleData.selectedWeekendDays.includes(dayName)) {
            const dayHours = scheduleData.weekendDayHours[dayName];
            if (dayHours && dayHours.start && dayHours.end) {
              console.log(`🎯 Creating custom weekend shift for selected ${dayName}:`, dayHours);
              scheduleData.shifts.forEach(shiftConfig => {
                const shift = {
                  id: `${shiftConfig.id}-${dateString}`,
                  name: shiftConfig.name,
                  date: dateString,
                  startTime: dayHours.start,
                  endTime: dayHours.end,
                  maxEmployees: shiftConfig.maxEmployees,
                  tagRequirement: shiftConfig.tagRequirement,
                  requiredTags: shiftConfig.requiredTags,
                  isWeekend: true,
                  weekendShiftStartTime: dayHours.start,
                  weekendShiftEndTime: dayHours.end,
                  category: 'weekend'
                };
                shifts.push(shift);
                console.log(`✅ Created custom weekend shift for ${dayName}:`, shift);
              });
            } else {
              console.log(`⚠️ No hours configured for selected weekend day ${dayName}`);
            }
          } else {
            console.log(`⏭️ Skipping unselected weekend ${dayName}`);
          }
        }
      } else {
        // Regular weekday shift
        console.log(`📝 Creating regular weekday shift for ${dayName}`);
        scheduleData.shifts.forEach(shiftConfig => {
          const shift = {
            id: `${shiftConfig.id}-${dateString}`,
            name: shiftConfig.name,
            date: dateString,
            startTime: shiftConfig.startTime,
            endTime: shiftConfig.endTime,
            maxEmployees: shiftConfig.maxEmployees,
            tagRequirement: shiftConfig.tagRequirement,
            requiredTags: shiftConfig.requiredTags,
            isWeekend: false,
            category: 'regular'
          };
          shifts.push(shift);
          console.log(`✅ Created weekday shift for ${dayName}:`, shift);
        });
      }
    }
    
    console.log(`🎉 Shift generation complete! Generated ${shifts.length} shifts`);
    console.log('📋 All generated shifts:', shifts);
    
    return shifts;
  };

  const handleSave = async () => {
    console.log('💾 Starting save process...');
    if (!validateStep(currentStep)) {
      console.log('❌ Save aborted - validation failed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate shifts based on configuration
      const generatedShifts = generateShifts();
      const finalScheduleData = {
        ...scheduleData,
        shifts: generatedShifts
      };
      
      console.log('📤 Saving schedule data:', finalScheduleData);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSave(finalScheduleData);
      onClose();
      console.log('✅ Schedule saved successfully');
    } catch (error) {
      console.error('❌ Error saving schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: language === 'he' ? 'בחירת תאריכים' : 'Date Selection',
      description: language === 'he' ? 'בחר תאריכים ומשך זמן' : 'Select dates and duration'
    },
    {
      number: 2,
      title: language === 'he' ? 'הגדרת משמרות' : 'Shift Configuration',
      description: language === 'he' ? 'הגדר משמרות והפסקות' : 'Configure shifts and breaks'
    },
    {
      number: 3,
      title: language === 'he' ? 'סקירה ושמירה' : 'Review & Save',
      description: language === 'he' ? 'בדוק ושמור את הלוח' : 'Review and save schedule'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {existingSchedule 
                ? (language === 'he' ? 'ערוך לוח זמנים' : 'Edit Schedule')
                : (language === 'he' ? 'צור לוח זמנים חדש' : 'Create New Schedule')
              }
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'he' ? `שלב ${currentStep} מתוך 3` : `Step ${currentStep} of 3`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className={`ml-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {language === 'he' ? 'בחירת תאריכים ושעות' : 'Date and Time Selection'}
                </h3>

                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'he' ? 'משך הלוח' : 'Schedule Duration'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'daily', label: language === 'he' ? 'יומי' : 'Daily' },
                      { value: 'weekly', label: language === 'he' ? 'שבועי' : 'Weekly' },
                      { value: 'monthly', label: language === 'he' ? 'חודשי' : 'Monthly' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="duration"
                          value={option.value}
                          checked={scheduleData.duration === option.value}
                          onChange={(e) => {
                            setScheduleData(prev => ({ ...prev, duration: e.target.value as 'daily' | 'weekly' | 'monthly' }));
                            // Re-calculate dates if start date exists
                            if (scheduleData.dateRange.start) {
                              handleStartDateChange(scheduleData.dateRange.start);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'תאריך התחלה' : 'Start Date'} *
                    </label>
                    <input
                      type="date"
                      value={scheduleData.dateRange.start}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'תאריך סיום' : 'End Date'}
                    </label>
                    <input
                      type="date"
                      value={scheduleData.dateRange.end}
                      disabled
                      title={language === 'he' ? 'מחושב אוטומטית לפי משך הלוח' : 'Automatically calculated based on duration'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'he' ? 'מחושב אוטומטית לפי משך הלוח' : 'Automatically calculated based on duration'}
                    </p>
                  </div>
                </div>

                {/* Auto-generated title display */}
                {scheduleData.title && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {language === 'he' ? 'כותרת שנוצרה אוטומטית:' : 'Auto-generated title:'}
                        </p>
                        <p className="text-blue-800 font-medium">{scheduleData.title}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  {language === 'he' ? 'שעות משמרת ברירת מחדל' : 'Default Shift Hours'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'שעת התחלה' : 'Start Time'} *
                    </label>
                    <input
                      type="time"
                      value={scheduleData.defaultStartTime}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, defaultStartTime: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.defaultStartTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.defaultStartTime && (
                      <p className="text-red-600 text-sm mt-1">{errors.defaultStartTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'שעת סיום' : 'End Time'} *
                    </label>
                    <input
                      type="time"
                      value={scheduleData.defaultEndTime}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, defaultEndTime: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.defaultEndTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.defaultEndTime && (
                      <p className="text-red-600 text-sm mt-1">{errors.defaultEndTime}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Weekend Configuration */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="includeWeekends"
                    checked={scheduleData.includeWeekends}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, includeWeekends: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeWeekends" className="text-sm font-medium text-gray-700">
                    {language === 'he' ? 'כלול משמרות סוף השבוע' : 'Include weekend shifts'}
                  </label>
                </div>

                {scheduleData.includeWeekends && (
                  <div className="ml-6 space-y-4">
                    {getWeekendDays().length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              {language === 'he' ? 'משמרות סוף השבוע זמינות' : 'Weekend Shifts Available'}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                              {language === 'he' 
                                ? 'ניתן לתזמן משמרות בימי סוף השבוע'
                                : 'You can schedule shifts on weekend days'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {language === 'he' ? 'שעות סוף השבוע' : 'Weekend Hours'}
                      </label>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="weekendHours"
                            value="same"
                            checked={scheduleData.weekendHoursOption === 'same'}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, weekendHoursOption: 'same' }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {language === 'he' ? 'אותן שעות כמו ימי חול' : 'Same hours as weekdays'}
                          </span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="weekendHours"
                            value="different"
                            checked={scheduleData.weekendHoursOption === 'different'}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, weekendHoursOption: 'different' }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {language === 'he' ? 'שעות מותאמות אישית לימי סוף השבוע' : 'Custom hours for selected weekend days'}
                          </span>
                        </label>
                      </div>

                      {/* Individual Weekend Day Hours */}
                      {scheduleData.weekendHoursOption === 'different' && (
                        <div className="mt-4 space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          {/* Weekend Day Selection */}
                          <div>
                            <h4 className="font-medium text-blue-900 mb-3">
                              {language === 'he' ? 'בחר ימי סוף שבוע:' : 'Select weekend days:'}
                            </h4>
                            <div className="space-y-2">
                              {getWeekendDays().map(day => {
                                const dayDate = new Date(scheduleData.dateRange.start);
                                dayDate.setDate(dayDate.getDate() + ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day.dayName));
                                const isSelected = scheduleData.selectedWeekendDays.includes(day.dayName);
                                
                                return (
                                  <label key={day.dayName} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-25 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleWeekendDay(day.dayName)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                      <span className="font-medium text-blue-900">
                                        {language === 'he' ? day.dayNameHe : day.dayName}
                                      </span>
                                      <span className="text-sm text-blue-700 ml-2">
                                        ({formatDate(dayDate, 'MMM dd')})
                                      </span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                            
                            {scheduleData.selectedWeekendDays.length === 0 && (
                              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Info className="w-4 h-4 text-yellow-600" />
                                  <p className="text-sm text-yellow-800">
                                    {language === 'he' 
                                      ? 'בחר לפחות יום סוף שבוע אחד כדי להגדיר שעות מותאמות אישית'
                                      : 'Select at least one weekend day to configure custom hours'
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Time Configuration for Selected Days */}
                          {scheduleData.selectedWeekendDays.length > 0 && (
                            <div>
                              <h4 className="font-medium text-blue-900 mb-3">
                                {language === 'he' ? 'הגדר שעות לימים שנבחרו:' : 'Configure hours for selected days:'}
                              </h4>
                              <div className="space-y-4">
                                {scheduleData.selectedWeekendDays.map(day => {
                                  const dayDate = new Date(scheduleData.dateRange.start);
                                  dayDate.setDate(dayDate.getDate() + ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
                                  const dayHours = scheduleData.weekendDayHours[day];
                                  
                                  const startHour = dayHours?.start ? dayHours.start.split(':')[0] : '09';
                                  const startMinute = dayHours?.start ? dayHours.start.split(':')[1] : '00';
                                  const endHour = dayHours?.end ? dayHours.end.split(':')[0] : '17';
                                  const endMinute = dayHours?.end ? dayHours.end.split(':')[1] : '00';
                                  
                                  return (
                                    <div key={day} className="p-4 bg-white rounded-lg border border-blue-200">
                                      <label className="block text-sm font-medium text-blue-800 mb-3">
                                        {language === 'he' ? (day === 'Friday' ? 'יום שישי' : 'יום שבת') : day} ({formatDate(dayDate, 'MMM dd')})
                                      </label>
                                      
                                      {/* Time Display */}
                                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="text-center">
                                          <p className="text-sm text-blue-700 mb-1">
                                            {language === 'he' ? 'שעות שנבחרו:' : 'Selected Hours:'}
                                          </p>
                                          <p className="text-lg font-bold text-blue-900">
                                            {dayHours?.start || '09:00'} - {dayHours?.end || '17:00'}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {/* Start Time Dropdowns */}
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <label className="block text-xs text-blue-700 mb-1">
                                            {language === 'he' ? 'שעת התחלה' : 'Start Time'}
                                          </label>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-xs text-gray-500 mb-1">
                                                {language === 'he' ? 'שעה' : 'Hour'}
                                              </label>
                                              <select
                                                value={startHour}
                                                onChange={(e) => {
                                                  const newTime = `${e.target.value.padStart(2, '0')}:${startMinute}`;
                                                  handleWeekendStartTimeChange(day, newTime);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                              >
                                                {Array.from({ length: 24 }, (_, i) => (
                                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                                    {i.toString().padStart(2, '0')}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-500 mb-1">
                                                {language === 'he' ? 'דקות' : 'Minutes'}
                                              </label>
                                              <select
                                                value={startMinute}
                                                onChange={(e) => {
                                                  const newTime = `${startHour}:${e.target.value}`;
                                                  handleWeekendStartTimeChange(day, newTime);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                              >
                                                <option value="00">00</option>
                                                <option value="15">15</option>
                                                <option value="30">30</option>
                                                <option value="45">45</option>
                                              </select>
                                            </div>
                                          </div>
                                          {timeInputErrors[`weekendStart${day}`] && (
                                            <p className="text-red-600 text-xs mt-1">{timeInputErrors[`weekendStart${day}`]}</p>
                                          )}
                                        </div>
                                        
                                        {/* End Time Dropdowns */}
                                        <div>
                                          <label className="block text-xs text-blue-700 mb-1">
                                            {language === 'he' ? 'שעת סיום' : 'End Time'}
                                          </label>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-xs text-gray-500 mb-1">
                                                {language === 'he' ? 'שעה' : 'Hour'}
                                              </label>
                                              <select
                                                value={endHour}
                                                onChange={(e) => {
                                                  const newTime = `${e.target.value.padStart(2, '0')}:${endMinute}`;
                                                  handleWeekendEndTimeChange(day, newTime);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                              >
                                                {Array.from({ length: 24 }, (_, i) => (
                                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                                    {i.toString().padStart(2, '0')}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-500 mb-1">
                                                {language === 'he' ? 'דקות' : 'Minutes'}
                                              </label>
                                              <select
                                                value={endMinute}
                                                onChange={(e) => {
                                                  const newTime = `${endHour}:${e.target.value}`;
                                                  handleWeekendEndTimeChange(day, newTime);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                              >
                                                <option value="00">00</option>
                                                <option value="15">15</option>
                                                <option value="30">30</option>
                                                <option value="45">45</option>
                                              </select>
                                            </div>
                                          </div>
                                          {timeInputErrors[`weekendEnd${day}`] && (
                                            <p className="text-red-600 text-xs mt-1">{timeInputErrors[`weekendEnd${day}`]}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Shift Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {language === 'he' ? 'הגדרת משמרות' : 'Shift Configuration'}
                </h3>

                {/* Shift Templates */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {language === 'he' ? 'תבניות משמרות' : 'Shift Templates'}
                    </label>
                    <button
                      type="button"
                      onClick={addShift}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {language === 'he' ? 'הוסף משמרת' : 'Add Shift'}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {scheduleData.shifts.map((shift, index) => (
                      <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'שם המשמרת' : 'Shift Name'}
                            </label>
                            <input
                              type="text"
                              value={shift.name}
                              onChange={(e) => updateShift(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={language === 'he' ? 'למשל: משמרת בוקר' : 'e.g., Morning Shift'}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'שעת התחלה' : 'Start Time'}
                            </label>
                            <input
                              type="time"
                              value={shift.startTime}
                              onChange={(e) => updateShift(index, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'שעת סיום' : 'End Time'}
                            </label>
                            <input
                              type="time"
                              value={shift.endTime}
                              onChange={(e) => updateShift(index, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'מקסימום עובדים' : 'Max Employees'}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={shift.maxEmployees}
                              onChange={(e) => updateShift(index, 'maxEmployees', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        {/* Tags Assignment System */}
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">
                            {language === 'he' ? 'דרישות תגים לעובדים' : 'Employee Tag Requirements'}
                          </label>
                          
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`tagRequirement-${index}`}
                                checked={shift.tagRequirement === 'none'}
                                onChange={() => updateShift(index, 'tagRequirement', 'none')}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {language === 'he' ? 'ללא דרישות תגים ספציפיות' : 'No specific tag requirements'}
                              </span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`tagRequirement-${index}`}
                                checked={shift.tagRequirement === 'specific'}
                                onChange={() => updateShift(index, 'tagRequirement', 'specific')}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {language === 'he' ? 'דרוש עובדים עם תגים ספציפיים' : 'Require employees with specific tags'}
                              </span>
                            </label>
                          </div>
                          
                          {shift.tagRequirement === 'specific' && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {language === 'he' ? 'בחר תגים נדרשים:' : 'Select required tags:'}
                              </label>
                              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {availableTags.map(tag => (
                                    <label key={tag.id} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={shift.requiredTags.includes(tag.id)}
                                        onChange={() => toggleShiftTag(index, tag.id)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">
                                        {language === 'he' ? tag.nameHe : tag.nameEn}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              {shift.requiredTags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {shift.requiredTags.map(tagId => {
                                    const tag = availableTags.find(t => t.id === tagId);
                                    return tag ? (
                                      <span key={tagId} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        {language === 'he' ? tag.nameHe : tag.nameEn}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeShift(index)}
                          disabled={scheduleData.shifts.length <= 1}
                          className="inline-flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {language === 'he' ? 'הסר משמרת' : 'Remove Shift'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Break Configuration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'he' ? 'הגדרת הפסקות' : 'Break Configuration'}
                  </label>
                  
                  {/* Break Mode Selection */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="breakMode"
                          value="manual"
                          checked={scheduleData.breakMode === 'manual'}
                          onChange={(e) => setScheduleData(prev => ({ ...prev, breakMode: e.target.value as 'manual' | 'automatic' }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {language === 'he' ? 'הפסקות ידניות' : 'Manual Breaks'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {language === 'he' ? 'נהל הפסקות באופן ידני אחרי יצירת הלוח' : 'Manage breaks manually after schedule creation'}
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="breakMode"
                          value="automatic"
                          checked={scheduleData.breakMode === 'automatic'}
                          onChange={(e) => setScheduleData(prev => ({ ...prev, breakMode: e.target.value as 'manual' | 'automatic' }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {language === 'he' ? 'הפסקות אוטומטיות' : 'Automatic Breaks'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {language === 'he' ? 'הגדר הפסקות אוטומטיות עם חלונות זמן' : 'Configure automatic breaks with time windows'}
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    {/* Automatic Breaks Configuration */}
                    {scheduleData.breakMode === 'automatic' && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {language === 'he' ? 'הגדרת הפסקות אוטומטיות' : 'Automatic Break Configuration'}
                          </h4>
                          <button
                            type="button"
                            onClick={addAutomaticBreak}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {language === 'he' ? 'הוסף הפסקה' : 'Add Break'}
                          </button>
                        </div>
                        
                        {scheduleData.automaticBreaks.length === 0 ? (
                          <div className="text-center py-6">
                            <Coffee className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              {language === 'he' ? 'לא הוגדרו הפסקות אוטומטיות' : 'No automatic breaks configured'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {language === 'he' ? 'לחץ "הוסף הפסקה" כדי להתחיל' : 'Click "Add Break" to get started'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {scheduleData.automaticBreaks.map((breakItem, index) => (
                              <div key={breakItem.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium text-gray-900">
                                    {language === 'he' ? `הפסקה ${index + 1}` : `Break ${index + 1}`}
                                  </h5>
                                  <button
                                    type="button"
                                    onClick={() => removeAutomaticBreak(index)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      {language === 'he' ? 'התחלה מוקדמת' : 'Earliest Start'}
                                    </label>
                                    <input
                                      type="time"
                                      value={breakItem.earliestStart}
                                      onChange={(e) => updateAutomaticBreak(index, 'earliestStart', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      {language === 'he' ? 'סיום מאוחר' : 'Latest End'}
                                    </label>
                                    <input
                                      type="time"
                                      value={breakItem.latestEnd}
                                      onChange={(e) => updateAutomaticBreak(index, 'latestEnd', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      {language === 'he' ? 'משך (דקות)' : 'Duration (min)'}
                                    </label>
                                    <input
                                      type="number"
                                      min="5"
                                      max="60"
                                      step="5"
                                      value={breakItem.duration}
                                      onChange={(e) => updateAutomaticBreak(index, 'duration', parseInt(e.target.value))}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      {language === 'he' ? 'מקס בו-זמנית' : 'Max Concurrent'}
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={breakItem.maxConcurrentEmployees}
                                      onChange={(e) => updateAutomaticBreak(index, 'maxConcurrentEmployees', parseInt(e.target.value))}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Break Configuration Validation */}
                        {scheduleData.automaticBreaks.length > 0 && (
                          <div className="mt-4">
                            {(() => {
                              const validation = validateBreakConfiguration(scheduleData);
                              return (
                                <div className={`p-3 rounded-lg border ${
                                  validation.isValid 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    {validation.isValid ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                      validation.isValid ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                      {validation.message}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Generated Shifts Preview */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'he' ? 'תצוגה מקדימה של משמרות' : 'Generated Shifts Preview'}
                  </h4>
                  
                  {(() => {
                    const generatedShifts = generateShifts();
                    return generatedShifts.length > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <div className="space-y-2">
                          {generatedShifts.map((shift, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {formatDate(new Date(shift.date), 'EEEE, MMM dd')}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {shift.startTime} - {shift.endTime}
                                  {shift.isWeekend && (
                                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                      {language === 'he' ? 'סוף שבוע' : 'Weekend'}
                                    </span>
                                  )}
                                </div>
                                {shift.requiredTags && shift.requiredTags.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {language === 'he' ? 'תגים נדרשים: ' : 'Required tags: '}
                                    {shift.requiredTags.map(tagId => {
                                      const tag = availableTags.find(t => t.id === tagId);
                                      return tag ? (language === 'he' ? tag.nameHe : tag.nameEn) : tagId;
                                    }).join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-gray-500">
                          {language === 'he' 
                            ? 'לא ניתן ליצור משמרות עם הנתונים הנוכחיים'
                            : 'Cannot generate shifts with current data. Please check your date range and shift configuration.'
                          }
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'הערות (אופציונלי)' : 'Notes (Optional)'}
                  </label>
                  <textarea
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'he' ? 'הוסף הערות ללוח הזמנים...' : 'Add notes for this schedule...'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Save */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  {language === 'he' ? 'סקירה ושמירה' : 'Review & Save'}
                </h3>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{scheduleData.title}</p>
                          <p className="text-xs text-gray-500">{scheduleData.dateRange.start} - {scheduleData.dateRange.end}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-600">{scheduleData.shifts.length} {language === 'he' ? 'משמרות' : 'shifts'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weekend Shifts Information */}
                  {scheduleData.includeWeekends && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        {language === 'he' ? 'משמרות סוף השבוע' : 'Weekend Shifts'}
                      </h4>
                      {scheduleData.weekendHoursOption === 'same' ? (
                        <div className="text-sm text-yellow-700">
                          <p className="mb-1">
                            {language === 'he' 
                              ? 'משמרות יתווספו לכל ימי סוף השבוע עם אותן שעות כמו ימי החול'
                              : 'Shifts will be added to all weekend days with the same hours as weekdays'
                            }
                          </p>
                          <p>
                            {language === 'he' 
                              ? `ימי סוף השבוע: ${workWeekType.weekendDays.map(day => 
                                  ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][day]
                                ).join(', ')}`
                              : `Weekend days: ${workWeekType.weekendDays.map(day => 
                                  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
                                ).join(', ')}`
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {scheduleData.selectedWeekendDays.map(dayName => {
                            const dayHours = scheduleData.weekendDayHours[dayName];
                            const dayDisplayName = language === 'he' 
                              ? { Friday: 'שישי', Saturday: 'שבת', Sunday: 'ראשון' }[dayName] || dayName
                              : dayName.charAt(0).toUpperCase() + dayName.slice(1);
                            
                            return dayHours ? (
                              <div key={dayName} className="text-sm text-yellow-700">
                                <strong>{dayDisplayName}:</strong> {dayHours.start} - {dayHours.end}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'he' ? 'סיכום' : 'Summary'}
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>{language === 'he' ? 'תאריכים:' : 'Dates:'} {scheduleData.startDate} {language === 'he' ? 'עד' : 'to'} {scheduleData.endDate}</p>
                      <p>{language === 'he' ? 'משמרות:' : 'Shifts:'} {scheduleData.shifts.length}</p>
                      <p>{language === 'he' ? 'הפסקות:' : 'Breaks:'} {scheduleData.breakMode === 'automatic' ? `${scheduleData.automaticBreaks.length} ${language === 'he' ? 'אוטומטיות' : 'automatic'}` : language === 'he' ? 'ידני' : 'manual'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {language === 'he' ? 'הקודם' : 'Previous'}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>
            
            <button
              onClick={currentStep === 3 ? handleSave : handleNext}
              disabled={!validateStep(currentStep)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 3 ? (language === 'he' ? 'שמור לוח זמנים' : 'Save Schedule') : (language === 'he' ? 'המשך' : 'Next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Schedules Component
export default function Schedules() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentShift, setAssignmentShift] = useState<Shift | null>(null);
  
  const { language, isRTL } = useLanguage();
  const { hasPermission } = useAuth();
  const { workWeekType } = useCompanySettings();

  // Mock job templates for validation
  const mockJobTemplates: JobTemplate[] = [
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
      assignedEmployees: 5
    }
  ];

  // Mock employee data with template assignments
  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Manager',
      department: 'Sales',
      location: 'Store #1',
      tags: ['Team Lead', 'Trainer'],
      email: 'sarah.johnson@company.com',
      isActive: true,
      assignedTemplate: '1',
      currentWeekShifts: []
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Sales Associate',
      department: 'Sales',
      location: 'Store #1',
      tags: ['Cashier', 'Team 1'],
      email: 'michael.chen@company.com',
      isActive: true,
      assignedTemplate: '1',
      currentWeekShifts: []
    },
    {
      id: '3',
      name: 'Emily Davis',
      role: 'Cashier',
      department: 'Operations',
      location: 'Store #2',
      tags: ['Cashier', 'Team 2'],
      email: 'emily.davis@company.com',
      isActive: true,
      assignedTemplate: undefined,
      currentWeekShifts: []
    },
    {
      id: '4',
      name: 'Alex Thompson',
      role: 'Stock Associate',
      department: 'Operations',
      location: 'Store #1',
      tags: ['Inventory', 'Team 3'],
      email: 'alex.thompson@company.com',
      isActive: true,
      assignedTemplate: undefined,
      currentWeekShifts: []
    },
    {
      id: '5',
      name: 'Jessica Wong',
      role: 'Customer Service',
      department: 'Customer Service',
      location: 'Store #2',
      tags: ['Support', 'Team Lead'],
      email: 'jessica.wong@company.com',
      isActive: true,
      assignedTemplate: undefined,
      currentWeekShifts: []
    },
    {
      id: '6',
      name: 'David Rodriguez',
      role: 'Supervisor',
      department: 'Operations',
      location: 'Store #1',
      tags: ['Supervisor', 'Team 3'],
      email: 'david.rodriguez@company.com',
      isActive: true,
      assignedTemplate: undefined,
      currentWeekShifts: []
    },
    {
      id: '7',
      name: 'Lisa Anderson',
      role: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Store #2',
      tags: ['Marketing', 'Creative'],
      email: 'lisa.anderson@company.com',
      isActive: true,
      assignedTemplate: undefined,
      currentWeekShifts: []
    },
    {
      id: '8',
      name: 'Robert Kim',
      role: 'Security Guard',
      department: 'Security',
      location: 'Store #1',
      tags: ['Security', 'Night Shift'],
      email: 'robert.kim@company.com',
      isActive: true,
      assignedTemplate: undefined,
      currentWeekShifts: []
    }
  ];

  // Mock shifts data
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      date: '2024-01-22',
      startTime: '09:00',
      endTime: '17:00',
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      role: 'Manager',
      department: 'Sales',
      location: 'Main Store',
      status: 'confirmed',
      breaks: [{ startTime: '12:00', duration: 30 }],
      isWeekend: false,
      category: 'regular',
      assignedEmployees: [mockEmployees[0]],
      maxEmployees: 2,
      requiredTags: ['manager']
    },
    {
      id: '2',
      date: '2024-01-26',
      startTime: '10:00',
      endTime: '18:00',
      weekendShiftStartTime: '10:00',
      weekendShiftEndTime: '18:00',
      employeeId: '2',
      employeeName: 'Mike Chen',
      role: 'Sales Associate',
      department: 'Sales',
      location: 'Main Store',
      status: 'scheduled',
      breaks: [{ startTime: '13:00', duration: 30 }],
      isWeekend: true,
      category: 'weekend',
      assignedEmployees: [],
      maxEmployees: 3,
      requiredTags: ['cashier']
    }
  ]);

  const canManageSchedules = hasPermission('manage_schedules');

  // Helper function to get employee template
  const getEmployeeTemplate = (templateId: string): JobTemplate | null => {
    return mockJobTemplates.find(t => t.id === templateId) || null;
  };

  // Helper function to calculate shift duration
  const calculateShiftDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const handleCreateSchedule = (scheduleData: ScheduleData) => {
    console.log('📝 Creating new schedule with data:', scheduleData);
    // Add the new shifts to the existing shifts
    setShifts(prev => [...prev, ...scheduleData.shifts]);
    setShowWizard(false);
  };

  const handleEditSchedule = (scheduleData: ScheduleData) => {
    console.log('✏️ Editing schedule with data:', scheduleData);
    // Update existing shifts
    setShifts(prev => prev.map(shift => {
      const updatedShift = scheduleData.shifts.find(s => s.id === shift.id);
      return updatedShift || shift;
    }));
    setEditingSchedule(null);
    setShowWizard(false);
  };

  const handleEmployeeAssignment = (shiftId: string, employees: Employee[]) => {
    setShifts(prev => prev.map(shift => 
      shift.id === shiftId 
        ? { 
            ...shift, 
            assignedEmployees: employees,
            employeeName: employees.length > 0 ? employees[0].name : '',
            employeeId: employees.length > 0 ? employees[0].id : ''
          }
        : shift
    ));
  };

  const openAssignmentModal = (shift: Shift) => {
    setAssignmentShift(shift);
    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setAssignmentShift(null);
  };

  const getWeekDates = () => {
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  };

  const getShiftsForDate = (date: Date) => {
    const dateString = formatDate(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateString);
  };

  const getStaffingStatus = (shift: Shift) => {
    const assigned = shift.assignedEmployees?.length || 0;
    const max = shift.maxEmployees || 1;
    
    if (assigned === 0) return { status: 'unstaffed', color: 'bg-red-100 border-red-200', textColor: 'text-red-700' };
    if (assigned < max) return { status: 'partial', color: 'bg-yellow-100 border-yellow-200', textColor: 'text-yellow-700' };
    return { status: 'full', color: 'bg-green-100 border-green-200', textColor: 'text-green-700' };
  };

  const renderCalendarView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {formatDate(weekDates[0], 'MMM dd')} - {formatDate(weekDates[6], 'MMM dd, yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {canManageSchedules && (
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'he' ? 'צור לוח זמנים' : 'Create Schedule'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7">
          {weekDates.map((date, index) => {
            const isWeekend = isWeekendDay(date, workWeekType);
            const dayShifts = getShiftsForDate(date);
            
            return (
              <div key={index} className={`border-r border-gray-200 last:border-r-0 ${isWeekend ? 'bg-yellow-50' : ''}`}>
                <div className="p-4 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(date, 'EEE')}
                    </div>
                    <div className={`text-lg font-bold ${
                      isSameDay(date, new Date()) ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {formatDate(date, 'd')}
                    </div>
                    {isWeekend && (
                      <div className="text-xs text-yellow-600 font-medium">
                        {language === 'he' ? 'סוף שבוע' : 'Weekend'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-2 min-h-[200px]">
                  {dayShifts.map(shift => {
                    const staffingStatus = getStaffingStatus(shift);
                    const assignedCount = shift.assignedEmployees?.length || 0;
                    const maxCount = shift.maxEmployees || 1;
                    
                    return (
                      <div
                        key={shift.id}
                        className={`mb-2 p-3 rounded-lg text-xs cursor-pointer hover:shadow-md transition-all border ${staffingStatus.color}`}
                        onClick={() => openAssignmentModal(shift)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            {shift.startTime} - {shift.endTime}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${staffingStatus.textColor} bg-white/50`}>
                            {assignedCount}/{maxCount}
                          </div>
                        </div>
                        
                        {/* Employee Avatars */}
                        {shift.assignedEmployees && shift.assignedEmployees.length > 0 ? (
                          <div className="flex items-center gap-1 mb-2">
                            {shift.assignedEmployees.slice(0, 3).map(employee => (
                              <div key={employee.id} className="relative">
                                {employee.avatar ? (
                                  <img
                                    src={employee.avatar}
                                    alt={employee.name}
                                    className="w-6 h-6 rounded-full object-cover border border-white"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium border border-white">
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                )}
                              </div>
                            ))}
                            {shift.assignedEmployees.length > 3 && (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                +{shift.assignedEmployees.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-500 mb-2">
                            {language === 'he' ? 'לא מאויש' : 'Unassigned'}
                          </div>
                        )}
                        
                        <div className="text-gray-500 text-xs">
                          {shift.department}
                          
                          {/* Required Tags Indicator */}
                          {shift.requiredTags && shift.requiredTags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {shift.requiredTags.slice(0, 2).map(tagId => {
                                const tag = availableTags.find(t => t.id === tagId);
                                return tag ? (
                                  <span key={tagId} className="px-1 py-0.5 bg-blue-200 text-blue-800 text-xs rounded">
                                    {language === 'he' ? tag.nameHe : tag.nameEn}
                                  </span>
                                ) : null;
                              })}
                              {shift.requiredTags.length > 2 && (
                                <span className="px-1 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                  +{shift.requiredTags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {dayShifts.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No shifts</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'he' ? 'לוחות זמנים' : 'Schedules'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'he' ? 'נהל לוחות זמנים ומשמרות' : 'Manage schedules and shifts'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'he' ? 'סינון' : 'Filters'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={language === 'he' ? 'חפש עובדים...' : 'Search employees...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'he' ? 'כל המחלקות' : 'All Departments'}</option>
            <option value="Sales">{language === 'he' ? 'מכירות' : 'Sales'}</option>
            <option value="Operations">{language === 'he' ? 'תפעול' : 'Operations'}</option>
            <option value="Customer Service">{language === 'he' ? 'שירות לקוחות' : 'Customer Service'}</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{language === 'he' ? 'כל הסטטוסים' : 'All Statuses'}</option>
            <option value="scheduled">{language === 'he' ? 'מתוזמן' : 'Scheduled'}</option>
            <option value="confirmed">{language === 'he' ? 'מאושר' : 'Confirmed'}</option>
            <option value="cancelled">{language === 'he' ? 'מבוטל' : 'Cancelled'}</option>
          </select>
          
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {renderCalendarView()}

      {/* Schedule Creation Wizard */}
      <ScheduleWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setEditingSchedule(null);
        }}
        onSave={editingSchedule ? handleEditSchedule : handleCreateSchedule}
        existingSchedule={editingSchedule || undefined}
      />

      {/* Employee Assignment Modal */}
      <EmployeeAssignmentModal
        isOpen={showAssignmentModal}
        onClose={closeAssignmentModal}
        shift={assignmentShift}
        onAssign={handleEmployeeAssignment}
      />

      {/* Shift Details Modal */}
      {selectedShift && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'he' ? 'פרטי משמרת' : 'Shift Details'}
                </h3>
                <button
                  onClick={() => setSelectedShift(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'he' ? 'תאריך:' : 'Date:'}</span>
                  <span className="font-medium">{selectedShift.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'he' ? 'שעות:' : 'Hours:'}</span>
                  <span className="font-medium">
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'he' ? 'עובד:' : 'Employee:'}</span>
                  <span className="font-medium">{selectedShift.employeeName || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'he' ? 'מחלקה:' : 'Department:'}</span>
                  <span className="font-medium">{selectedShift.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'he' ? 'מיקום:' : 'Location:'}</span>
                  <span className="font-medium">{selectedShift.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{language === 'he' ? 'סטטוס:' : 'Status:'}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedShift.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    selectedShift.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedShift.status}
                  </span>
                </div>
                {selectedShift.isWeekend && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'he' ? 'סוג:' : 'Type:'}</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {language === 'he' ? 'סוף שבוע' : 'Weekend'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}