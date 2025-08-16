import React, { useState } from 'react';
import { 
  Bell, 
  Save, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Calendar, 
  Users, 
  CheckSquare, 
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect } from 'react';

interface NotificationType {
  id: string;
  name: string;
  description: string;
  roles: string[];
  channels: {
    web: boolean;
    email: boolean;
    app: boolean;
    sms: boolean;
  };
}

export default function NotificationSettings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Initial notification types
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: 'late_for_shift',
      name: 'Late for shift',
      description: 'Notify when an employee is late for their scheduled shift',
      roles: ['employee'],
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'new_schedule',
      name: 'New schedule awaiting selection',
      description: 'Notify when a new schedule is published and requires employee selection',
      roles: ['employee'],
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'schedule_approved',
      name: 'Schedule approved',
      description: 'Notify when a schedule has been approved by management',
      roles: ['employee'],
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'schedule_closing',
      name: 'Schedule closing soon – not signed up',
      description: 'Notify employees who haven\'t signed up for shifts before the schedule closes',
      roles: ['employee'],
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'shift_change_requested',
      name: 'Shift change requested',
      description: 'Notify when an employee requests a shift change',
      roles: ['manager', 'admin'],
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'irregular_shift',
      name: 'Irregular shift request',
      description: 'Notify when an employee requests a non-standard shift',
      roles: ['manager', 'admin'],
      channels: { web: true, email: true, app: true, sms: false }
    },
    {
      id: 'time_off',
      name: 'Time-off request submitted',
      description: 'Notify when an employee submits a time-off request',
      roles: ['manager', 'admin'],
      channels: { web: true, email: true, app: true, sms: false }
    }
  ]);
  
  const handleChannelToggle = (notificationId: string, channel: keyof NotificationType['channels']) => {
    setNotificationTypes(prev => 
      prev.map(notification => 
        notification.id === notificationId
          ? {
              ...notification,
              channels: {
                ...notification.channels,
                [channel]: !notification.channels[channel]
              }
            }
          : notification
      )
    );
    setHasChanges(true);
  };
  
  const handleRoleToggle = (notificationId: string, role: string) => {
    setNotificationTypes(prev => 
      prev.map(notification => {
        if (notification.id === notificationId) {
          const roles = notification.roles.includes(role)
            ? notification.roles.filter(r => r !== role)
            : [...notification.roles, role];
          return { ...notification, roles };
        }
        return notification;
      })
    );
    setHasChanges(true);
  };
  
  const handleSave = () => {
    // In a real app, this would save to backend
    setHasChanges(false);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to backend
    setShowSuccessToast(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };
  
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Notification Channels */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-blue-100">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="settings-card-title">Notification Channels</h3>
            <p className="settings-card-description">Choose how you want to receive each type of notification</p>
          </div>
        </div>
        
        <div className="table-container">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "25%"}}>
                  Notification
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "30%"}}>
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "15%"}}>
                  Roles
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "7.5%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Web</span>
                  </div>
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "7.5%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "7.5%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    <span>App</span>
                  </div>
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "7.5%"}}>
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>SMS</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationTypes.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="flex items-center gap-2">
                      {notification.id.includes('shift') || notification.id.includes('schedule') ? (
                        <Calendar className="w-4 h-4 flex-shrink-0 text-blue-500" />
                      ) : notification.id.includes('time_off') ? (
                        <Clock className="w-4 h-4 flex-shrink-0 text-purple-500" />
                      ) : notification.id.includes('late') ? (
                        <Clock className="w-4 h-4 flex-shrink-0 text-red-500" />
                      ) : (
                        <Bell className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900">{notification.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <span className="text-sm text-gray-500 break-words">{notification.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {isAdmin && (
                        <>
                          <label className="inline-flex items-center mr-2">
                            <input
                              type="checkbox"
                              checked={notification.roles.includes('employee')}
                              onChange={() => handleRoleToggle(notification.id, 'employee')}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-1 text-xs">Employee</span>
                          </label>
                          <label className="inline-flex items-center mr-2">
                            <input
                              type="checkbox"
                              checked={notification.roles.includes('manager')}
                              onChange={() => handleRoleToggle(notification.id, 'manager')}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-1 text-xs">Manager</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={notification.roles.includes('admin')}
                              onChange={() => handleRoleToggle(notification.id, 'admin')}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-1 text-xs">Admin</span>
                          </label>
                        </>
                      )}
                      {!isAdmin && (
                        <div className="flex flex-wrap gap-1">
                          {notification.roles.map(role => (
                            <span key={role} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <td className="px-2 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.channels.sms}
                        onChange={() => handleChannelToggle(notification.id, 'sms')}
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

      {/* Notification Categories */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-purple-100">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="settings-card-title">Notification Categories</h3>
            <p className="settings-card-description">Enable or disable entire categories of notifications</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 toggle-group">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div> 
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">Schedule Notifications</h4>
                    <div className="settings-tooltip">
                      <Info className="settings-tooltip-icon" />
                      <div className="settings-tooltip-content">
                        Receive notifications about new schedules, shift changes, and upcoming shifts
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Get updates when your schedule changes</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                  onChange={() => setHasChanges(true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div> 
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">Team Notifications</h4>
                    <div className="settings-tooltip">
                      <Info className="settings-tooltip-icon" />
                      <div className="settings-tooltip-content">
                        Stay informed about team member status changes, shift swaps, and availability updates
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Updates about your team members' activities</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                  onChange={() => setHasChanges(true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-yellow-600" />
                </div> 
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">Task Notifications</h4>
                    <div className="settings-tooltip">
                      <Info className="settings-tooltip-icon" />
                      <div className="settings-tooltip-content">
                        Get notified when tasks are assigned to you, approaching deadlines, or status changes
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Updates about your assigned tasks</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                  onChange={() => setHasChanges(true)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600" />
                </div> 
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">System Notifications</h4>
                    <div className="settings-tooltip">
                      <Info className="settings-tooltip-icon" />
                      <div className="settings-tooltip-content">
                        Critical alerts about system maintenance, security updates, and important announcements
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Important system alerts you shouldn't miss</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                  onChange={() => setHasChanges(true)}
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
          <span>Notification preferences updated successfully!</span>
        </div>
      )}

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-10">
          <button 
            onClick={handleSaveChanges}
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