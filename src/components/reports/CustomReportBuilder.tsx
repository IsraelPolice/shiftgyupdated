import React, { useState, useEffect } from 'react';
import { 
  X, Save, ChevronLeft, ChevronRight, Plus, Trash2,
  Calendar, Users, BarChart3, PieChart, LineChart, Table,
  Filter, Search, Eye, Download, CheckCircle, Circle,
  Clock, DollarSign, Building2, Tag, Info
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ReportField {
  id: string;
  name: string;
  nameHe: string;
  type: 'text' | 'number' | 'date' | 'currency';
  category: string;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string;
}

interface ChartConfig {
  type: 'table' | 'bar' | 'line' | 'pie';
  xAxis?: string;
  yAxis?: string;
}

interface CustomReportConfig {
  name: string;
  description: string;
  dataSource: string;
  selectedFields: string[];
  filters: ReportFilter[];
  chartConfig: ChartConfig;
  dateRange: { start: string; end: string };
}

const DATA_SOURCES = [
  {
    id: 'shifts',
    name: 'Shifts & Schedules',
    nameHe: 'משמרות ולוחות זמנים',
    icon: Calendar,
    fields: [
      { id: 'employee_name', name: 'Employee Name', nameHe: 'שם עובד', type: 'text', category: 'Employee' },
      { id: 'shift_date', name: 'Shift Date', nameHe: 'תאריך משמרת', type: 'date', category: 'Time' },
      { id: 'start_time', name: 'Start Time', nameHe: 'שעת התחלה', type: 'text', category: 'Time' },
      { id: 'end_time', name: 'End Time', nameHe: 'שעת סיום', type: 'text', category: 'Time' },
      { id: 'duration', name: 'Duration (hours)', nameHe: 'משך (שעות)', type: 'number', category: 'Time' },
      { id: 'department', name: 'Department', nameHe: 'מחלקה', type: 'text', category: 'Employee' },
      { id: 'location', name: 'Location', nameHe: 'מיקום', type: 'text', category: 'Employee' }
    ]
  },
  {
    id: 'attendance',
    name: 'Attendance & Time',
    nameHe: 'נוכחות וזמנים',
    icon: Users,
    fields: [
      { id: 'employee_name', name: 'Employee Name', nameHe: 'שם עובד', type: 'text', category: 'Employee' },
      { id: 'check_in', name: 'Check In', nameHe: 'שעת כניסה', type: 'date', category: 'Time' },
      { id: 'check_out', name: 'Check Out', nameHe: 'שעת יציאה', type: 'date', category: 'Time' },
      { id: 'total_hours', name: 'Total Hours', nameHe: 'סך שעות', type: 'number', category: 'Time' },
      { id: 'overtime', name: 'Overtime Hours', nameHe: 'שעות נוספות', type: 'number', category: 'Time' }
    ]
  },
  {
    id: 'financial',
    name: 'Labor Costs',
    nameHe: 'עלויות עבודה',
    icon: DollarSign,
    fields: [
      { id: 'employee_name', name: 'Employee Name', nameHe: 'שם עובד', type: 'text', category: 'Employee' },
      { id: 'hourly_rate', name: 'Hourly Rate', nameHe: 'שכר לשעה', type: 'currency', category: 'Financial' },
      { id: 'regular_pay', name: 'Regular Pay', nameHe: 'שכר רגיל', type: 'currency', category: 'Financial' },
      { id: 'overtime_pay', name: 'Overtime Pay', nameHe: 'שכר שעות נוספות', type: 'currency', category: 'Financial' },
      { id: 'total_cost', name: 'Total Cost', nameHe: 'עלות כוללת', type: 'currency', category: 'Financial' }
    ]
  }
];

const CHART_TYPES = [
  { id: 'table', name: 'Table', nameHe: 'טבלה', icon: Table },
  { id: 'bar', name: 'Bar Chart', nameHe: 'גרף עמודות', icon: BarChart3 },
  { id: 'line', name: 'Line Chart', nameHe: 'גרף קווי', icon: LineChart },
  { id: 'pie', name: 'Pie Chart', nameHe: 'גרף עוגה', icon: PieChart }
];

interface CustomReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: CustomReportConfig) => void;
}

export default function CustomReportBuilder({ isOpen, onClose, onSave }: CustomReportBuilderProps) {
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [reportConfig, setReportConfig] = useState<CustomReportConfig>({
    name: '',
    description: '',
    dataSource: 'shifts',
    selectedFields: [],
    filters: [],
    chartConfig: { type: 'table' },
    dateRange: { start: '', end: '' }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: language === 'he' ? 'מידע בסיסי' : 'Basic Info' },
    { id: 2, title: language === 'he' ? 'בחירת נתונים' : 'Select Data' },
    { id: 3, title: language === 'he' ? 'סינון ותצוגה' : 'Filters & Display' },
    { id: 4, title: language === 'he' ? 'תצוגה מקדימה' : 'Preview & Save' }
  ];

  const getCurrentDataSource = () => {
    return DATA_SOURCES.find(ds => ds.id === reportConfig.dataSource);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!reportConfig.name.trim()) {
          newErrors.name = language === 'he' ? 'שם דוח נדרש' : 'Report name required';
        }
        if (!reportConfig.dataSource) {
          newErrors.dataSource = language === 'he' ? 'מקור נתונים נדרש' : 'Data source required';
        }
        break;
      case 2:
        if (reportConfig.selectedFields.length === 0) {
          newErrors.fields = language === 'he' ? 'יש לבחור לפחות שדה אחד' : 'At least one field required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      onSave(reportConfig);
      onClose();
    }
  };

  const toggleField = (fieldId: string) => {
    setReportConfig(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(f => f !== fieldId)
        : [...prev.selectedFields, fieldId]
    }));
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: getCurrentDataSource()?.fields[0]?.id || '',
      operator: 'equals',
      value: ''
    };
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const removeFilter = (filterId: string) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map(f => 
        f.id === filterId ? { ...f, ...updates } : f
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'he' ? 'בונה דוחות מותאמים' : 'Custom Report Builder'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'he' ? `שלב ${currentStep} מתוך ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-250px)] overflow-y-auto">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'שם הדוח' : 'Report Name'} *
                </label>
                <input
                  type="text"
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={language === 'he' ? 'למשל: דוח נוכחות חודשי' : 'e.g., Monthly Attendance Report'}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'תיאור' : 'Description'}
                </label>
                <textarea
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'he' ? 'תאר את מטרת הדוח...' : 'Describe the purpose of this report...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {language === 'he' ? 'מקור נתונים' : 'Data Source'} *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DATA_SOURCES.map(source => {
                    const IconComponent = source.icon;
                    return (
                      <label
                        key={source.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          reportConfig.dataSource === source.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="dataSource"
                          value={source.id}
                          checked={reportConfig.dataSource === source.id}
                          onChange={(e) => setReportConfig(prev => ({ 
                            ...prev, 
                            dataSource: e.target.value,
                            selectedFields: []
                          }))}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {language === 'he' ? source.nameHe : source.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {source.fields.length} {language === 'he' ? 'שדות' : 'fields'}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.dataSource && <p className="text-red-600 text-sm mt-1">{errors.dataSource}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'תאריך התחלה' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={reportConfig.dateRange.start}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'תאריך סיום' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={reportConfig.dateRange.end}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Data */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'בחר שדות לדוח' : 'Select Report Fields'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'he' 
                    ? 'בחר את השדות שברצונך לכלול בדוח שלך'
                    : 'Choose the fields you want to include in your report'
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    {language === 'he' ? 'שדות זמינים' : 'Available Fields'}
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {getCurrentDataSource()?.fields.map(field => (
                      <label
                        key={field.id}
                        className={`flex items-center p-3 rounded border cursor-pointer transition-colors ${
                          reportConfig.selectedFields.includes(field.id)
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={reportConfig.selectedFields.includes(field.id)}
                          onChange={() => toggleField(field.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {language === 'he' ? field.nameHe : field.name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {field.type} • {field.category}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    {language === 'he' ? 'שדות נבחרים' : 'Selected Fields'} ({reportConfig.selectedFields.length})
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {reportConfig.selectedFields.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        {language === 'he' ? 'לא נבחרו שדות' : 'No fields selected'}
                      </p>
                    ) : (
                      reportConfig.selectedFields.map(fieldId => {
                        const field = getCurrentDataSource()?.fields.find(f => f.id === fieldId);
                        return field ? (
                          <div
                            key={fieldId}
                            className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded"
                          >
                            <div>
                              <p className="font-medium text-blue-900">
                                {language === 'he' ? field.nameHe : field.name}
                              </p>
                              <p className="text-sm text-blue-600 capitalize">
                                {field.type} • {field.category}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleField(fieldId)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </div>

              {errors.fields && (
                <p className="text-red-600 text-sm">{errors.fields}</p>
              )}
            </div>
          )}

          {/* Step 3: Filters & Display */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* Chart Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'סוג תצוגה' : 'Display Type'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CHART_TYPES.map(chart => {
                    const IconComponent = chart.icon;
                    return (
                      <label
                        key={chart.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          reportConfig.chartConfig.type === chart.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="chartType"
                          value={chart.id}
                          checked={reportConfig.chartConfig.type === chart.id}
                          onChange={(e) => setReportConfig(prev => ({
                            ...prev,
                            chartConfig: { ...prev.chartConfig, type: e.target.value as ChartConfig['type'] }
                          }))}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">
                            {language === 'he' ? chart.nameHe : chart.name}
                          </h4>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Chart Configuration */}
              {reportConfig.chartConfig.type !== 'table' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'he' ? 'הגדרות גרף' : 'Chart Configuration'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'he' ? 'ציר X (קטגוריות)' : 'X-Axis (Categories)'}
                      </label>
                      <select
                        value={reportConfig.chartConfig.xAxis || ''}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          chartConfig: { ...prev.chartConfig, xAxis: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{language === 'he' ? 'בחר שדה...' : 'Select field...'}</option>
                        {getCurrentDataSource()?.fields
                          .filter(f => reportConfig.selectedFields.includes(f.id))
                          .map(field => (
                            <option key={field.id} value={field.id}>
                              {language === 'he' ? field.nameHe : field.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'he' ? 'ציר Y (ערכים)' : 'Y-Axis (Values)'}
                      </label>
                      <select
                        value={reportConfig.chartConfig.yAxis || ''}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          chartConfig: { ...prev.chartConfig, yAxis: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{language === 'he' ? 'בחר שדה...' : 'Select field...'}</option>
                        {getCurrentDataSource()?.fields
                          .filter(f => reportConfig.selectedFields.includes(f.id) && (f.type === 'number' || f.type === 'currency'))
                          .map(field => (
                            <option key={field.id} value={field.id}>
                              {language === 'he' ? field.nameHe : field.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'he' ? 'מסננים' : 'Filters'}
                  </h3>
                  <button
                    onClick={addFilter}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {language === 'he' ? 'הוסף מסנן' : 'Add Filter'}
                  </button>
                </div>

                <div className="space-y-3">
                  {reportConfig.filters.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 border border-gray-200 rounded-lg">
                      {language === 'he' ? 'לא הוגדרו מסננים' : 'No filters configured'}
                    </p>
                  ) : (
                    reportConfig.filters.map(filter => (
                      <div key={filter.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'שדה' : 'Field'}
                            </label>
                            <select
                              value={filter.field}
                              onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              {getCurrentDataSource()?.fields.map(field => (
                                <option key={field.id} value={field.id}>
                                  {language === 'he' ? field.nameHe : field.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'אופרטור' : 'Operator'}
                            </label>
                            <select
                              value={filter.operator}
                              onChange={(e) => updateFilter(filter.id, { operator: e.target.value as ReportFilter['operator'] })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="equals">{language === 'he' ? 'שווה ל' : 'Equals'}</option>
                              <option value="contains">{language === 'he' ? 'מכיל' : 'Contains'}</option>
                              <option value="greater">{language === 'he' ? 'גדול מ' : 'Greater than'}</option>
                              <option value="less">{language === 'he' ? 'קטן מ' : 'Less than'}</option>
                              <option value="between">{language === 'he' ? 'בין' : 'Between'}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === 'he' ? 'ערך' : 'Value'}
                            </label>
                            <input
                              type="text"
                              value={filter.value}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                              placeholder={language === 'he' ? 'הכנס ערך...' : 'Enter value...'}
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={() => removeFilter(filter.id)}
                              className="w-full px-3 py-2 text-red-600 border border-red-300 rounded text-sm hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview & Save */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'he' ? 'תצוגה מקדימה ושמירה' : 'Preview & Save'}
                </h3>

                {/* Report Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{reportConfig.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{language === 'he' ? 'מקור נתונים:' : 'Data Source:'}</span>
                      <p className="font-medium">{getCurrentDataSource()?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{language === 'he' ? 'שדות:' : 'Fields:'}</span>
                      <p className="font-medium">{reportConfig.selectedFields.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{language === 'he' ? 'מסננים:' : 'Filters:'}</span>
                      <p className="font-medium">{reportConfig.filters.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{language === 'he' ? 'תצוגה:' : 'Display:'}</span>
                      <p className="font-medium capitalize">{reportConfig.chartConfig.type}</p>
                    </div>
                  </div>
                  {reportConfig.description && (
                    <p className="text-gray-600 mt-4">{reportConfig.description}</p>
                  )}
                </div>

                {/* Sample Data Preview */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h5 className="font-medium text-gray-900">
                      {language === 'he' ? 'דוגמת נתונים' : 'Sample Data Preview'}
                    </h5>
                  </div>
                  <div className="p-4">
                    {reportConfig.selectedFields.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              {reportConfig.selectedFields.map(fieldId => {
                                const field = getCurrentDataSource()?.fields.find(f => f.id === fieldId);
                                return field ? (
                                  <th key={fieldId} className="text-left py-2 px-3 font-medium text-gray-900">
                                    {language === 'he' ? field.nameHe : field.name}
                                  </th>
                                ) : null;
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3].map(row => (
                              <tr key={row} className="border-b border-gray-100">
                                {reportConfig.selectedFields.map(fieldId => {
                                  const field = getCurrentDataSource()?.fields.find(f => f.id === fieldId);
                                  let sampleValue = '';
                                  
                                  if (field) {
                                    switch (field.type) {
                                      case 'text':
                                        sampleValue = field.id.includes('name') ? `Employee ${row}` : 
                                                    field.id.includes('department') ? ['Sales', 'Operations', 'HR'][row-1] :
                                                    `Sample ${field.name} ${row}`;
                                        break;
                                      case 'number':
                                        sampleValue = (Math.random() * 100).toFixed(1);
                                        break;
                                      case 'currency':
                                        sampleValue = `$${(Math.random() * 1000).toFixed(2)}`;
                                        break;
                                      case 'date':
                                        sampleValue = new Date().toLocaleDateString();
                                        break;
                                      default:
                                        sampleValue = `Sample ${row}`;
                                    }
                                  }
                                  
                                  return (
                                    <td key={fieldId} className="py-2 px-3 text-gray-700">
                                      {sampleValue}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          {language === 'he' ? 'בחר שדות כדי לראות תצוגה מקדימה' : 'Select fields to see preview'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              currentStep === 1
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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

          <div className="flex gap-3">
            {currentStep === steps.length ? (
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {language === 'he' ? 'שמור דוח' : 'Save Report'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'he' ? 'המשך' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}