import React, { useState } from 'react';
import { Coffee, Clock, Users, Settings, Save, Info, CheckCircle } from 'lucide-react';
import { useBreaks } from '../../contexts/BreakContext';
import { useAuth } from '../../contexts/AuthContext';

export default function BreakSettings() {
  const { breakSettings, updateBreakSettings } = useBreaks();
  const { hasPermission } = useAuth();
  const [settings, setSettings] = useState(breakSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const canManageSettings = hasPermission('manage_schedules') || hasPermission('view_all');

  if (!canManageSettings) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">You don't have permission to manage break settings</p>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateBreakSettings(settings);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Settings Cards */}
      <div className="space-y-6 overflow-hidden">
        {/* General Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon bg-blue-100">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="settings-card-title">General Settings</h3>
              <p className="settings-card-description">Configure the core functionality of the break management system</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="settings-toggle-item">
              <div className="settings-toggle-content">
                <div className="flex items-center">
                  <label className="settings-toggle-label">Enable Breaks</label>
                  <div className="settings-tooltip">
                    <Info className="settings-tooltip-icon" />
                    <div className="settings-tooltip-content">
                      Turn on the break management system to schedule and track employee breaks during shifts
                    </div>
                  </div>
                </div>
                <p className="settings-toggle-description">Allow break scheduling and management across your organization</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of breaks per shift
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.breaksPerShift}
                  onChange={(e) => handleChange('breaksPerShift', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!settings.enabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default duration per break (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  step="5"
                  value={settings.defaultDuration}
                  onChange={(e) => handleChange('defaultDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!settings.enabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon bg-purple-100">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="settings-card-title">Automation Settings</h3>
              <p className="settings-card-description">Control how breaks are automatically assigned and distributed</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Auto-assign breaks randomly within time zones</label>
                <div className="flex items-center">
                  <div className="settings-tooltip">
                    <Info className="settings-tooltip-icon" />
                    <div className="settings-tooltip-content">
                      When enabled, the system will automatically distribute breaks evenly throughout shifts
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Evenly distribute breaks across available time slots</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoAssign}
                  onChange={(e) => handleChange('autoAssign', e.target.checked)}
                  className="sr-only peer"
                  disabled={!settings.enabled}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Capacity Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon bg-green-100">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="settings-card-title">Capacity Settings</h3>
              <p className="settings-card-description">Set limits on how many employees can take breaks simultaneously</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max employees per break slot
                <div className="settings-tooltip inline-block">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Limit how many employees can be on break at the same time to maintain operational coverage
                  </div>
                </div>
                <div className="settings-tooltip inline-block">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Set the standard length of each break in minutes (typically 15-30 minutes)
                  </div>
                </div>
                <div className="settings-tooltip inline-block">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Set the default number of breaks employees are entitled to during a standard shift
                  </div>
                </div>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxConcurrentBreaks}
                onChange={(e) => handleChange('maxConcurrentBreaks', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!settings.enabled}
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum number of employees that can take breaks at the same time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="settings-toast">
          <CheckCircle className="settings-toast-icon w-5 h-5" />
          <span>Break settings updated successfully!</span>
        </div>
      )}

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-10">
          <button 
            onClick={handleSave}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}