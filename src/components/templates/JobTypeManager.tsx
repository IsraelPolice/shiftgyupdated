import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Info, 
  Calendar, 
  Clock, 
  AlertTriangle,
  Check
} from 'lucide-react';

export interface JobType {
  id: string;
  name: string;
  maxShiftsPerWeek: number;
  maxHoursPerDay: number;
  allowedDays: string[];
  isBuiltIn?: boolean;
}

interface JobTypeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobTypes: JobType[]) => void;
  initialJobTypes: JobType[];
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function JobTypeManager({ isOpen, onClose, onSave, initialJobTypes }: JobTypeManagerProps) {
  const [jobTypes, setJobTypes] = useState<JobType[]>(initialJobTypes);
  const [editingJobType, setEditingJobType] = useState<JobType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<JobType, 'id'>>({
    name: '',
    maxShiftsPerWeek: 5,
    maxHoursPerDay: 8,
    allowedDays: []
  });
  const [errors, setErrors] = useState<{
    name?: string;
    maxShiftsPerWeek?: string;
    maxHoursPerDay?: string;
    allowedDays?: string;
  }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Reset form when editing job type changes
  useEffect(() => {
    if (editingJobType) {
      setFormData({
        name: editingJobType.name,
        maxShiftsPerWeek: editingJobType.maxShiftsPerWeek,
        maxHoursPerDay: editingJobType.maxHoursPerDay,
        allowedDays: [...editingJobType.allowedDays]
      });
      setShowAddForm(true);
    } else if (!showAddForm) {
      setFormData({
        name: '',
        maxShiftsPerWeek: 5,
        maxHoursPerDay: 8,
        allowedDays: []
      });
    }
  }, [editingJobType, showAddForm]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const newAllowedDays = prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day];
      
      return { ...prev, allowedDays: newAllowedDays };
    });
    
    if (errors.allowedDays) {
      setErrors(prev => ({ ...prev, allowedDays: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Job type name is required';
    } else if (
      jobTypes.some(jt => 
        jt.name.toLowerCase() === formData.name.toLowerCase() && 
        (!editingJobType || jt.id !== editingJobType.id)
      )
    ) {
      newErrors.name = 'A job type with this name already exists';
    }
    
    if (formData.maxShiftsPerWeek <= 0) {
      newErrors.maxShiftsPerWeek = 'Must be greater than 0';
    }
    
    if (formData.maxHoursPerDay <= 0) {
      newErrors.maxHoursPerDay = 'Must be greater than 0';
    }
    
    if (formData.allowedDays.length === 0) {
      newErrors.allowedDays = 'Select at least one day';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddJobType = () => {
    if (!validateForm()) return;
    
    const newJobType: JobType = {
      id: Date.now().toString(),
      ...formData
    };
    
    setJobTypes(prev => [...prev, newJobType]);
    setShowAddForm(false);
    setFormData({
      name: '',
      maxShiftsPerWeek: 5,
      maxHoursPerDay: 8,
      allowedDays: []
    });
  };

  const handleUpdateJobType = () => {
    if (!editingJobType || !validateForm()) return;
    
    setJobTypes(prev => 
      prev.map(jt => 
        jt.id === editingJobType.id 
          ? { ...jt, ...formData } 
          : jt
      )
    );
    
    setEditingJobType(null);
    setShowAddForm(false);
  };

  const handleDeleteJobType = (id: string) => {
    if (jobTypes.find(jt => jt.id === id)?.isBuiltIn) {
      alert('Built-in job types cannot be deleted');
      return;
    }
    
    setJobTypes(prev => prev.filter(jt => jt.id !== id));
    
    if (editingJobType?.id === id) {
      setEditingJobType(null);
      setShowAddForm(false);
    }
    
    setShowDeleteConfirm(null);
  };

  const handleSaveAll = () => {
    onSave(jobTypes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Job Type Manager</h2>
              <p className="text-sm text-gray-500">Define job types with specific scheduling constraints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Job Types List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Defined Job Types</h3>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Job Type
              </button>
            )}
          </div>
          
          {jobTypes.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-1">No Job Types Defined</h4>
              <p className="text-gray-500 mb-4">Create your first job type to get started</p>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job Type
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {jobTypes.map(jobType => (
                <div 
                  key={jobType.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 mb-1">{jobType.name}</h4>
                        {jobType.isBuiltIn && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Built-in
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>Max {jobType.maxShiftsPerWeek} shifts/week</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>Max {jobType.maxHoursPerDay} hours/day</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Allowed days:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {DAYS_OF_WEEK.map(day => (
                            <span 
                              key={day} 
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                jobType.allowedDays.includes(day)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-400 line-through'
                              }`}
                            >
                              {day.substring(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingJobType(jobType)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit Job Type"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(jobType.id)}
                        className={`p-1 ${
                          jobType.isBuiltIn 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-600 hover:bg-red-100'
                        } rounded`}
                        title={jobType.isBuiltIn ? 'Built-in types cannot be deleted' : 'Delete Job Type'}
                        disabled={jobType.isBuiltIn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingJobType ? 'Edit Job Type' : 'Add New Job Type'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingJobType(null);
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Student, Part-time, Full-time"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Shifts Per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.maxShiftsPerWeek}
                    onChange={(e) => handleInputChange('maxShiftsPerWeek', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border ${
                      errors.maxShiftsPerWeek ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.maxShiftsPerWeek && (
                    <p className="text-red-600 text-xs mt-1">{errors.maxShiftsPerWeek}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Hours Per Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={formData.maxHoursPerDay}
                    onChange={(e) => handleInputChange('maxHoursPerDay', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border ${
                      errors.maxHoursPerDay ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.maxHoursPerDay && (
                    <p className="text-red-600 text-xs mt-1">{errors.maxHoursPerDay}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed Days
                </label>
                <div className={`flex flex-wrap gap-2 ${
                  errors.allowedDays ? 'p-2 border border-red-300 rounded-lg' : ''
                }`}>
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.allowedDays.includes(day)
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {errors.allowedDays && (
                  <p className="text-red-600 text-xs mt-1">{errors.allowedDays}</p>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Job Type Constraints</p>
                    <p className="text-sm text-blue-700 mt-1">
                      These settings will be enforced when creating templates using this job type.
                      Employees with this job type will only be scheduled according to these constraints.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingJobType(null);
                    setErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingJobType ? handleUpdateJobType : handleAddJobType}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  {editingJobType ? 'Update Job Type' : 'Add Job Type'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this job type? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJobType(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Job Type
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 inline-block mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}