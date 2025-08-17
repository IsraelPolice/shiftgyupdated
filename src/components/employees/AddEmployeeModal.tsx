import React, { useState, useRef, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Building2, DollarSign, Calendar, Clock, Tag, Plus, X as XIcon, HelpCircle, Check, ChevronDown, Info } from 'lucide-react';
import { usePresence } from '../../contexts/PresenceContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import InviteEmployeeModal from './InviteEmployeeModal'; 
import { UserRole } from '../../contexts/AuthContext';
import SendAccessModal from './SendAccessModal';

// Mock job templates for assignment
const mockJobTemplates = [
  { id: '1', name: 'Student Flexible', category: 'student' },
  { id: '2', name: 'Student Fixed Schedule', category: 'student' },
  { id: '3', name: '60% Position', category: 'partial' },
  { id: '4', name: 'Full-time Regular', category: 'full-time' },
  { id: '5', name: 'Night Shift Specialist', category: 'special' }
];

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: any) => void;
  employee?: any;
  isEditing?: boolean;
  preSelectedDepartment?: string;
}

export default function AddEmployeeModal({ isOpen, onClose, onSave, employee, isEditing = false, preSelectedDepartment }: AddEmployeeModalProps) {
  const { updateEmployeeConfig } = usePresence();
  const [showSendAccessModal, setShowSendAccessModal] = useState(false);
  const [savedEmployeeData, setSavedEmployeeData] = useState<any>(null);
  const { t, language } = useLanguage();
  const { currentCompany } = useAuth();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    role: employee?.role || '',
    department: employee?.department || preSelectedDepartment || '',
    tags: employee?.tags || [],
    hireDate: employee?.hireDate || '',
    salaryType: employee?.salaryType || 'hourly',
    salaryRate: employee?.salaryRate || '',
    status: employee?.status || 'active',
    requireClockInOut: employee?.requireClockInOut || false,
    notes: employee?.notes || [],
    assignedTemplate: employee?.assignedTemplate || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [savedEmployee, setSavedEmployee] = useState<any>(null);
  const [newTag, setNewTag] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [showTagTooltip, setShowTagTooltip] = useState(false);
  const [showDepartmentTooltip, setShowDepartmentTooltip] = useState(false);
  
  // Load employee data when editing
  useEffect(() => {
    if (isEditing && employee) {
      setIsLoading(true);
      // Simulate a brief loading delay for UX
      const timer = setTimeout(() => {
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          phone: employee.phone || '',
          role: employee.role || '',
          department: employee.department || '',
          tags: employee.tags || [],
          hireDate: employee.hireDate || '',
          salaryType: employee.salaryType || 'hourly',
          salaryRate: employee.salaryRate?.toString() || '',
          status: employee.status || 'active',
          requireClockInOut: employee.requireClockInOut || false,
          notes: employee.notes || [],
          assignedTemplate: employee.assignedTemplate || ''
        });
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isEditing, employee]);
  const handleSendAccess = () => {
    if (isEditing && employee) {
      setSavedEmployeeData(employee);
      setShowSendAccessModal(true);
    }
  };
  
  const handleSendAccessClose = () => {
    setShowSendAccessModal(false);
  };
  
  // Get all existing tags from all employees for the dropdown
  const allExistingTags = [
    "Team 1", "Team 2", "Team 3", "Cashier", "Team Lead", "Trainer", 
    "Inventory", "Manager", "Cook", "Server", "Host", "Bartender", 
    "Dishwasher", "Delivery", "Maintenance"
  ];
  
  // Filter tags that aren't already assigned to this employee
  const availableTags = allExistingTags.filter(tag => 
    !formData.tags || !formData.tags.includes(tag)
  );
  
  // Filter available tags based on search input
  const filteredTags = newTag.trim() 
    ? availableTags.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase())
      )
    : availableTags;

  // Mock departments data - in a real app, this would come from the API or context
  const departments = currentCompany?.departments || [
    { id: '1', name: 'Sales' },
    { id: '2', name: 'Operations' },
    { id: '3', name: 'Customer Service' },
    { id: '4', name: 'Security' },
    { id: '5', name: 'Management' }
  ];
  
  // Check if there are any departments
  const hasDepartments = departments.length > 0;
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = t('errors.required_field');
    if (!formData.email.trim()) newErrors.email = t('errors.required_field');
    if (!formData.role.trim()) newErrors.role = t('errors.required_field');
    if (!formData.department.trim()) newErrors.department = t('errors.required_field');
    if (!formData.phone.trim()) {
      newErrors.phone = t('errors.required_field');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const employeeData = {
        ...formData,
        salaryRate: parseFloat(formData.salaryRate),
        id: employee?.id || Date.now().toString()
      };
      
      // Update presence configuration
      updateEmployeeConfig({
        employeeId: employeeData.id.toString(),
        requireClockInOut: formData.requireClockInOut,
        enabled: formData.requireClockInOut
      });
      
      onSave(employeeData);
      
      // If this is a new employee, show the invite modal
      if (!isEditing) {
        setSavedEmployee(employeeData);
        setShowInviteModal(true);
      } else {
        onClose();
      }
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && (!formData.tags || !formData.tags.includes(newTag.trim()))) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
      setIsTagDropdownOpen(false);
    }
  };

  const handleSelectTag = (tag: string) => {
    if (!formData.tags || !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
    setNewTag('');
    setIsTagDropdownOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleInviteModalClose = () => {
    setShowInviteModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? `${t('employees.edit_employee')} – ${employee?.name}` : t('employees.add_employee')}
            </h2>
          <div className="flex items-center gap-3">
            {isEditing && (
              <button
                onClick={handleSendAccess}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                {language === 'he' ? 'שלח פרטי גישה' : 'Send Access Details'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('employees.personal_information')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('employees.name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('employees.email')} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@company.com"
                      disabled={isEditing} // Disable email editing for existing employees
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    {isEditing && <p className="text-xs text-gray-500 mt-1">{t('employees.email_cannot_be_changed')}</p>}
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('employees.phone')} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={settings.country === 'US' ? "(555) 123-4567" : 
                                 settings.country === 'UK' ? "7911 123456" : 
                                 settings.country === 'IL' ? "050-1234567" : 
                                 settings.country === 'CA' ? "(555) 123-4567" : 
                                 settings.country === 'AU' ? "04XX XXX XXX" : 
                                 "Phone number without country code"}
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('employees.hire_date')}
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleChange('hireDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('employees.work_information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('employees.permission')} *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.role ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('common.select')} {t('employees.permission')}</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                  {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('employees.department')} *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">{t('common.select')} {t('employees.department')}</option>
                      {hasDepartments ? (
                        departments.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))
                      ) : (
                        <option value={currentCompany?.name || "Demo Company"}>{currentCompany?.name || "Demo Company"}</option>
                      )}
                    </select>
                    
                    {!hasDepartments && (
                      <div 
                        className="absolute right-10 top-3 cursor-help"
                        onMouseEnter={() => setShowDepartmentTooltip(true)}
                        onMouseLeave={() => setShowDepartmentTooltip(false)}
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                        {showDepartmentTooltip && (
                          <div className="absolute z-10 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -right-72 top-0">
                            <p>{t('tooltip.noDepartmentsSet', 'No departments have been set up yet. You can add departments under Company Settings → Departments.')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
                </div>
              </div>
              
              {/* Job Template Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Template
                  <div className="inline-block ml-1 group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                      Job templates define work rules and constraints that automatically apply when scheduling this employee.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </label>
                <select
                  value={formData.assignedTemplate}
                  onChange={(e) => handleChange('assignedTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No template assigned</option>
                  {mockJobTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </option>
                  ))}
                </select>
                {formData.assignedTemplate && (
                  <p className="text-xs text-blue-600 mt-1">
                    This employee will follow the rules defined in the selected job template.
                  </p>
                )}
              </div>
            </div>

            {/* Employee Tags */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Employee Tags
                </h3>
                <div className="relative">
                  <HelpCircle 
                    className="w-4 h-4 text-gray-400 cursor-help" 
                    onMouseEnter={() => setShowTagTooltip(true)}
                    onMouseLeave={() => setShowTagTooltip(false)}
                  />
                  {showTagTooltip && (
                    <div className="absolute z-10 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -left-72 top-0">
                      <p>Choose one or more role tags. You can select from existing tags or create new ones.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent min-h-[42px]">
                        {formData.tags && formData.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => {
                            setNewTag(e.target.value);
                            if (!isTagDropdownOpen && e.target.value) {
                              setIsTagDropdownOpen(true);
                            }
                          }}
                          onFocus={() => {
                            setTagInputFocused(true);
                            setIsTagDropdownOpen(true);
                          }}
                          onBlur={() => {
                            setTagInputFocused(false);
                            // Delay closing dropdown to allow for click events
                            setTimeout(() => {
                              if (!tagInputFocused) {
                                setIsTagDropdownOpen(false);
                              }
                            }, 200);
                          }}
                          placeholder={formData.tags && formData.tags.length > 0 ? "" : "Type to search or add tags..."}
                          className="outline-none border-none bg-transparent flex-1 min-w-[120px] text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            } else if (e.key === 'Escape') {
                              setIsTagDropdownOpen(false);
                            }
                          }}
                        />
                      </div>
                      <div className="absolute right-3 top-3 text-gray-400">
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`}
                          onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isTagDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredTags.length > 0 ? (
                        <div>
                          {filteredTags.map((tag, index) => (
                            <div 
                              key={index}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                              onClick={() => handleSelectTag(tag)}
                            >
                              <span>{tag}</span>
                              <Check className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {newTag.trim() && (
                            <div 
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center text-blue-600"
                              onClick={handleAddTag}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              <span>Create new tag: "{newTag.trim()}"</span>
                            </div>
                          )}
                          {!newTag.trim() && (
                            <div className="px-4 py-2 text-gray-500">
                              No matching tags found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Display selected tags */}
                <div className="flex flex-wrap gap-2">
                  {(!formData.tags || formData.tags.length === 0) && (
                    <p className="text-gray-500 text-sm">No tags assigned. Tags help match employees to shifts based on skills or team assignments.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Presence Tracking */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('employees.presence_tracking')}
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-900">{t('employees.require_clock_in_out')}</label>
                  <p className="text-sm text-gray-500">{t('employees.enable_presence_tracking')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    checked={formData.requireClockInOut}
                    onChange={(e) => handleChange('requireClockInOut', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Salary Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {t('employees.salary_information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('employees.salary_type')}
                  </label>
                  <select
                    value={formData.salaryType}
                    onChange={(e) => handleChange('salaryType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hourly">{t('employees.hourly')}</option>
                    <option value="weekly">{t('employees.weekly')}</option>
                    <option value="monthly">{t('employees.monthly')}</option>
                    <option value="yearly">{t('employees.yearly')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('employees.salary_rate')}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salaryRate}
                      onChange={(e) => handleChange('salaryRate', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.salaryRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.salaryRate && <p className="text-red-600 text-sm mt-1">{errors.salaryRate}</p>}
                </div>
              </div>

              {formData.salaryRate && parseFloat(formData.salaryRate) > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Salary Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">{t('employees.hourly')}:</span>
                      <span className="ml-2 font-medium">
                        ${getSalaryBreakdown(formData.salaryType, parseFloat(formData.salaryRate)).hourly}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">{t('employees.weekly')}:</span>
                      <span className="ml-2 font-medium">
                        ${getSalaryBreakdown(formData.salaryType, parseFloat(formData.salaryRate)).weekly}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">{t('employees.monthly')}:</span>
                      <span className="ml-2 font-medium">
                        ${getSalaryBreakdown(formData.salaryType, parseFloat(formData.salaryRate)).monthly}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">{t('employees.yearly')}:</span>
                      <span className="ml-2 font-medium">
                        ${getSalaryBreakdown(formData.salaryType, parseFloat(formData.salaryRate)).yearly}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <div className="space-y-3">
                {formData.notes.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleChange('notes', [...formData.notes, ''])}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </button>
                ) : (
                  <>
                    {formData.notes.map((note, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => {
                            const newNotes = [...formData.notes];
                            newNotes[index] = e.target.value;
                            handleChange('notes', newNotes);
                          }}
                          placeholder={`Note ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newNotes = [...formData.notes];
                            newNotes.splice(index, 1);
                            handleChange('notes', newNotes);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {formData.notes.length < 3 && (
                      <button
                        type="button"
                        onClick={() => handleChange('notes', [...formData.notes, ''])}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update Information' : t('employees.add_employee')}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>

      {/* Send Access Modal */}
      {showSendAccessModal && savedEmployeeData && (
        <SendAccessModal
          isOpen={showSendAccessModal}
          onClose={handleSendAccessClose}
          employee={savedEmployeeData}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && savedEmployee && (
        <InviteEmployeeModal
          isOpen={showInviteModal}
          onClose={handleInviteModalClose}
          employee={savedEmployee}
        />
      )}
    </>
  );
}

// Helper function to calculate salary breakdown
function getSalaryBreakdown(salaryType: string, rate: number) {
  let hourly = 0;
  
  switch (salaryType) {
    case 'hourly':
      hourly = rate;
      break;
    case 'weekly':
      hourly = rate / 40; // Assuming 40 hours per week
      break;
    case 'monthly':
      hourly = rate / (40 * 4.33); // Assuming 4.33 weeks per month
      break;
    case 'yearly':
      hourly = rate / (40 * 52); // Assuming 40 hours per week, 52 weeks per year
      break;
  }
  
  return {
    hourly: hourly.toFixed(2),
    weekly: (hourly * 40).toFixed(2),
    monthly: (hourly * 40 * 4.33).toFixed(2),
    yearly: (hourly * 40 * 52).toFixed(2)
  };
}