import React, { useState } from 'react';
import { Clock, MapPin, Bell, Settings, Save, Info, CheckCircle } from 'lucide-react';
import { usePresence } from '../../contexts/PresenceContext';
import { useAuth } from '../../contexts/AuthContext';

export default function PresenceSettings() {
  const { presenceSettings, updatePresenceSettings } = usePresence();
  const { hasPermission } = useAuth();
  const [settings, setSettings] = useState(presenceSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const canManageSettings = hasPermission('manage_schedules') || hasPermission('view_all');

  if (!canManageSettings) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">You don't have permission to manage presence settings</p>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePresenceSettings(settings);
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
              <p className="settings-card-description">Configure the core functionality of the presence tracking system</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="settings-toggle-item">
              <div className="settings-toggle-content">
                <div className="flex items-center">
                  <label className="settings-toggle-label">Enable Presence System Globally</label>
                  <div className="settings-tooltip">
                    <Info className="settings-tooltip-icon" />
                    <div className="settings-tooltip-content">
                      Turn on the clock in/out system for all eligible employees across your organization
                    </div>
                  </div>
                </div>
                <p className="settings-toggle-description">Allow employees to clock in and out of their shifts</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Clock-in Method
                <div className="settings-tooltip inline-block">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Choose how employees will clock in by default - manually or automatically based on schedule
                  </div>
                </div>
              </label>
              <select
                value={settings.defaultMethod}
                onChange={(e) => handleChange('defaultMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!settings.enabled}
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon bg-yellow-100">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="settings-card-title">Reminder Settings</h3>
              <p className="settings-card-description">Set up automated notifications to help employees stay on schedule</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send reminders if not clocked in by
                <div className="settings-tooltip inline-block">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Automatically send notifications to employees who haven't clocked in by this time
                  </div>
                </div>
              </label>
              <input
                type="time"
                value={settings.reminderTime || '09:00'}
                onChange={(e) => handleChange('reminderTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!settings.enabled}
              />
            </div>

            <div className="settings-toggle-item">
              <div className="settings-toggle-content">
                <div className="flex items-center">
                  <label className="settings-toggle-label">Remind to clock out after scheduled shift</label>
                  <div className="settings-tooltip">
                    <Info className="settings-tooltip-icon" />
                    <div className="settings-tooltip-content">
                      Send automatic reminders to employees to clock out when their scheduled shift ends
                    </div>
                  </div>
                </div>
                <p className="settings-toggle-description">Send notifications when shift ends to prevent forgotten clock-outs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.remindClockOut}
                  onChange={(e) => handleChange('remindClockOut', e.target.checked)}
                  className="sr-only peer"
                  disabled={!settings.enabled}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon bg-green-100">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="settings-card-title">Location Settings</h3>
              <p className="settings-card-description">Control how employee locations are tracked during clock in/out</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Allow geo-location tracking</label>
                <div className="flex items-center">
                  <div className="settings-tooltip">
                    <Info className="settings-tooltip-icon" />
                    <div className="settings-tooltip-content">
                      When enabled, the system will record the employee's physical location when they clock in or out
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Record employee location during clock in/out for verification</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowGeoLocation}
                  onChange={(e) => handleChange('allowGeoLocation', e.target.checked)}
                  className="sr-only peer"
                  disabled={!settings.enabled}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="settings-toast">
          <CheckCircle className="settings-toast-icon w-5 h-5" />
          <span>Presence settings updated successfully!</span>
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