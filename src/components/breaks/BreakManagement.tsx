import React, { useState } from 'react';
import { Coffee, Clock, Users, Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useBreaks } from '../../contexts/BreakContext';
import { useAuth } from '../../contexts/AuthContext';

export default function BreakManagement() {
  const [selectedShift, setSelectedShift] = useState('shift1');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [editingBreak, setEditingBreak] = useState<any>(null);
  const { 
    breakSettings, 
    getBreaksForShift, 
    getBreakAssignmentsForShift,
    addShiftBreak,
    updateShiftBreak,
    deleteShiftBreak
  } = useBreaks();
  const { hasPermission } = useAuth();

  const canManageBreaks = hasPermission('manage_schedules');
  const shiftBreaks = getBreaksForShift(selectedShift);
  const breakAssignments = getBreakAssignmentsForShift(selectedShift);

  if (!breakSettings.enabled) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Break Management Disabled</h3>
        <p className="text-gray-500">Enable break management in settings to use this feature</p>
      </div>
    );
  }

  const handleAddBreak = () => {
    setEditingBreak(null);
    setShowBreakModal(true);
  };

  const handleEditBreak = (breakItem: any) => {
    setEditingBreak(breakItem);
    setShowBreakModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Break Management</h1>
          <p className="text-gray-600 mt-1">Manage shift breaks and assignments</p>
        </div>
        
        {canManageBreaks && (
          <button 
            onClick={handleAddBreak}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Break Slot
          </button>
        )}
      </div>

      {/* Shift Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Shift:</label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="shift1">Morning Shift (9:00 AM - 5:00 PM)</option>
            <option value="shift2">Evening Shift (2:00 PM - 10:00 PM)</option>
            <option value="shift3">Night Shift (10:00 PM - 6:00 AM)</option>
          </select>
        </div>
      </div>

      {/* Break Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Break Slots</p>
              <p className="text-3xl font-bold text-gray-900">{shiftBreaks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Breaks</p>
              <p className="text-3xl font-bold text-gray-900">{breakAssignments.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Break Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {shiftBreaks.reduce((total, b) => total + b.duration, 0)}m
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Break Slots */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Break Slots</h2>
        </div>

        <div className="p-6">
          {shiftBreaks.length > 0 ? (
            <div className="space-y-4">
              {shiftBreaks.map((breakSlot) => (
                <div key={breakSlot.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {breakSlot.startRange} - {breakSlot.endRange}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{breakSlot.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Max {breakSlot.maxConcurrentEmployees} employees
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Assigned: {breakSlot.assignedUserIds.length} / {breakSlot.maxConcurrentEmployees}
                      </div>
                    </div>

                    {canManageBreaks && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditBreak(breakSlot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteShiftBreak(breakSlot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No break slots configured</h3>
              <p className="text-gray-500">Add break slots to manage employee breaks for this shift</p>
            </div>
          )}
        </div>
      </div>

      {/* Break Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Break Assignments</h2>
        </div>

        <div className="p-6">
          {breakAssignments.length > 0 ? (
            <div className="space-y-4">
              {breakAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {assignment.employeeId === '1' ? 'SJ' : assignment.employeeId === '2' ? 'MC' : 'ED'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {assignment.employeeId === '1' ? 'Sarah Johnson' : 
                         assignment.employeeId === '2' ? 'Michael Chen' : 'Emily Davis'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.startTime} - {assignment.endTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      assignment.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {assignment.status}
                    </span>
                    
                    {canManageBreaks && (
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No break assignments</h3>
              <p className="text-gray-500">Assign employees to break slots to manage break schedules</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}