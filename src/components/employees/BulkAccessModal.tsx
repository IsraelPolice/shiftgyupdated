import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Users, 
  Building2, 
  Search, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface BulkAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    status: string;
  }>;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function BulkAccessModal({ isOpen, onClose, employees }: BulkAccessModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectionMode, setSelectionMode] = useState<'all' | 'employees' | 'department'>('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('default');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [scheduleOption, setScheduleOption] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<any>(null);
  
  const { language } = useLanguage();
  const { user } = useAuth();

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department))];
  
  // Email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: 'default',
      name: language === 'he' ? 'תבנית ברירת מחדל' : 'Default Template',
      subject: language === 'he' 
        ? 'פרטי גישה למערכת ShiftGY'
        : 'ShiftGY Access Details',
      body: language === 'he'
        ? `שלום {{employee_name}},

נוצר עבורך חשבון במערכת ShiftGY לניהול משמרות.

פרטי הגישה שלך:
שם משתמש: {{username}}
סיסמה זמנית: {{password}}

קישור להתחברות: {{login_url}}

אנא התחבר ושנה את הסיסמה בהתחברות הראשונה.

בברכה,
צוות {{company_name}}`
        : `Hello {{employee_name}},

Your ShiftGY account has been created for shift management.

Your access details:
Username: {{username}}
Temporary Password: {{password}}

Login URL: {{login_url}}

Please log in and change your password on first login.

Best regards,
{{company_name}} Team`
    },
    {
      id: 'welcome',
      name: language === 'he' ? 'תבנית ברוכים הבאים' : 'Welcome Template',
      subject: language === 'he' 
        ? 'ברוכים הבאים ל-ShiftGY!'
        : 'Welcome to ShiftGY!',
      body: language === 'he'
        ? `שלום {{employee_name}},

ברוכים הבאים לצוות {{company_name}}!

הוקם עבורך חשבון במערכת ShiftGY החדשה שלנו לניהול משמרות.

פרטי הגישה שלך:
• שם משתמש: {{username}}
• סיסמה זמנית: {{password}}
• קישור: {{login_url}}

המערכת תאפשר לך:
✓ לצפות בלוח הזמנים שלך
✓ לבקש שינויי משמרות
✓ לעקוב אחר שעות העבודה

נשמח לעזור בכל שאלה!

בהצלחה,
צוות {{company_name}}`
        : `Hello {{employee_name}},

Welcome to the {{company_name}} team!

Your ShiftGY account has been set up for our new shift management system.

Your access details:
• Username: {{username}}
• Temporary Password: {{password}}
• Login URL: {{login_url}}

The system will allow you to:
✓ View your schedule
✓ Request shift changes
✓ Track your work hours

Feel free to reach out with any questions!

Best regards,
{{company_name}} Team`
    }
  ];

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get final recipient list
  const getFinalRecipients = () => {
    switch (selectionMode) {
      case 'all':
        return employees.filter(emp => emp.status === 'active');
      case 'employees':
        return employees.filter(emp => selectedEmployees.includes(emp.id));
      case 'department':
        return employees.filter(emp => selectedDepartments.includes(emp.department));
      default:
        return [];
    }
  };

  const recipients = getFinalRecipients();

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setEmailTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  // Handle employee selection
  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAllEmployees = () => {
    const allIds = filteredEmployees.map(emp => emp.id);
    setSelectedEmployees(allIds);
  };

  const deselectAllEmployees = () => {
    setSelectedEmployees([]);
  };

  // Handle department selection
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  // Handle sending
  const handleSend = async () => {
    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results
      const results = {
        total: recipients.length,
        successful: recipients.length - 1,
        failed: 1,
        failedEmails: ['failed@example.com'],
        sentAt: new Date().toISOString()
      };
      
      setSendResults(results);
      setCurrentStep(5); // Results step
    } catch (error) {
      console.error('Failed to send bulk access details:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Reset modal state
  const resetModal = () => {
    setCurrentStep(1);
    setSelectionMode('all');
    setSelectedEmployees([]);
    setSelectedDepartments([]);
    setSearchTerm('');
    setEmailTemplate('default');
    setScheduleOption('immediate');
    setScheduledDate('');
    setScheduledTime('');
    setSendResults(null);
    setIsSending(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' ? 'שלח פרטי גישה בכמות' : 'Bulk Send Access Details'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'he' ? `שלב ${currentStep} מתוך 4` : `Step ${currentStep} of 4`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Selection Mode */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {language === 'he' ? 'בחר את העובדים לשליחה:' : 'Select employees to send to:'}
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="selectionMode"
                      value="all"
                      checked={selectionMode === 'all'}
                      onChange={() => setSelectionMode('all')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {language === 'he' ? 'כל העובדים' : 'All Employees'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'he' 
                          ? `שלח ל-${employees.filter(emp => emp.status === 'active').length} עובדים פעילים`
                          : `Send to ${employees.filter(emp => emp.status === 'active').length} active employees`}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="selectionMode"
                      value="employees"
                      checked={selectionMode === 'employees'}
                      onChange={() => setSelectionMode('employees')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {language === 'he' ? 'בחר עובדים ספציפיים' : 'Select Specific Employees'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'he' 
                          ? 'בחר עובדים מהרשימה'
                          : 'Choose employees from the list'}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="selectionMode"
                      value="department"
                      checked={selectionMode === 'department'}
                      onChange={() => setSelectionMode('department')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {language === 'he' ? 'בחר לפי מחלקה' : 'Select by Department'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'he' 
                          ? 'בחר מחלקות שלמות'
                          : 'Choose entire departments'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specific Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {selectionMode === 'employees' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {language === 'he' ? 'בחר עובדים:' : 'Select Employees:'}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {language === 'he' 
                        ? `${selectedEmployees.length} עובדים נבחרו`
                        : `${selectedEmployees.length} employees selected`}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={language === 'he' ? 'חפש עובדים...' : 'Search employees...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Select All/None */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={selectAllEmployees}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {language === 'he' ? 'בחר הכל' : 'Select All'}
                    </button>
                    <button
                      onClick={deselectAllEmployees}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {language === 'he' ? 'בטל בחירה' : 'Deselect All'}
                    </button>
                  </div>

                  {/* Employee List */}
                  <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                    {filteredEmployees.map(employee => (
                      <label
                        key={employee.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleEmployee(employee.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                              <div className="text-xs text-gray-400">{employee.department} • {employee.role}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectionMode === 'department' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {language === 'he' ? 'בחר מחלקות:' : 'Select Departments:'}
                  </h3>
                  
                  <div className="space-y-2">
                    {departments.map(department => {
                      const deptEmployees = employees.filter(emp => emp.department === department);
                      return (
                        <label
                          key={department}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedDepartments.includes(department)}
                              onChange={() => toggleDepartment(department)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{department}</div>
                              <div className="text-sm text-gray-500">
                                {language === 'he' 
                                  ? `${deptEmployees.length} עובדים`
                                  : `${deptEmployees.length} employees`}
                              </div>
                            </div>
                          </div>
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Email Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                {language === 'he' ? 'הגדר את האימייל:' : 'Configure Email:'}
              </h3>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'תבנית אימייל:' : 'Email Template:'}
                </label>
                <select
                  value={emailTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'נושא האימייל:' : 'Email Subject:'}
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'he' ? 'תוכן האימייל:' : 'Email Body:'}
                  </label>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview 
                      ? (language === 'he' ? 'עריכה' : 'Edit')
                      : (language === 'he' ? 'תצוגה מקדימה' : 'Preview')
                    }
                  </button>
                </div>
                
                {showPreview ? (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px] whitespace-pre-wrap">
                    {emailBody}
                  </div>
                ) : (
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Merge Fields Helper */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  {language === 'he' ? 'שדות זמינים:' : 'Available Fields:'}
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>{{employee_name}} - {language === 'he' ? 'שם העובד' : 'Employee name'}</div>
                  <div>{{username}} - {language === 'he' ? 'שם משתמש' : 'Username'}</div>
                  <div>{{password}} - {language === 'he' ? 'סיסמה זמנית' : 'Temporary password'}</div>
                  <div>{{company_name}} - {language === 'he' ? 'שם החברה' : 'Company name'}</div>
                  <div>{{login_url}} - {language === 'he' ? 'קישור התחברות' : 'Login URL'}</div>
                </div>
              </div>

              {/* Schedule Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {language === 'he' ? 'מתי לשלוח:' : 'When to Send:'}
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scheduleOption"
                      value="immediate"
                      checked={scheduleOption === 'immediate'}
                      onChange={() => setScheduleOption('immediate')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">
                      {language === 'he' ? 'שלח מיד' : 'Send Immediately'}
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scheduleOption"
                      value="scheduled"
                      checked={scheduleOption === 'scheduled'}
                      onChange={() => setScheduleOption('scheduled')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">
                      {language === 'he' ? 'תזמן לשליחה' : 'Schedule for Later'}
                    </span>
                  </label>
                </div>

                {scheduleOption === 'scheduled' && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {language === 'he' ? 'תאריך:' : 'Date:'}
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {language === 'he' ? 'שעה:' : 'Time:'}
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                {language === 'he' ? 'אישור שליחה:' : 'Confirm Sending:'}
              </h3>

              {/* Recipients Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {language === 'he' ? 'סיכום נמענים:' : 'Recipients Summary:'}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'he' ? 'סך הכל נמענים:' : 'Total Recipients:'}
                    </span>
                    <span className="font-medium">{recipients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'he' ? 'אופן בחירה:' : 'Selection Method:'}
                    </span>
                    <span className="font-medium">
                      {selectionMode === 'all' 
                        ? (language === 'he' ? 'כל העובדים' : 'All Employees')
                        : selectionMode === 'employees'
                        ? (language === 'he' ? 'עובדים נבחרים' : 'Selected Employees')
                        : (language === 'he' ? 'לפי מחלקה' : 'By Department')
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'he' ? 'זמן שליחה:' : 'Send Time:'}
                    </span>
                    <span className="font-medium">
                      {scheduleOption === 'immediate'
                        ? (language === 'he' ? 'מיד' : 'Immediately')
                        : `${scheduledDate} ${scheduledTime}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Preview */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {language === 'he' ? 'תצוגה מקדימה של האימייל:' : 'Email Preview:'}
                </h4>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>{language === 'he' ? 'נושא:' : 'Subject:'}</strong> {emailSubject}
                  </div>
                  <div className="text-sm whitespace-pre-wrap text-gray-800">
                    {emailBody.substring(0, 200)}...
                  </div>
                </div>
              </div>

              {isSending && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {language === 'he' ? 'שולח פרטי גישה...' : 'Sending access details...'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {language === 'he' 
                      ? 'זה עשוי לקחת מספר דקות'
                      : 'This may take a few minutes'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Results */}
          {currentStep === 5 && sendResults && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'he' ? 'השליחה הושלמה!' : 'Sending Complete!'}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{sendResults.total}</div>
                    <div className="text-sm text-gray-600">
                      {language === 'he' ? 'סך הכל' : 'Total'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{sendResults.successful}</div>
                    <div className="text-sm text-gray-600">
                      {language === 'he' ? 'נשלח בהצלחה' : 'Successful'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{sendResults.failed}</div>
                    <div className="text-sm text-gray-600">
                      {language === 'he' ? 'נכשל' : 'Failed'}
                    </div>
                  </div>
                </div>
              </div>

              {sendResults.failed > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">
                    {language === 'he' ? 'שליחות שנכשלו:' : 'Failed Sends:'}
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {sendResults.failedEmails.map((email: string, index: number) => (
                      <li key={index}>• {email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          {currentStep > 1 && currentStep < 5 && !isSending && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'he' ? 'חזור' : 'Back'}
            </button>
          )}

          {currentStep === 1 && (
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>
          )}

          <div className="flex gap-3">
            {currentStep === 5 ? (
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'he' ? 'סגור' : 'Close'}
              </button>
            ) : currentStep === 4 ? (
              <button
                onClick={handleSend}
                disabled={isSending || recipients.length === 0}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {language === 'he' ? 'שולח...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'he' ? 'שלח פרטי גישה' : 'Send Access Details'}
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentStep === 1 && selectionMode !== 'all') {
                    setCurrentStep(2);
                  } else {
                    setCurrentStep(3);
                  }
                }}
                disabled={
                  (currentStep === 2 && selectionMode === 'employees' && selectedEmployees.length === 0) ||
                  (currentStep === 2 && selectionMode === 'department' && selectedDepartments.length === 0)
                }
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'he' ? 'המשך' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}