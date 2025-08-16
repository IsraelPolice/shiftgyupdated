import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, ChevronLeft, ChevronRight, 
  CheckCircle, Circle, Users, Clock, Calendar,
  Tag, Settings, Info, AlertTriangle, Plus, Trash2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TemplateFormData {
  // Basic Info
  name: string;
  category: 'student' | 'partial' | 'full-time' | 'special';
  description: string;
  
  // Work Rules
  maxShiftsPerWeek: number;
  maxHoursPerShift: number;
  minHoursPerShift: number;
  weeklyHoursLimit: number;
  
  // Schedule Flexibility
  allowedDays: string[];
  forbiddenDays: string[];
  isFlexible: boolean;
  
  // Advanced Rules
  maxConsecutiveDays: number;
  minRestBetweenShifts: number;
  canWorkWeekends: boolean;
  canWorkNights: boolean;
  
  // Preferences
  preferredTimeSlots: string[];
  canWorkOvertime: boolean;
  emergencyAvailable: boolean;
  
  // System
  isActive: boolean;
  isDefault: boolean;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'night'];
const CATEGORIES = [
  { value: 'student', label: 'Student', icon: Users, color: 'blue' },
  { value: 'partial', label: 'Partial Position', icon: Clock, color: 'yellow' },
  { value: 'full-time', label: 'Full-time', icon: Calendar, color: 'green' },
  { value: 'special', label: 'Special Needs', icon: Tag, color: 'purple' }
];

export default function TemplateBuilder() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    category: 'student',
    description: '',
    maxShiftsPerWeek: 3,
    maxHoursPerShift: 8,
    minHoursPerShift: 4,
    weeklyHoursLimit: 24,
    allowedDays: [],
    forbiddenDays: [],
    isFlexible: true,
    maxConsecutiveDays: 2,
    minRestBetweenShifts: 12,
    canWorkWeekends: false,
    canWorkNights: false,
    preferredTimeSlots: ['morning', 'afternoon'],
    canWorkOvertime: false,
    emergencyAvailable: false,
    isActive: true,
    isDefault: false
  });

  // Load existing template if editing
  useEffect(() => {
    if (templateId) {
      // TODO: Load template data from API/storage
      console.log('Loading template:', templateId);
    }
  }, [templateId]);

  // Auto-calculate weekly hours limit based on shifts and hours
  useEffect(() => {
    const maxWeeklyHours = formData.maxShiftsPerWeek * formData.maxHoursPerShift;
    setFormData(prev => ({
      ...prev,
      weeklyHoursLimit: Math.min(maxWeeklyHours, prev.weeklyHoursLimit)
    }));
  }, [formData.maxShiftsPerWeek, formData.maxHoursPerShift]);

  const steps = [
    {
      id: 1,
      title: language === 'he' ? 'מידע בסיסי' : 'Basic Info',
      description: language === 'he' ? 'שם וקטגוריה' : 'Name and category'
    },
    {
      id: 2,
      title: language === 'he' ? 'חוקי עבודה' : 'Work Rules',
      description: language === 'he' ? 'משמרות ושעות' : 'Shifts and hours'
    },
    {
      id: 3,
      title: language === 'he' ? 'מגבלות מתקדמות' : 'Advanced Rules',
      description: language === 'he' ? 'ימים וזמינות' : 'Days and availability'
    },
    {
      id: 4,
      title: language === 'he' ? 'סקירה ושמירה' : 'Review & Save',
      description: language === 'he' ? 'אישור פרטים' : 'Confirm details'
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = 'Template name is required';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
        }
        break;
        
      case 2:
        if (formData.maxShiftsPerWeek < 1 || formData.maxShiftsPerWeek > 7) {
          newErrors.maxShiftsPerWeek = 'Must be between 1-7 shifts';
        }
        if (formData.maxHoursPerShift < formData.minHoursPerShift) {
          newErrors.maxHoursPerShift = 'Max hours must be greater than min hours';
        }
        break;
        
      case 3:
        if (formData.allowedDays.length === 0) {
          newErrors.allowedDays = 'At least one allowed day is required';
        }
        if (formData.maxConsecutiveDays < 1) {
          newErrors.maxConsecutiveDays = 'Must allow at least 1 consecutive day';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      const newTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        maxShiftsPerWeek: formData.maxShiftsPerWeek,
        maxHoursPerShift: formData.maxHoursPerShift,
        minHoursPerShift: formData.minHoursPerShift,
        weeklyHoursLimit: formData.weeklyHoursLimit,
        allowedDays: formData.allowedDays,
        forbiddenDays: formData.forbiddenDays,
        isFlexible: formData.isFlexible,
        maxConsecutiveDays: formData.maxConsecutiveDays,
        minRestBetweenShifts: formData.minRestBetweenShifts,
        canWorkWeekends: formData.canWorkWeekends,
        canWorkNights: formData.canWorkNights,
        preferredTimeSlots: formData.preferredTimeSlots,
        canWorkOvertime: formData.canWorkOvertime,
        emergencyAvailable: formData.emergencyAvailable,
        isActive: formData.isActive,
        isDefault: formData.isDefault,
        createdAt: new Date().toISOString(),
        assignedEmployees: 0
      };

      // Save to localStorage
      const existingTemplates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
      const updatedTemplates = [...existingTemplates, newTemplate];
      localStorage.setItem('jobTemplates', JSON.stringify(updatedTemplates));
      
      console.log('Template saved successfully:', newTemplate);
      navigate('/templates');
    }
  };

  const toggleDay = (day: string, type: 'allowed' | 'forbidden') => {
    const field = type === 'allowed' ? 'allowedDays' : 'forbiddenDays';
    const otherField = type === 'allowed' ? 'forbiddenDays' : 'allowedDays';
    
    setFormData(prev => {
      const currentList = prev[field];
      const otherList = prev[otherField];
      
      let newList: string[];
      let newOtherList = otherList;
      
      if (currentList.includes(day)) {
        newList = currentList.filter(d => d !== day);
      } else {
        newList = [...currentList, day];
        // Remove from other list if adding here
        newOtherList = otherList.filter(d => d !== day);
      }
      
      return {
        ...prev,
        [field]: newList,
        [otherField]: newOtherList
      };
    });
  };

  const toggleTimeSlot = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTimeSlots: prev.preferredTimeSlots.includes(slot)
        ? prev.preferredTimeSlots.filter(s => s !== slot)
        : [...prev.preferredTimeSlots, slot]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/templates')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'he' ? 'חזור' : 'Back'}
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {templateId ? 'Edit Template' : 'Create New Template'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>
            <button
              onClick={currentStep === steps.length ? handleSave : handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentStep === steps.length ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'he' ? 'שמור תבנית' : 'Save Template'}
                </>
              ) : (
                <>
                  {language === 'he' ? 'המשך' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-6 flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : currentStep === step.id ? (
                  <Circle className="w-6 h-6 text-blue-500 fill-current" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-blue-600' : 
                    currentStep > step.id ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'מידע בסיסי על התבנית' : 'Basic Template Information'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'שם התבנית' : 'Template Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={language === 'he' ? 'למשל: סטודנט גמיש' : 'e.g., Flexible Student'}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'קטגוריה' : 'Category'} *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(category => {
                        const Icon = category.icon;
                        return (
                          <label
                            key={category.value}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                              formData.category === category.value
                                ? `border-${category.color}-500 bg-${category.color}-50`
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="category"
                              value={category.value}
                              checked={formData.category === category.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                              className="sr-only"
                            />
                            <Icon className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'תיאור' : 'Description'} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={language === 'he' ? 'הסבר מתי ואיך להשתמש בתבנית זו...' : 'Explain when and how to use this template...'}
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Work Rules */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'חוקי עבודה בסיסיים' : 'Basic Work Rules'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'מקסימום משמרות בשבוע' : 'Max Shifts Per Week'} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={formData.maxShiftsPerWeek}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxShiftsPerWeek: parseInt(e.target.value) || 1 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.maxShiftsPerWeek ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.maxShiftsPerWeek && <p className="text-red-600 text-sm mt-1">{errors.maxShiftsPerWeek}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'מקסימום שעות במשמרת' : 'Max Hours Per Shift'} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      step="0.5"
                      value={formData.maxHoursPerShift}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxHoursPerShift: parseFloat(e.target.value) || 1 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.maxHoursPerShift ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.maxHoursPerShift && <p className="text-red-600 text-sm mt-1">{errors.maxHoursPerShift}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'מינימום שעות במשמרת' : 'Min Hours Per Shift'} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      step="0.5"
                      value={formData.minHoursPerShift}
                      onChange={(e) => setFormData(prev => ({ ...prev, minHoursPerShift: parseFloat(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'הגבלת שעות שבועית' : 'Weekly Hours Limit'} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.weeklyHoursLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, weeklyHoursLimit: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'he' ? 'מחושב אוטומטית: ' : 'Auto-calculated: '}
                      {formData.maxShiftsPerWeek} × {formData.maxHoursPerShift} = {formData.maxShiftsPerWeek * formData.maxHoursPerShift}h max
                    </p>
                  </div>
                </div>

                {/* Flexibility Setting */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'he' ? 'גמישות בתזמון' : 'Scheduling Flexibility'}
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFlexible}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFlexible: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {language === 'he' ? 'העובד יכול לבחור ימים מהרשימה המותרת' : 'Employee can choose days from allowed list'}
                      </span>
                      <div className="ml-2 group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                          {language === 'he' 
                            ? 'כאשר מופעל, העובד יכול לבחור מהימים המותרים. אחרת, המערכת תקצה אוטומטית.'
                            : 'When enabled, employee can choose from allowed days. Otherwise, system assigns automatically.'
                          }
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Rules */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'מגבלות מתקדמות' : 'Advanced Constraints'}
                </h2>

                {/* Days Configuration */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">
                    {language === 'he' ? 'ימי עבודה' : 'Work Days'}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'ימים מותרים' : 'Allowed Days'} *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DAYS_OF_WEEK.map(day => (
                        <label
                          key={day}
                          className={`flex items-center justify-center p-2 border rounded cursor-pointer transition-colors ${
                            formData.allowedDays.includes(day)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.allowedDays.includes(day)}
                            onChange={() => toggleDay(day, 'allowed')}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{day.substring(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                    {errors.allowedDays && <p className="text-red-600 text-sm mt-1">{errors.allowedDays}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'ימים אסורים' : 'Forbidden Days'}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DAYS_OF_WEEK.map(day => (
                        <label
                          key={day}
                          className={`flex items-center justify-center p-2 border rounded cursor-pointer transition-colors ${
                            formData.forbiddenDays.includes(day)
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.forbiddenDays.includes(day)}
                            onChange={() => toggleDay(day, 'forbidden')}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{day.substring(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Preferences */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'he' ? 'העדפות זמן' : 'Time Preferences'}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'he' ? 'משמרות מועדפות' : 'Preferred Time Slots'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <label
                          key={slot}
                          className={`flex items-center justify-center p-3 border rounded cursor-pointer transition-colors ${
                            formData.preferredTimeSlots.includes(slot)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferredTimeSlots.includes(slot)}
                            onChange={() => toggleTimeSlot(slot)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium capitalize">{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Constraints */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'he' ? 'אילוצים נוספים' : 'Additional Constraints'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'he' ? 'מקסימום ימים רצופים' : 'Max Consecutive Days'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={formData.maxConsecutiveDays}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxConsecutiveDays: parseInt(e.target.value) || 1 }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.maxConsecutiveDays ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.maxConsecutiveDays && <p className="text-red-600 text-sm mt-1">{errors.maxConsecutiveDays}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'he' ? 'מינימום שעות מנוחה בין משמרות' : 'Min Rest Between Shifts (hours)'}
                      </label>
                      <input
                        type="number"
                        min="8"
                        max="24"
                        value={formData.minRestBetweenShifts}
                        onChange={(e) => setFormData(prev => ({ ...prev, minRestBetweenShifts: parseInt(e.target.value) || 8 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.canWorkWeekends}
                          onChange={(e) => setFormData(prev => ({ ...prev, canWorkWeekends: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language === 'he' ? 'יכול לעבוד בסופי שבוע' : 'Can work weekends'}
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.canWorkNights}
                          onChange={(e) => setFormData(prev => ({ ...prev, canWorkNights: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language === 'he' ? 'יכול לעבוד משמרות לילה' : 'Can work night shifts'}
                        </span>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.canWorkOvertime}
                          onChange={(e) => setFormData(prev => ({ ...prev, canWorkOvertime: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language === 'he' ? 'יכול לעבוד שעות נוספות' : 'Can work overtime'}
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.emergencyAvailable}
                          onChange={(e) => setFormData(prev => ({ ...prev, emergencyAvailable: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language === 'he' ? 'זמין למקרי חירום' : 'Available for emergencies'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Save */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'סקירה ושמירה' : 'Review & Save'}
                </h2>

                {/* Template Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{formData.name}</h3>
                    <p className="text-gray-600">{formData.description}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      CATEGORIES.find(c => c.value === formData.category)?.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      CATEGORIES.find(c => c.value === formData.category)?.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      CATEGORIES.find(c => c.value === formData.category)?.color === 'green' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {CATEGORIES.find(c => c.value === formData.category)?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.maxShiftsPerWeek}</div>
                      <div className="text-xs text-gray-500">Max Shifts/Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.maxHoursPerShift}h</div>
                      <div className="text-xs text-gray-500">Max Hours/Shift</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.weeklyHoursLimit}h</div>
                      <div className="text-xs text-gray-500">Weekly Limit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.allowedDays.length}</div>
                      <div className="text-xs text-gray-500">Allowed Days</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Flexibility:</span>
                      <span className={`font-medium ${formData.isFlexible ? 'text-green-600' : 'text-orange-600'}`}>
                        {formData.isFlexible ? 'Flexible' : 'Fixed Schedule'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Weekends:</span>
                      <span className={`font-medium ${formData.canWorkWeekends ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.canWorkWeekends ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Night Shifts:</span>
                      <span className={`font-medium ${formData.canWorkNights ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.canWorkNights ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Emergency Available:</span>
                      <span className={`font-medium ${formData.emergencyAvailable ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.emergencyAvailable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Allowed Days: </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.allowedDays.join(', ') || 'None'}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Preferred Time Slots: </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.preferredTimeSlots.map(slot => slot.charAt(0).toUpperCase() + slot.slice(1)).join(', ') || 'None'}
                    </span>
                  </div>
                </div>

                {/* Final Settings */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {language === 'he' ? 'הגדרות מערכת' : 'System Settings'}
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {language === 'he' ? 'תבנית פעילה' : 'Active template'}
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {language === 'he' ? 'תבנית ברירת מחדל' : 'Default template'}
                      </span>
                      <div className="ml-2 group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                          {language === 'he' 
                            ? 'תבנית ברירת מחדל תוצע אוטומטית לעובדים חדשים'
                            : 'Default template will be automatically suggested for new employees'
                          }
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'he' ? 'הקודם' : 'Previous'}
            </button>

            <div className="flex items-center space-x-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full ${
                    currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={currentStep === steps.length ? handleSave : handleNext}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'he' ? 'שמור תבנית' : 'Save Template'}
                </>
              ) : (
                <>
                  {language === 'he' ? 'המשך' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}