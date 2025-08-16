import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  Monitor,
  Shield, 
  Crown, 
  User,
  Clock, 
  Calendar, 
  CheckSquare, 
  AlertTriangle,
  UserCheck,
  Users,
  Settings,
  Check
} from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface UserRole {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  selected: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  roles: string[];
}

interface GlobalControl {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function ModernNotificationPreferences() {
  // Notification Channels State
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'sms',
      name: 'SMS',
      description: 'Text messages to your phone',
      icon: <MessageSquare className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'push',
      name: 'App Push',
      description: 'Mobile app notifications',
      icon: <Smartphone className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Email notifications',
      icon: <Mail className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'web',
      name: 'Web',
      description: 'Browser notifications',
      icon: <Monitor className="w-6 h-6" />,
      enabled: false
    }
  ]);

  // User Roles State
  const [roles, setRoles] = useState<UserRole[]>([
    {
      id: 'admin',
      name: 'Admin',
      icon: <Shield className="w-5 h-5" />,
      color: 'purple',
      selected: true
    },
    {
      id: 'manager',
      name: 'Manager',
      icon: <Crown className="w-5 h-5" />,
      color: 'blue',
      selected: true
    },
    {
      id: 'employee',
      name: 'Employee',
      icon: <User className="w-5 h-5" />,
      color: 'green',
      selected: false
    }
  ]);

  // Notification Categories State
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'late_shift',
      title: 'Late for shift',
      description: 'Notify when an employee is late for their scheduled shift',
      icon: <Clock className="w-6 h-6" />,
      color: 'red',
      enabled: true,
      roles: ['employee']
    },
    {
      id: 'new_schedule',
      title: 'New schedule awaiting selection',
      description: 'Alert when a new schedule is published and requires employee selection',
      icon: <Calendar className="w-6 h-6" />,
      color: 'blue',
      enabled: true,
      roles: ['employee']
    },
    {
      id: 'schedule_approved',
      title: 'Schedule approved',
      description: 'Confirmation when a schedule has been approved by management',
      icon: <CheckSquare className="w-6 h-6" />,
      color: 'green',
      enabled: true,
      roles: ['employee']
    },
    {
      id: 'schedule_closing',
      title: 'Schedule closing soon',
      description: 'Reminder for employees who haven\'t signed up before deadline',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'orange',
      enabled: true,
      roles: ['employee']
    },
    {
      id: 'shift_change',
      title: 'Shift change requested',
      description: 'Notify managers when an employee requests a shift change',
      icon: <UserCheck className="w-6 h-6" />,
      color: 'purple',
      enabled: true,
      roles: ['manager', 'admin']
    },
    {
      id: 'time_off',
      title: 'Time-off request submitted',
      description: 'Alert when an employee submits a time-off request',
      icon: <Users className="w-6 h-6" />,
      color: 'indigo',
      enabled: true,
      roles: ['manager', 'admin']
    }
  ]);

  // Global Controls State
  const [globalControls, setGlobalControls] = useState<GlobalControl[]>([
    {
      id: 'team_notifications',
      title: 'Team Notifications',
      description: 'Receive updates about team member activities and status changes',
      icon: <Users className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'system_notifications',
      title: 'System Notifications',
      description: 'Important system alerts, maintenance updates, and announcements',
      icon: <Settings className="w-6 h-6" />,
      enabled: true
    },
    {
      id: 'task_notifications',
      title: 'Task Notifications',
      description: 'Updates about assigned tasks, deadlines, and completion status',
      icon: <CheckSquare className="w-6 h-6" />,
      enabled: false
    }
  ]);

  // Toggle Functions
  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
  };

  const toggleRole = (roleId: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, selected: !role.selected }
        : role
    ));
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, enabled: !category.enabled }
        : category
    ));
  };

  const toggleGlobalControl = (controlId: string) => {
    setGlobalControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, enabled: !control.enabled }
        : control
    ));
  };

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover' = 'bg') => {
    const colorMap = {
      red: { 
        bg: 'bg-red-100', 
        text: 'text-red-600', 
        border: 'border-red-200',
        hover: 'hover:bg-red-50'
      },
      blue: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-600', 
        border: 'border-blue-200',
        hover: 'hover:bg-blue-50'
      },
      green: { 
        bg: 'bg-green-100', 
        text: 'text-green-600', 
        border: 'border-green-200',
        hover: 'hover:bg-green-50'
      },
      orange: { 
        bg: 'bg-orange-100', 
        text: 'text-orange-600', 
        border: 'border-orange-200',
        hover: 'hover:bg-orange-50'
      },
      purple: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-600', 
        border: 'border-purple-200',
        hover: 'hover:bg-purple-50'
      },
      indigo: { 
        bg: 'bg-indigo-100', 
        text: 'text-indigo-600', 
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-50'
      }
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Notification Preferences
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customize how and when you receive notifications to stay informed about important updates
          </p>
        </div>

        {/* Notification Channels */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Notification Channels</h2>
            <p className="text-gray-600">Choose how you want to receive notifications</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  channel.enabled 
                    ? 'border-blue-200 shadow-md ring-2 ring-blue-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    channel.enabled 
                      ? 'bg-blue-100 text-blue-600 scale-110' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {channel.icon}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{channel.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{channel.description}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleChannel(channel.id)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      channel.enabled ? 'bg-blue-600 shadow-lg' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={channel.enabled}
                    aria-label={`Toggle ${channel.name} notifications`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
                        channel.enabled ? 'translate-x-7 scale-110' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Role Selector */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">User Roles</h2>
            <p className="text-gray-600">Select which roles should receive notifications</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                  role.selected
                    ? `${getColorClasses(role.color, 'border')} ${getColorClasses(role.color, 'bg')} shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  role.selected 
                    ? `${getColorClasses(role.color, 'bg')} ${getColorClasses(role.color, 'text')} scale-110`
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {role.icon}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{role.name}</span>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    role.selected
                      ? `border-${role.color}-500 bg-${role.color}-500 scale-110`
                      : 'border-gray-300 bg-white'
                  }`}>
                    {role.selected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Notification Categories */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Notification Types</h2>
            <p className="text-gray-600">Configure specific notification categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  category.enabled 
                    ? `${getColorClasses(category.color, 'border')} shadow-md ring-2 ring-opacity-20 ring-${category.color}-500`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    category.enabled 
                      ? `${getColorClasses(category.color, 'bg')} ${getColorClasses(category.color, 'text')} scale-110 shadow-lg`
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {category.icon}
                  </div>
                  
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      category.enabled 
                        ? `bg-${category.color}-600 focus:ring-${category.color}-500 shadow-lg`
                        : 'bg-gray-200 focus:ring-gray-500'
                    }`}
                    role="switch"
                    aria-checked={category.enabled}
                    aria-label={`Toggle ${category.title} notifications`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
                        category.enabled ? 'translate-x-6 scale-110' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{category.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.roles.map((roleId) => {
                      const role = roles.find(r => r.id === roleId);
                      return role ? (
                        <span
                          key={roleId}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                            getColorClasses(role.color, 'bg') + ' ' + getColorClasses(role.color, 'text')
                          }`}
                        >
                          {role.icon}
                          {role.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Controls */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Global Controls</h2>
            <p className="text-gray-600">Master switches for notification categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {globalControls.map((control) => (
              <div
                key={control.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  control.enabled 
                    ? 'border-blue-200 shadow-md ring-2 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    control.enabled 
                      ? 'bg-blue-100 text-blue-600 scale-110 shadow-lg'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {control.icon}
                  </div>
                  
                  <button
                    onClick={() => toggleGlobalControl(control.id)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      control.enabled ? 'bg-blue-600 shadow-lg' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={control.enabled}
                    aria-label={`Toggle ${control.title}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
                        control.enabled ? 'translate-x-7 scale-110' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{control.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{control.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Save Preferences
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:-translate-y-1">
            Reset to Defaults
          </button>
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-2xl shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All preferences saved automatically</span>
          </div>
        </div>
      </div>
    </div>
  );
}