import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Smartphone, 
  AlertTriangle,
  Mail,
  Info
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [ssoProvider, setSsoProvider] = useState('');
  const [ssoConfig, setSSoConfig] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    domain: ''
  });
  const [ssoOnlyLogin, setSsoOnlyLogin] = useState(false);
  const [showSsoOnlyConfirmation, setShowSsoOnlyConfirmation] = useState(false);
  const [excludedAdmins, setExcludedAdmins] = useState<string[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Mock admin users for the company
  const adminUsers = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'admin' },
    { id: '2', name: 'Michael Chen', email: 'michael.chen@company.com', role: 'admin' },
    { id: '3', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'sub_admin' }
  ];
  
  const handleSSOToggle = () => {
    if (!ssoEnabled) {
      setSsoEnabled(true);
      setSuccessMessage('SSO integration enabled successfully');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      if (confirm('Are you sure you want to disable SSO? This will affect all users.')) {
        setSsoEnabled(false);
        setSsoProvider('');
        setSsoOnlyLogin(false);
        setSuccessMessage('SSO integration disabled successfully');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    }
  };
  
  const handleSSOProviderChange = (provider: string) => {
    setSsoProvider(provider);
    
    // Set default redirect URI based on provider
    const baseUrl = window.location.origin;
    let redirectUri = '';
    
    switch (provider) {
      case 'google':
        redirectUri = `${baseUrl}/auth/google/callback`;
        break;
      case 'microsoft':
        redirectUri = `${baseUrl}/auth/microsoft/callback`;
        break;
      case 'okta':
        redirectUri = `${baseUrl}/auth/okta/callback`;
        break;
      default:
        redirectUri = `${baseUrl}/auth/callback`;
    }
    
    setSSoConfig(prev => ({
      ...prev,
      redirectUri
    }));
  };
  
  const handleSsoOnlyToggle = () => {
    if (!ssoOnlyLogin) {
      setShowSsoOnlyConfirmation(true);
    } else {
      setSsoOnlyLogin(false);
    }
  };
  
  const confirmSsoOnly = () => {
    setSsoOnlyLogin(true);
    setSuccessMessage('SSO-only login enabled successfully');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setShowSsoOnlyConfirmation(false);
  };
  
  const cancelSsoOnly = () => {
    setShowSsoOnlyConfirmation(false);
  };
  
  const toggleAdminExclusion = (adminId: string) => {
    setExcludedAdmins(prev => 
      prev.includes(adminId)
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };
  
  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorSetup(true);
      setSuccessMessage('Two-factor authentication setup started');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setTwoFactorEnabled(true);
    } else {
      if (confirm('Are you sure you want to disable two-factor authentication?')) {
        setTwoFactorEnabled(false);
        setShowTwoFactorSetup(false);
        setSuccessMessage('Two-factor authentication disabled successfully');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    }
  };
  
  const handleSendInstructions = () => {
    alert('Instructions email sent to admin!');
    setSuccessMessage('Setup instructions sent successfully');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Password Section */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-blue-100">
            <Key className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="settings-card-title">{t('settings.change_password')}</h3>
            <p className="settings-card-description">Update your password regularly to maintain account security</p>
          </div>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.current_password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.new_password')}
            </label>
            <input
              placeholder="Create a strong, unique password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Password requirements:</p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>At least one uppercase letter</span>
                </li>
                <li className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>At least one number</span>
                </li>
                <li className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>At least one special character</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.confirm_password')}
            </label>
            <input
              placeholder="Re-enter your new password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="pt-2">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4 mr-2" />
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-green-100">
            <Smartphone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="settings-card-title">{t('settings.two_factor_auth')}</h3>
            <p className="settings-card-description">Add an extra verification step when signing in to protect your account</p>
          </div>
        </div>
        
        <div className="settings-toggle-item mt-4">
          <div className="settings-toggle-content">
            <div className="flex items-center">
              <p className="settings-toggle-label">{t('settings.enable_2fa')}</p>
              <div className="settings-tooltip">
                <Info className="settings-tooltip-icon" />
                <div className="settings-tooltip-content">
                  Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password
                </div>
              </div>
            </div>
            <p className="settings-toggle-description">{t('settings.extra_security')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {showTwoFactorSetup && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Set Up Two-Factor Authentication</h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-2 rounded-lg flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Sample_QR_code.svg/1200px-Sample_QR_code.svg.png" alt="QR Code" className="w-full h-full" />
                </div>
                <div>
                  <p className="text-sm text-blue-800">Scan this QR code with your authenticator app</p>
                  <p className="text-xs text-blue-600 mt-1">Google Authenticator, Authy, or similar apps</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Enter the 6-digit code from your app
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full max-w-xs px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000000"
                />
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Verify and Enable
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 overflow-hidden">
      {isAdmin && (
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon bg-purple-100">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="settings-card-title">Single Sign-On (SSO) Integration</h3>
              <p className="settings-card-description">Enable employees to sign in using your organization's identity provider</p>
            </div>
          </div>
          
          <div className="settings-toggle-item mt-4">
            <div className="settings-toggle-content">
              <div className="flex items-center">
                <p className="settings-toggle-label">Enable SSO</p>
                <div className="settings-tooltip">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Allow employees to sign in using their existing corporate credentials from Google, Microsoft, or Okta
                  </div>
                </div>
              </div>
              <p className="settings-toggle-description">Connect with Google Workspace, Microsoft Azure, or Okta</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ssoEnabled}
                onChange={handleSSOToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {ssoEnabled && (
            <>
              {/* SSO-only Login Toggle */}
              <div className="settings-toggle-item mt-4">
                <div className="settings-toggle-content">
                  <div className="flex items-center">
                    <p className="settings-toggle-label">{t('settings.require_sso_login_only')}</p>
                    <div className="settings-tooltip">
                      <Info className="settings-tooltip-icon" />
                      <div className="settings-tooltip-content">
                        {t('settings.require_sso_login_only_tooltip')}
                      </div>
                    </div>
                  </div>
                  <p className="settings-toggle-description">{t('settings.require_sso_login_only_description')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ssoOnlyLogin}
                    onChange={handleSsoOnlyToggle}
                    disabled={!ssoEnabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                </label>
              </div>
              
              {/* Admin Exclusion Panel */}
              {ssoOnlyLogin && (
                <div className="p-4 border border-gray-200 rounded-lg mb-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {t('settings.select_admins_excluded')}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('settings.admins_excluded_description')}
                  </p>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {adminUsers.map(admin => (
                      <label key={admin.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={excludedAdmins.includes(admin.id)}
                          onChange={() => toggleAdminExclusion(admin.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{admin.name}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {admin.role === 'admin' ? 'Admin' : 'Sub-Admin'}
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        {t('settings.super_admin_always_excluded')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* SSO Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  SSO Provider
                  <div className="settings-tooltip inline-block">
                    <Info className="settings-tooltip-icon" />
                    <div className="settings-tooltip-content">
                      Select which identity provider your organization uses for single sign-on
                    </div>
                  </div>
                </label>
                <select
                  value={ssoProvider}
                  onChange={(e) => handleSSOProviderChange(e.target.value)}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your identity provider</option>
                  <option value="google">Google Workspace</option>
                  <option value="microsoft">Microsoft Azure</option>
                  <option value="okta">Okta</option>
                </select>
              </div>
              
              {ssoProvider && (
                <div className="space-y-4 border border-gray-200 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-gray-900">Configuration for {ssoProvider.charAt(0).toUpperCase() + ssoProvider.slice(1)}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client ID
                      </label>
                      <input
                        type="text"
                        value={ssoConfig.clientId}
                        onChange={(e) => setSSoConfig({...ssoConfig, clientId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        value={ssoConfig.clientSecret}
                        onChange={(e) => setSSoConfig({...ssoConfig, clientSecret: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Redirect URI
                      </label>
                      <input
                        type="text"
                        value={ssoConfig.redirectUri}
                        onChange={(e) => setSSoConfig({...ssoConfig, redirectUri: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {ssoProvider === 'okta' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Okta Domain
                        </label>
                        <input
                          type="text"
                          value={ssoConfig.domain}
                          onChange={(e) => setSSoConfig({...ssoConfig, domain: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your-domain.okta.com"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSendInstructions}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Setup Instructions
                    </button>
                    
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Save className="w-4 h-4 mr-2" />
                      Save SSO Configuration
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Important SSO Information</h4>
                    <p className="text-sm text-yellow-800">
                      Enabling SSO will affect how all users in your organization sign in. Make sure to properly configure your identity provider before enabling this feature.
                    </p>
                    <p className="text-sm text-yellow-800 mt-2">
                      Need help? Check our <a href="/support" className="text-blue-600 hover:text-blue-700 underline">help article</a> on setting up SSO.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Session Security */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-red-100">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="settings-card-title">Session Security</h3>
            <p className="settings-card-description">Control how long users stay signed in and manage active sessions</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="settings-toggle-item">
            <div className="settings-toggle-content">
              <div className="flex items-center">
                <p className="settings-toggle-label">Automatic Logout</p>
                <div className="settings-tooltip">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Automatically sign users out after a period of inactivity to protect account security
                  </div>
                </div>
              </div>
              <p className="settings-toggle-description">Sign out users after a period of inactivity</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="never">Never</option>
              <option value="30">After 30 minutes</option>
              <option value="60">After 1 hour</option>
              <option value="120">After 2 hours</option>
              <option value="480">After 8 hours</option>
            </select>
          </div>
          
          <div className="settings-toggle-item">
            <div className="settings-toggle-content">
              <div className="flex items-center">
                <p className="settings-toggle-label">Require Password for Sensitive Operations</p>
                <div className="settings-tooltip">
                  <Info className="settings-tooltip-icon" />
                  <div className="settings-tooltip-content">
                    Adds an extra security layer by requiring password verification before making critical changes
                  </div>
                </div>
              </div>
              <p className="settings-toggle-description">Re-authenticate for sensitive actions like changing security settings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <button className="w-full text-left p-4 border border-red-200 rounded-lg text-red-700 hover:bg-red-50 transition-colors mt-4">
            Log Out of All Other Sessions
          </button>
        </div>
      </div>

      {/* SSO-only Confirmation Modal */}
      {showSsoOnlyConfirmation && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('settings.confirm_sso_only')}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t('settings.confirm_sso_only_description')}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelSsoOnly}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmSsoOnly}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="settings-toast">
          <CheckCircle className="settings-toast-icon w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  </div>
  );
}