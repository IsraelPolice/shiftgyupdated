import React, { useState } from 'react';
import { Bell, Save, Info, CheckCircle, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Simplified notification settings component for employees
 * Only shows relevant notifications for the employee role
 */
export default function EmployeeNotificationSettings() {
  const { t } = useLanguage();
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Limited notification types for employees
  const [notificationTypes, setNotificationTypes] = useState([
    {
      id: 'new_schedule',
      name: 'New schedule published',
      description: 'Get notified when a new schedule is published that requires your selection',
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'schedule_approved',
      name: 'Schedule approved',
      description: 'Receive confirmation when your requested schedule is approved by management',
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'schedule_closing',
      name: 'Schedule closing reminder',
      description: 'Get a reminder when you haven\'t signed up for shifts before the deadline',
      channels: { web: true, email: true, app: true, sms: false }
    }
  ]);
  
  const handleChannelToggle = (notificationId: string, channel: string) => {
    setNotificationTypes(prev => 
      prev.map(notification => 
        notification.id === notificationId
          ? {
              ...notification,
              channels: {
                ...notification.channels,
                [channel]: !notification.channels[channel as keyof typeof notification.channels]
              }
            }
          : notification
      )
    );
    setHasChanges(true);
  };
  
  const handleSave = () => {
    // In a real app, this would save to backend
    setShowSuccessToast(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
    
    setHasChanges(false);
  };
  
  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Notification Channels */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-blue-100">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="settings-card-title">Notification Preferences</h3>
            <p className="settings-card-description">Choose which notifications you receive and how they're delivered</p>
          </div>
        </div>
        
        <div className="table-container">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "30%"}}>
                  Notification
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "40%"}}>
                  Description
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "10%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Web</span>
                  </div>
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "10%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "10%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    <span>App</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationTypes.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{notification.name}</span>
                      <div className="settings-tooltip">
                        <Info className="settings-tooltip-icon ml-2" />
                        <div className="settings-tooltip-content">
                          {notification.id === 'new_schedule' 
                            ? 'Get notified as soon as a new schedule is published so you can select your shifts' 
                            : notification.id === 'schedule_approved'
                            ? 'Receive confirmation when your manager approves your requested shifts'
                            : 'Get a reminder to sign up for shifts before the schedule closes'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <span className="text-sm text-gray-500">{notification.description}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.channels.web}
                        onChange={() => handleChannelToggle(notification.id, 'web')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.channels.email}
                        onChange={() => handleChannelToggle(notification.id, 'email')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.channels.app}
                        onChange={() => handleChannelToggle(notification.id, 'app')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="settings-toast">
          <CheckCircle className="settings-toast-icon w-5 h-5" />
          <span>Notification preferences updated successfully!</span>
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
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}