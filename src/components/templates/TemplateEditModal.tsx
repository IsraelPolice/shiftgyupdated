import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Users, Building2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  workDays: string[];
  department: string;
  maxEmployees: number;
}

interface TemplateEditModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
}

const TemplateEditModal: React.FC<TemplateEditModalProps> = ({
  template,
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Template>({
    id: '',
    name: '',
    description: '',
    category: '',
    startTime: '09:00',
    endTime: '17:00',
    workDays: [],
    department: '',
    maxEmployees: 5
  });

  useEffect(() => {
    if (template) {
      setFormData(template);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        description: '',
        category: '',
        startTime: '09:00',
        endTime: '17:00',
        workDays: [],
        department: '',
        maxEmployees: 5
      });
    }
    setCurrentStep(1);
  }, [template, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleWorkDay = (day: string) => {
    const newWorkDays = formData.workDays.includes(day)
      ? formData.workDays.filter(d => d !== day)
      : [...formData.workDays, day];
    setFormData({ ...formData, workDays: newWorkDays });
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Template Info', icon: Building2 },
    { number: 2, title: 'Working Hours', icon: Clock },
    { number: 3, title: 'Break Times', icon: Calendar },
    { number: 4, title: 'Employee Assignment', icon: Users },
    { number: 5, title: 'Review & Save', icon: X }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {template ? 'Edit Template' : 'Create New Template'}
              </h2>
              <p className="text-blue-100 text-sm">Step {currentStep} of 5</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-blue-400 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= step.number ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                }`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className="text-xs mt-1 text-blue-100">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe this template..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Evening Shift">Evening Shift</option>
                    <option value="Night Shift">Night Shift</option>
                    <option value="Split Shift">Split Shift</option>
                    <option value="Flexible Hours">Flexible Hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Sales">Sales</option>
                    <option value="Management">Management</option>
                    <option value="Security">Security</option>
                    <option value="All">All Departments</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Work Days</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <label key={day} className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.workDays.includes(day)}
                        onChange={() => toggleWorkDay(day)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Employees
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxEmployees}
                  onChange={(e) => setFormData({...formData, maxEmployees: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Break Times</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Break Configuration:</strong>
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Standard 8-hour shifts include one 30-minute break</li>
                  <li>• 12-hour shifts include two 20-minute breaks</li>
                  <li>• Part-time shifts (4 hours) include one 15-minute break</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Assignment</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Instructions:</strong>
                </p>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Save the template first</li>
                  <li>2. Use the main templates page to assign employees</li>
                  <li>3. Drag employees from the sidebar to template slots</li>
                  <li>4. Click assigned employees to remove them</li>
                </ol>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Save</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div><strong>Name:</strong> {formData.name}</div>
                <div><strong>Category:</strong> {formData.category}</div>
                <div><strong>Department:</strong> {formData.department}</div>
                <div><strong>Hours:</strong> {formData.startTime} - {formData.endTime}</div>
                <div><strong>Work Days:</strong> {formData.workDays.join(', ')}</div>
                <div><strong>Max Employees:</strong> {formData.maxEmployees}</div>
                <div><strong>Description:</strong> {formData.description || 'No description'}</div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-sm">✓ Ready to save template</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {currentStep === 5 ? (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Template'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditModal;