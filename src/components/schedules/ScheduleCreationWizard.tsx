import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, ArrowLeft, ArrowRight, Save, AlertTriangle, Info, Plus, Tag, Coffee } from 'lucide-react';
import { getISOWeek, format, addDays, addMonths } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCompanySettings } from '../../contexts/CompanySettingsContext';
import { isWeekendDay, detectShiftCategory } from '../../utils/workWeekUtils';

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
  requiredEmployees: number;
}

interface ShiftTemplate {
  id: string;
  startTime: string;
  endTime: string;
  requiredEmployees: number;
}

interface ScheduleData {
  title: string;
  duration: 'daily' | 'weekly' | 'monthly';
  dateRange: {
    start: string;
    end: string;
  };
  shifts: ShiftTemplate[];
  departments: string[];
  requiredTags: string[];
  includeWeekends: boolean;
  weekendHoursOption: 'same' | 'different';
  weekendDayHours: Record<string, { start: string; end: string }>;
  breakMode: 'manual' | 'automatic';
  autoBreakWindow: { start: string; end: string };
  breakDuration: number;
  maxConcurrentBreaks: number;
  notes: string;
}

interface ScheduleCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: ScheduleData) => void;
  existingSchedule?: ScheduleData;
}

export default function ScheduleCreationWizard({ 
  isOpen, 
  onClose, 
  onSave, 
  existingSchedule 
}: ScheduleCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { language, isRTL } = useLanguage();
  const { hasPermission } = useAuth();
  const { workWeekType } = useCompanySettings();
  
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    title: '',
    duration: 'weekly',
    dateRange: {
      start: '',
      end: ''
    },
    shifts: [{
      id: '1',
      startTime: '09:00',
      endTime: '17:00',
      requiredEmployees: 1
    }],
    departments: [],
    requiredTags: [],
    includeWeekends: false,
    weekendHoursOption: 'same',
    weekendDayHours: {},
    breakMode: 'automatic',
    autoBreakWindow: { start: '11:00', end: '15:00' },
    breakDuration: 30,
    maxConcurrentBreaks: 2,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined tags with Hebrew translations
  const availableTags = [
    { id: 'english_speaker', en: 'English Speaker', he: 'דובר אנגלית' },
    { id: 'team_leader', en: 'Team Leader', he: 'מוביל צוות' },
    { id: 'cook', en: 'Cook', he: 'טבח' },
    { id: 'waiter', en: 'Waiter', he: 'מלצר' },
    { id: 'cashier', en: 'Cashier', he: 'קופאי' },
    { id: 'security_certified', en: 'Security Certified', he: 'מוסמך אבטחה' },
    { id: 'driver_license', en: 'Driver License', he: 'רישיון נהיגה' },
    { id: 'first_aid_certified', en: 'First Aid Certified', he: 'מוסמך עזרה ראשונה' },
    { id: 'manager', en: 'Manager', he: 'מנהל' },
    { id: 'senior_staff', en: 'Senior Staff', he: 'צוות בכיר' },
    { id: 'customer_service_expert', en: 'Customer Service Expert', he: 'מומחה שירות לקוחות' }
  ];

  // Initialize with existing schedule data if editing
  useEffect(() => {
    if (existingSchedule) {
      setScheduleData(existingSchedule);
    }
  }, [existingSchedule]);

  // Auto-generate title when start date or duration changes
  const handleStartDateChange = (dateValue: string) => {
    if (!dateValue) return;

    const startDate = new Date(dateValue);
    let endDate: Date;
    let title: string;

    switch (scheduleData.duration) {
      case 'daily':
        endDate = startDate;
        title = `Daily Schedule (${format(startDate, 'MMM dd, yyyy')})`;
        break;
      case 'weekly':
        endDate = addDays(startDate, 6);
        const weekNumber = getISOWeek(startDate);
        title = `Week ${weekNumber} (${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')})`;
        break;
      case 'monthly':
        endDate = addMonths(startDate, 1);
        endDate = addDays(endDate, -1); // Last day of month
        title = `Monthly Schedule (${format(startDate, 'MMM yyyy')})`;
        break;
      default:
        endDate = addDays(startDate, 6);
        title = `Schedule (${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')})`;
    }
    
    setScheduleData(prev => ({ 
      ...prev, 
      dateRange: {
        start: dateValue,
        end: format(endDate, 'yyyy-MM-dd')
      },
      title 
    }));
    
    if (errors.startDate) {
      setErrors(prev => ({ ...prev, startDate: '' }));
    }
  };

  const handleDurationChange = (duration: 'daily' | 'weekly' | 'monthly') => {
    setScheduleData(prev => ({ ...prev, duration }));
    
    // Recalculate end date if start date exists
    if (scheduleData.dateRange.start) {
      handleStartDateChange(scheduleData.dateRange.start);
    }
  };

  const addNewShift = () => {
    const newShift: ShiftTemplate = {
      id: Date.now().toString(),
      startTime: '09:00',
      endTime: '17:00',
      requiredEmployees: 1
    };
    
    setScheduleData(prev => ({
      ...prev,
      shifts: [...prev.shifts, newShift]
    }));
  };

  const removeShift = (shiftId: string) => {
    if (scheduleData.shifts.length <= 1) return; // Minimum 1 shift required
    
    setScheduleData(prev => ({
      ...prev,
      shifts: prev.shifts.filter(shift => shift.id !== shiftId)
    }));
  };

  const updateShift = (shiftId: string, field: keyof ShiftTemplate, value: any) => {
    setScheduleData(prev => ({
      ...prev,
      shifts: prev.shifts.map(shift =>
        shift.id === shiftId ? { ...shift, [field]: value } : shift
      )
    }));
  };

  const toggleTag = (tagId: string) => {
    setScheduleData(prev => ({
      ...prev,
      requiredTags: prev.requiredTags.includes(tagId)
        ? prev.requiredTags.filter(id => id !== tagId)
        : [...prev.requiredTags, tagId]
    }));
  };

  const toggleDepartment = (department: string) => {
    setScheduleData(prev => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department]
    }));
  };

  const updateWeekendDayHours = (day: string, field: 'start' | 'end', value: string) => {
    setScheduleData(prev => ({
      ...prev,
      weekendDayHours: {
        ...prev.weekendDayHours,
        [day]: {
          ...prev.weekendDayHours[day],
          [field]: value
        }
      }
    }));
  };

  const validateBreakConfiguration = () => {
    if (scheduleData.breakMode === 'manual') return true;
    
    // Validate automatic break configuration
    const windowStart = new Date(`2000-01-01T${scheduleData.autoBreakWindow.start}:00`);
    const windowEnd = new Date(`2000-01-01T${scheduleData.autoBreakWindow.end}:00`);
    const windowDuration = (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60); // minutes
    
    const totalBreakTime = scheduleData.breakDuration * scheduleData.maxConcurrentBreaks;
    
    return windowDuration >= totalBreakTime;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!scheduleData.dateRange.start) {
          newErrors.startDate = language === 'he' ? 'תאריך התחלה נדרש' : 'Start date is required';
        }
        break;
      case 2:
        if (scheduleData.shifts.length === 0) {
          newErrors.shifts = language === 'he' ? 'נדרשת לפחות משמרת אחת' : 'At least one shift is required';
        }
        
        // Validate shift times
        scheduleData.shifts.forEach((shift, index) => {
          if (!shift.startTime) {
            newErrors[`shift_${index}_start`] = language === 'he' ? 'שעת התחלה נדרשת' : 'Start time required';
          }
          if (!shift.endTime) {
            newErrors[`shift_${index}_end`] = language === 'he' ? 'שעת סיום נדרשת' : 'End time required';
          }
          if (shift.requiredEmployees < 1) {
            newErrors[`shift_${index}_employees`] = language === 'he' ? 'נדרש לפחות עובד אחד' : 'At least 1 employee required';
          }
        });
        
        // Validate break configuration
        if (!validateBreakConfiguration()) {
          newErrors.breaks = language === 'he' ? 'הגדרת הפסקות לא תקינה' : 'Invalid break configuration';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(scheduleData);
      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekendDays = () => {
    if (!scheduleData.dateRange.start) return [];
    
    const startDate = new Date(scheduleData.dateRange.start);
    const endDate = new Date(scheduleData.dateRange.end);
    const weekendDays = [];
    
    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
      if (isWeekendDay(date, workWeekType)) {
        weekendDays.push({
          date: format(date, 'yyyy-MM-dd'),
          dayName: format(date, 'EEEE'),
          displayDate: format(date, 'MMM dd')
        });
      }
    }
    
    return weekendDays;
  };

  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: language === 'he' ? 'בחירת תאריכים' : 'Date Selection',
      description: language === 'he' ? 'בחר תאריכי התחלה ומשך זמן' : 'Select start date and duration'
    },
    {
      number: 2,
      title: language === 'he' ? 'הגדרת משמרות' : 'Shift Configuration',
      description: language === 'he' ? 'הגדר משמרות, מחלקות ותגים' : 'Configure shifts, departments and tags'
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
                  {language === 'he' ? 'בחירת תאריכים ומשך זמן' : 'Date and Duration Selection'}
                </h3>
                
                {/* Duration Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'he' ? 'משך הלוח' : 'Schedule Duration'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'daily', label: language === 'he' ? 'יומי' : 'Daily', desc: language === 'he' ? 'לוח ליום אחד' : 'Single day schedule' },
                      { value: 'weekly', label: language === 'he' ? 'שבועי' : 'Weekly', desc: language === 'he' ? 'לוח לשבוע שלם' : 'Full week schedule' },
                      { value: 'monthly', label: language === 'he' ? 'חודשי' : 'Monthly', desc: language === 'he' ? 'לוח לחודש שלם' : 'Full month schedule' }
                    ].map(option => (
                      <label
                        key={option.value}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          scheduleData.duration === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duration"
                          value={option.value}
                          checked={scheduleData.duration === option.value}
                          onChange={(e) => handleDurationChange(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                        </div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'he' ? 'מחושב אוטומטית' : 'Automatically calculated'}
                    </p>
                  </div>
                </div>

                {/* Auto-generated title display */}
                {scheduleData.title && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {language === 'he' ? 'כותרת שנוצרה אוטומטית:' : 'Auto-generated title:'}
                        </p>
                        <p className="text-blue-800 font-semibold">{scheduleData.title}</p>
                      </div>
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
                  <Clock className="w-5 h-5 text-blue-600" />
                  {language === 'he' ? 'הגדרת משמרות' : 'Shift Configuration'}
                </h3>

                {/* Multiple Shifts */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      {language === 'he' ? 'משמרות' : 'Shifts'}
                    </h4>
                    <button
                      onClick={addNewShift}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'he' ? 'הוסף משמרת' : 'Add Shift'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {scheduleData.shifts.map((shift, index) => (
                      <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">
                            {language === 'he' ? `משמרת ${index + 1}` : `Shift ${index + 1}`}
                          </h5>
                          {scheduleData.shifts.length > 1 && (
                            <button
                              onClick={() => removeShift(shift.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'שעת התחלה' : 'Start Time'} *
                            </label>
                            <input
                              type="time"
                              value={shift.startTime}
                              onChange={(e) => updateShift(shift.id, 'startTime', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors[`shift_${index}_start`] ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors[`shift_${index}_start`] && (
                              <p className="text-red-600 text-sm mt-1">{errors[`shift_${index}_start`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'שעת סיום' : 'End Time'} *
                            </label>
                            <input
                              type="time"
                              value={shift.endTime}
                              onChange={(e) => updateShift(shift.id, 'endTime', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors[`shift_${index}_end`] ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors[`shift_${index}_end`] && (
                              <p className="text-red-600 text-sm mt-1">{errors[`shift_${index}_end`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'עובדים נדרשים' : 'Required Employees'} *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={shift.requiredEmployees}
                              onChange={(e) => updateShift(shift.id, 'requiredEmployees', parseInt(e.target.value))}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors[`shift_${index}_employees`] ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors[`shift_${index}_employees`] && (
                              <p className="text-red-600 text-sm mt-1">{errors[`shift_${index}_employees`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.shifts && (
                    <p className="text-red-600 text-sm mt-1">{errors.shifts}</p>
                  )}
                </div>

                {/* Departments (Optional) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'he' ? 'מחלקות (אופציונלי)' : 'Departments (Optional)'}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Sales', 'Operations', 'Customer Service', 'Security', 'Management'].map(department => (
                      <label key={department} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={scheduleData.departments.includes(department)}
                          onChange={() => toggleDepartment(department)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language === 'he' ? 
                            (department === 'Sales' ? 'מכירות' :
                             department === 'Operations' ? 'תפעול' :
                             department === 'Customer Service' ? 'שירות לקוחות' :
                             department === 'Security' ? 'אבטחה' :
                             department === 'Management' ? 'ניהול' : department)
                            : department
                          }
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags/Skills System */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'he' ? 'תגים/כישורים נדרשים (אופציונלי)' : 'Required Tags/Skills (Optional)'}
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {availableTags.map(tag => (
                      <label key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={scheduleData.requiredTags.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language === 'he' ? tag.he : tag.en}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Weekend Configuration */}
                <div className="mb-6">
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
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              {language === 'he' ? 'משמרות סוף השבוע זמינות' : 'Weekend Shifts Available'}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                              {language === 'he' 
                                ? 'משמרות בימי סוף השבוע יהיו זמינות לעובדים'
                                : 'Weekend shifts will be available for employees'
                              }
                            </p>
                          </div>
                        </div>
                      </div>

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
                              {language === 'he' ? 'שעות שונות לכל יום סוף השבוע' : 'Different hours per weekend day'}
                            </span>
                          </label>
                        </div>

                        {scheduleData.weekendHoursOption === 'different' && (
                          <div className="mt-4 space-y-3">
                            <h5 className="text-sm font-medium text-gray-700">
                              {language === 'he' ? 'הגדר שעות לכל יום סוף השבוע:' : 'Set hours for each weekend day:'}
                            </h5>
                            {getWeekendDays().map(day => (
                              <div key={day.date} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">
                                    {language === 'he' ? day.dayName : day.dayName} - {day.displayDate}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                      {language === 'he' ? 'שעת התחלה' : 'Start Time'}
                                    </label>
                                    <input
                                      type="time"
                                      value={scheduleData.weekendDayHours[day.date]?.start || ''}
                                      onChange={(e) => updateWeekendDayHours(day.date, 'start', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                      {language === 'he' ? 'שעת סיום' : 'End Time'}
                                    </label>
                                    <input
                                      type="time"
                                      value={scheduleData.weekendDayHours[day.date]?.end || ''}
                                      onChange={(e) => updateWeekendDayHours(day.date, 'end', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advanced Break Configuration */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-orange-600" />
                    {language === 'he' ? 'הגדרת הפסקות' : 'Break Configuration'}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {language === 'he' ? 'מצב הפסקות' : 'Break Mode'}
                      </label>
                      
                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input
                            type="radio"
                            name="breakMode"
                            value="automatic"
                            checked={scheduleData.breakMode === 'automatic'}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, breakMode: 'automatic' }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                          />
                          <div className="ml-2">
                            <span className="text-sm font-medium text-gray-700">
                              {language === 'he' ? 'אוטומטי' : 'Automatic'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {language === 'he' 
                                ? 'המערכת תקצה הפסקות אוטומטית בחלון הזמן שנבחר'
                                : 'System will automatically assign breaks within selected time window'
                              }
                            </p>
                          </div>
                        </label>
                        
                        <label className="flex items-start">
                          <input
                            type="radio"
                            name="breakMode"
                            value="manual"
                            checked={scheduleData.breakMode === 'manual'}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, breakMode: 'manual' }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                          />
                          <div className="ml-2">
                            <span className="text-sm font-medium text-gray-700">
                              {language === 'he' ? 'ידני' : 'Manual'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {language === 'he' 
                                ? 'תוכל להקצות הפסקות ידנית לאחר יצירת הלוח'
                                : 'You can manually assign breaks after schedule creation'
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {scheduleData.breakMode === 'automatic' && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'תחילת חלון הפסקות' : 'Break Window Start'}
                            </label>
                            <input
                              type="time"
                              value={scheduleData.autoBreakWindow.start}
                              onChange={(e) => setScheduleData(prev => ({
                                ...prev,
                                autoBreakWindow: { ...prev.autoBreakWindow, start: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'סיום חלון הפסקות' : 'Break Window End'}
                            </label>
                            <input
                              type="time"
                              value={scheduleData.autoBreakWindow.end}
                              onChange={(e) => setScheduleData(prev => ({
                                ...prev,
                                autoBreakWindow: { ...prev.autoBreakWindow, end: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'משך הפסקה (דקות)' : 'Break Duration (minutes)'}
                            </label>
                            <input
                              type="number"
                              min="15"
                              max="60"
                              step="5"
                              value={scheduleData.breakDuration}
                              onChange={(e) => setScheduleData(prev => ({ ...prev, breakDuration: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {language === 'he' ? 'מקסימום הפסקות בו-זמנית' : 'Max Concurrent Breaks'}
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={scheduleData.maxConcurrentBreaks}
                              onChange={(e) => setScheduleData(prev => ({ ...prev, maxConcurrentBreaks: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Break Validation Status */}
                        <div className={`p-3 rounded-lg border ${
                          validateBreakConfiguration() 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {validateBreakConfiguration() ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              validateBreakConfiguration() ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {validateBreakConfiguration() 
                                ? (language === 'he' ? 'הגדרת הפסקות תקינה' : 'Break configuration is valid')
                                : (language === 'he' ? 'הגדרת הפסקות לא תקינה' : 'Break configuration is invalid')
                              }
                            </span>
                          </div>
                          {!validateBreakConfiguration() && (
                            <p className="text-xs text-red-700 mt-1">
                              {language === 'he' 
                                ? 'חלון הזמן קצר מדי למספר ההפסקות הנדרש'
                                : 'Time window is too short for the required number of breaks'
                              }
                            </p>
                          )}
                        </div>
                        {errors.breaks && (
                          <p className="text-red-600 text-sm mt-1">{errors.breaks}</p>
                        )}
                      </div>
                    )}
                  </div>
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
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {language === 'he' ? 'פרטי לוח הזמנים' : 'Schedule Details'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'he' ? 'כותרת:' : 'Title:'}</span>
                          <span className="font-medium text-gray-900">{scheduleData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'he' ? 'משך זמן:' : 'Duration:'}</span>
                          <span className="font-medium text-gray-900">
                            {language === 'he' ? 
                              (scheduleData.duration === 'daily' ? 'יומי' :
                               scheduleData.duration === 'weekly' ? 'שבועי' : 'חודשי')
                              : scheduleData.duration
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'he' ? 'תאריכים:' : 'Dates:'}</span>
                          <span className="font-medium text-gray-900">
                            {scheduleData.dateRange.start} - {scheduleData.dateRange.end}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'he' ? 'כולל סופי שבוע:' : 'Include Weekends:'}</span>
                          <span className="font-medium text-gray-900">
                            {scheduleData.includeWeekends 
                              ? (language === 'he' ? 'כן' : 'Yes') 
                              : (language === 'he' ? 'לא' : 'No')
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {language === 'he' ? 'משמרות' : 'Shifts'}
                      </h4>
                      <div className="space-y-2">
                        {scheduleData.shifts.map((shift, index) => (
                          <div key={shift.id} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {language === 'he' ? `משמרת ${index + 1}:` : `Shift ${index + 1}:`}
                              </span>
                              <span className="font-medium text-gray-900">
                                {shift.startTime} - {shift.endTime} ({shift.requiredEmployees} {language === 'he' ? 'עובדים' : 'employees'})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Departments and Tags Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {language === 'he' ? 'מחלקות' : 'Departments'}
                        </h4>
                        {scheduleData.departments.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {scheduleData.departments.map(dept => (
                              <span key={dept} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {language === 'he' ? 
                                  (dept === 'Sales' ? 'מכירות' :
                                   dept === 'Operations' ? 'תפעול' :
                                   dept === 'Customer Service' ? 'שירות לקוחות' :
                                   dept === 'Security' ? 'אבטחה' :
                                   dept === 'Management' ? 'ניהול' : dept)
                                  : dept
                                }
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {language === 'he' ? 'כל המחלקות' : 'All departments'}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {language === 'he' ? 'תגים נדרשים' : 'Required Tags'}
                        </h4>
                        {scheduleData.requiredTags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {scheduleData.requiredTags.map(tagId => {
                              const tag = availableTags.find(t => t.id === tagId);
                              return tag ? (
                                <span key={tagId} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  {language === 'he' ? tag.he : tag.en}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {language === 'he' ? 'אין תגים נדרשים' : 'No required tags'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Break Configuration Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'he' ? 'הגדרת הפסקות' : 'Break Configuration'}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {scheduleData.breakMode === 'automatic' ? (
                        <div className="space-y-1">
                          <div>
                            {language === 'he' ? 'מצב:' : 'Mode:'} {language === 'he' ? 'אוטומטי' : 'Automatic'}
                          </div>
                          <div>
                            {language === 'he' ? 'חלון זמן:' : 'Time Window:'} {scheduleData.autoBreakWindow.start} - {scheduleData.autoBreakWindow.end}
                          </div>
                          <div>
                            {language === 'he' ? 'משך הפסקה:' : 'Break Duration:'} {scheduleData.breakDuration} {language === 'he' ? 'דקות' : 'minutes'}
                          </div>
                          <div>
                            {language === 'he' ? 'מקסימום בו-זמנית:' : 'Max Concurrent:'} {scheduleData.maxConcurrentBreaks}
                          </div>
                        </div>
                      ) : (
                        <div>{language === 'he' ? 'מצב: ידני' : 'Mode: Manual'}</div>
                      )}
                    </div>
                  </div>
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'he' ? 'הבא' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {language === 'he' ? 'שומר...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {language === 'he' ? 'שמור לוח זמנים' : 'Save Schedule'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}