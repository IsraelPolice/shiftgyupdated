import React, { useState, useRef } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Building2, 
  Tag,
  CreditCard,
  BarChart3,
  Grid, 
  Upload,
  Save,
  CheckCircle,
  Lock,
  Smartphone,
  Info,
  Building,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanySettings } from '../contexts/CompanySettingsContext';
import { WORK_WEEK_TYPES } from '../utils/workWeekUtils';
import { isEmployeeRole } from '../utils/roleUtils';
import BillingOverview from '../components/upgrade/BillingOverview';
import SecuritySettings from './settings/SecuritySettings';
import NotificationSettings from './settings/NotificationSettings';
import EmployeeNotificationSettings from './settings/EmployeeNotificationSettings';
import TagsSettings from './settings/TagsSettings';
import MarketplaceSettings from './settings/MarketplaceSettings';
import ReportsConfiguration from './settings/ReportsConfiguration';
import ModernNotificationPreferences from './settings/ModernNotificationPreferences';
import BillingSettings from './settings/BillingSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { user } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();
  const isEmployee = isEmployeeRole(user);

  // Define all tabs with proper categorization
  const sidebarSections = [
    {
      title: 'ACCOUNT',
      items: [
        { id: 'profile', name: 'Profile Information', icon: User },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
      ]
    },
    {
      title: 'APPLICATION',
      items: [
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'company', name: 'Company', icon: Building2 },
        { id: 'tags', name: 'Tags', icon: Tag },
      ]
    },
    {
      title: 'BUSINESS',
      items: [
        { id: 'billing', name: 'Billing', icon: CreditCard },
        { id: 'reports', name: 'Reports Configuration', icon: BarChart3 },
        { id: 'marketplace', name: 'Marketplace', icon: Grid },
      ]
    }
  ];

  // Filter sections based on user role
  const filteredSections = isEmployee 
    ? sidebarSections.filter(section => section.title === 'ACCOUNT').map(section => ({
        ...section,
        items: section.items.filter(item => ['profile', 'notifications'].includes(item.id))
      }))
    : sidebarSections;

  // If employee tries to access a tab they shouldn't, redirect to profile
  if (isEmployee && !['profile', 'notifications'].includes(activeTab)) {
    setActiveTab('profile');
  }

  return (
    <div className="w-full">
    <div className="flex min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar Navigation */}
      <aside className="w-70 bg-white shadow-sm border-r border-gray-200 flex-shrink-0">
        {/* Clean Settings Header - No Background Box */}
        <div className="px-6 py-6">
          <h1 className={`text-xl font-semibold text-gray-900 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' ? 'הגדרות' : 'Settings'}
          </h1>
          <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' ? 'נהל את החשבון שלך והעדפות האפליקציה' : 'Manage your account and application preferences'}
          </p>
        </div>

        {/* Navigation sections */}
        <div className="px-4 py-4">
          <nav className="sidebar-nav">
          {filteredSections.map((section) => (
            <div key={section.title} className="nav-section">
              <h3 className={`nav-section-title ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 
                  (section.title === 'ACCOUNT' ? 'חשבון' : 
                   section.title === 'APPLICATION' ? 'אפליקציה' : 
                   section.title === 'BUSINESS' ? 'עסקי' : section.title) 
                  : section.title}
              </h3>
              <ul className="nav-section-items">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <IconComponent className="nav-item-icon" />
                        <span className="nav-item-text">
                          {language === 'he' ? 
                            (item.id === 'profile' ? 'מידע פרופיל' :
                             item.id === 'notifications' ? 'התראות' :
                             item.id === 'security' ? 'אבטחה' :
                             item.id === 'appearance' ? 'מראה' :
                             item.id === 'company' ? 'חברה' :
                             item.id === 'tags' ? 'תגים' :
                             item.id === 'billing' ? 'חיוב' :
                             item.id === 'reports' ? 'הגדרת דוחות' :
                             item.id === 'marketplace' ? 'שוק האפליקציות' : item.name)
                            : item.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-screen overflow-hidden">
        <div className="w-full p-8">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <ModernNotificationPreferences />}
          {!isEmployee && activeTab === 'security' && (
            <div className="w-full p-8">
              <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">Security Settings</h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Manage your account security and protection settings to keep your information safe
                  </p>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                        <p className="text-gray-600">Update your password regularly to maintain account security</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      
                      {/* Left Column - Password Inputs */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Current Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter your current password"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Create a strong, unique password"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Confirm New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Re-enter your new password"
                          />
                        </div>
                      </div>

                      {/* Right Column - Password Requirements */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Password Requirements:</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">At least 8 characters</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">At least one uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">At least one number</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">At least one special character</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                          <p className="text-gray-600 dark:text-gray-300">Add an extra verification step when signing in to protect your account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-green-50">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                          Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password. This significantly increases your account protection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SSO Integration Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Building className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Single Sign-On (SSO) Integration</h3>
                          <p className="text-gray-600 dark:text-gray-300">Enable employees to sign in using your organization's identity provider</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Connect with Google Workspace, Microsoft Azure, or Okta</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">G</span>
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">Google Workspace</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">M</span>
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">Microsoft Azure</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">O</span>
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">Okta</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Security Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Session Security</h3>
                        <p className="text-gray-600">Control how long users stay signed in and manage active sessions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    
                    {/* Automatic Logout */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Automatic Logout</label>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Sign out users after a period of inactivity</p>
                      <select className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>Never</option>
                        <option>After 30 minutes</option>
                        <option>After 1 hour</option>
                        <option>After 2 hours</option>
                        <option>After 8 hours</option>
                      </select>
                    </div>
                    
                    {/* Require Password for Sensitive Operations */}
                    <div className="flex items-center justify-between py-4 border border-gray-200 rounded-xl px-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Require Password for Sensitive Operations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Re-authenticate for sensitive actions like changing security settings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-14 h-7 bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {/* Log Out Sessions */}
                    <div className="pt-6 border-t border-gray-200">
                      <button className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm">
                        Log Out of All Other Sessions
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
          {!isEmployee && activeTab === 'appearance' && <AppearanceSettings />}
          {!isEmployee && activeTab === 'tags' && <TagsSettings />}
          {!isEmployee && activeTab === 'company' && <CompanySettings />}
          {!isEmployee && activeTab === 'reports' && <ReportsConfiguration />}
          {!isEmployee && activeTab === 'billing' && <BillingSettings />}
          {!isEmployee && activeTab === 'marketplace' && <MarketplaceSettings />}
        </div>
      </main>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="modern-toast">
          <CheckCircle className="toast-icon" />
          <span>Settings updated successfully!</span>
        </div>
      )}
    </div>
    </div>
  );
}

function ProfileSettings() {
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const isEmployee = isEmployeeRole(user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload only JPG or PNG images');
      return;
    }
    
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveChanges = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border w-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          {language === 'he' ? 'מידע פרופיל' : 'Profile Information'}
        </h2>
        <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
          {language === 'he' ? 'עדכן את המידע האישי שלך ותמונת הפרופיל' : 'Update your personal information and profile picture'}
        </p>
      </div>

      <div className="p-8 w-full">
        {/* Avatar Section */}
        <div className={`flex items-center gap-6 mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="avatar-container">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="avatar-controls">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4" />
              {language === 'he' ? 'העלה תמונה' : 'Upload Photo'}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {t('settings.photo_compliance_tooltip')}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'he' ? 'JPG, PNG עד 2MB' : 'JPG, PNG up to 2MB'}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className={`grid grid-cols-1 xl:grid-cols-3 gap-8 w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Left Column */}
          <div className="space-y-6">
            <div className="form-field">
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'שם מלא' : 'Full Name'}
              </label>
              <input
                type="text"
                defaultValue={user?.name}
                disabled={isEmployee}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isEmployee ? 'bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="form-field">
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'תפקיד' : 'Role'}
              </label>
              <input
                type="text"
                value={user?.role.replace('_', ' ').toUpperCase()}
                disabled
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <div className="form-field">
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'אימייל' : 'Email'}
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled={isEmployee}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isEmployee ? 'bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                dir="ltr"
              />
            </div>

            <div className="form-field">
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 'מחלקה' : 'Department'}
              </label>
              <input
                type="text"
                defaultValue={user?.department}
                disabled={isEmployee}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isEmployee ? 'bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {!isEmployee && (
          <div className={`form-actions ${isRTL ? 'justify-start' : 'justify-end'}`}>
            <button 
              onClick={handleSaveChanges}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {language === 'he' ? 'שמור שינויים' : 'Save Changes'}
            </button>
          </div>
        )}
        
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="profile-toast">
            <CheckCircle className="toast-icon" />
            <span>
              {language === 'he' ? 'מידע הפרופיל עודכן בהצלחה!' : 'Profile information updated successfully!'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { language, setLanguage, isRTL } = useLanguage();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const handleSavePreferences = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };
  
  return (
    <div className="appearance-settings">
      <div className="content-header">
        <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          {language === 'he' ? 'מראה ושפה' : 'Appearance & Language'}
        </h2>
        <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
          {language === 'he' ? 'התאם את המראה החזותי של הלוח שלך' : 'Customize the visual appearance of your dashboard'}
        </p>
      </div>

      <div className="settings-section">
        <div className="section-header">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' ? 'הגדרות שפה' : 'Language Settings'}
          </h3>
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' ? 'בחר את השפה המועדפת עליך לממשק' : 'Choose your preferred language for the interface'}
          </p>
        </div>
        
        <div className="language-selector">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'he')}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="en">English</option>
            <option value="he">עברית (Hebrew)</option>
          </select>
        </div>
      </div>
      
      <div className="settings-section">
        <div className="section-header">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' ? 'הגדרות ערכת נושא' : 'Theme Settings'}
          </h3>
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' ? 'התאם את המראה החזותי של הלוח שלך' : 'Customize the visual appearance of your dashboard'}
          </p>
        </div>
        
        <div className="theme-options">
          {[
            { 
              id: 'light', 
              name: language === 'he' ? 'בהיר' : 'Light', 
              description: language === 'he' ? 'ממשק נקי ובהיר' : 'Clean and bright interface' 
            },
            { 
              id: 'dark', 
              name: language === 'he' ? 'כהה' : 'Dark', 
              description: language === 'he' ? 'קל לעיניים' : 'Easy on the eyes' 
            },
            { 
              id: 'auto', 
              name: language === 'he' ? 'אוטומטי' : 'Auto', 
              description: language === 'he' ? 'תואם להעדפת המערכת' : 'Matches system preference' 
            },
          ].map((theme) => (
            <label key={theme.id} className="theme-option">
              <input
                type="radio"
                name="theme"
                value={theme.id}
                className="theme-radio"
              />
              <div className={`p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
                <h4 className="font-medium text-gray-900 dark:text-white">{theme.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{theme.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className={`form-actions ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <button 
            onClick={handleSavePreferences}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {language === 'he' ? 'שמור העדפות' : 'Save Preferences'}
          </button>
        </div>
      </div>
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="appearance-toast">
          <CheckCircle className="toast-icon" />
          <span>
            {language === 'he' ? 'הגדרות המראה עודכנו בהצלחה!' : 'Appearance settings updated successfully!'}
          </span>
        </div>
      )}
    </div>
  );
}

function CompanySettings() {
  const { language, isRTL } = useLanguage();
  const { workWeekType, updateWorkWeekType } = useCompanySettings();
  const { currentCompany } = useAuth();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const handleWorkWeekChange = (newType) => {
    updateWorkWeekType(newType);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  return (
    <div className="company-settings">
      <div className="content-header">
        <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          {language === 'he' ? 'הגדרות חברה' : 'Company Settings'}
        </h2>
        <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
          {language === 'he' ? 'נהל את הגדרות הארגון שלך' : 'Manage your organization settings'}
        </p>
      </div>
      
      {/* Work Week Configuration Section */}
      <div className="settings-section">
        <div className="section-header">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
            <Clock className="w-5 h-5 inline mr-2 text-blue-600" />
            {language === 'he' ? 'שבוע העבודה של החברה' : 'Company Work Week'}
          </h3>
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'he' 
              ? 'הגדר את תבנית שבוע העבודה של החברה. זה ישפיע על לוח הזמנים, תוספות סוף השבוע ותצוגת הקלנדר.'
              : 'Configure your company\'s work week pattern. This affects scheduling, weekend premiums, and calendar display.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.values(WORK_WEEK_TYPES).map(type => (
            <div
              key={type.id}
              className={`border-2 rounded-xl p-6 transition-all cursor-pointer hover:shadow-md ${
                workWeekType.id === type.id 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleWorkWeekChange(type)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    workWeekType.id === type.id ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'he' ? type.nameHe : type.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {language === 'he' ? type.shortNameHe : type.shortName}
                    </p>
                  </div>
                </div>
                {workWeekType.id === type.id && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {language === 'he' ? type.descriptionHe : type.description}
              </p>
              
              {/* Days of week visualization */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'ימי עבודה:' : 'Work Days:'}
                  </p>
                  <div className="flex gap-1">
                    {[0,1,2,3,4,5,6].map(day => {
                      const dayNames = language === 'he' 
                        ? ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
                        : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                      const shortDayNames = language === 'he' 
                        ? ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']
                        : ['S','M','T','W','T','F','S'];
                      const isWorkDay = type.workDays.includes(day);
                      const isWeekend = type.weekendDays.includes(day);
                      
                      return (
                        <div
                          key={day}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isWorkDay ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                            isWeekend ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 
                            'bg-gray-100 text-gray-400'
                          }`}
                          title={dayNames[day]}
                        >
                          {shortDayNames[day]}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    {language === 'he' ? 'ימי עבודה' : 'Work Days'}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
                    {language === 'he' ? 'סוף השבוע' : 'Weekend'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Current Configuration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                {language === 'he' ? 'הגדרה נוכחית' : 'Current Configuration'}
              </h4>
              <div className="text-blue-700 text-sm space-y-1">
                <div>
                  <strong>{language === 'he' ? 'סוג:' : 'Type:'}</strong> {' '}
                  {language === 'he' ? workWeekType.nameHe : workWeekType.name}
                </div>
                <div>
                  <strong>{language === 'he' ? 'ימי עבודה:' : 'Work Days:'}</strong> {' '}
                  {workWeekType.workDays.length} {language === 'he' ? 'ימים' : 'days'} 
                  ({language === 'he' ? workWeekType.shortNameHe : workWeekType.shortName})
                </div>
                <div>
                  <strong>{language === 'he' ? 'ימי מנוחה:' : 'Weekend Days:'}</strong> {' '}
                  {workWeekType.weekendDays.length} {language === 'he' ? 'ימים' : 'days'}
                </div>
                <div>
                  <strong>{language === 'he' ? 'תוספת סוף השבוע:' : 'Weekend Premium:'}</strong> +25%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">
                {language === 'he' ? 'הערה חשובה' : 'Important Note'}
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                {language === 'he'
                  ? 'שינוי סוג שבוע העבודה ישפיע על כל לוחות הזמנים החדשים. לוחות זמנים קיימים יישארו ללא שינוי.'
                  : 'Changing the work week type will affect all new schedules. Existing schedules will remain unchanged.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <div className={`form-grid ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="form-field">
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {language === 'he' ? 'שם החברה' : 'Company Name'}
            </label>
            <input
              type="text"
              defaultValue={currentCompany?.name || 'Your Company'}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="form-field">
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {language === 'he' ? 'תחום' : 'Industry'}
            </label>
            <select className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
              <option value={currentCompany?.industry || 'retail'}>
                {currentCompany?.industry ? 
                  (currentCompany.industry.charAt(0).toUpperCase() + currentCompany.industry.slice(1)) : 
                  (language === 'he' ? 'קמעונאות' : 'Retail')
                }
              </option>
              <option>{language === 'he' ? 'אירוח' : 'Hospitality'}</option>
              <option>{language === 'he' ? 'בריאות' : 'Healthcare'}</option>
              <option>{language === 'he' ? 'ייצור' : 'Manufacturing'}</option>
              <option>{language === 'he' ? 'אחר' : 'Other'}</option>
            </select>
          </div>
        </div>
        
        <div className={`mt-8 pt-6 border-t border-gray-200 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="text-sm text-gray-500">
            {language === 'he' ? 'עודכן לאחרונה: לפני שעתיים' : 'Last updated: 2 hours ago'}
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
            <Save className="w-4 h-4 inline mr-2" />
            {language === 'he' ? 'שמור שינויים' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>
            {language === 'he' ? 'הגדרות שבוע העבודה עודכנו בהצלחה!' : 'Work week settings updated successfully!'}
          </span>
        </div>
      )}
    </div>
  );
}