import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Loader, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@shiftgy.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSSOOptions, setShowSSOOptions] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { login, loginWithGoogle, loginWithMicrosoft, loginWithSSO } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('login.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(t('login.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      await loginWithMicrosoft();
      navigate('/');
    } catch (err) {
      setError(t('login.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setLoading(true);
    try {
      await loginWithSSO(provider);
      navigate('/');
    } catch (err) {
      setError(t('login.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-white/50 transition-colors"
          >
            {language === 'en' ? 'עברית' : 'English'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">ShiftGY</h2>
            <p className="text-gray-600">{t('login.title')}</p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">{t('login.demo_credentials')}</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div>Super Admin: super@shiftgy.com / password</div>
              <div>Admin: admin@shiftgy.com / password</div>
              <div>Manager: manager@shiftgy.com / password</div>
              <div>Employee: employee@shiftgy.com / password</div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {showForgotPassword ? (
            <ForgotPasswordForm 
              onBack={() => setShowForgotPassword(false)}
              onSuccess={() => setShowForgotPassword(false)}
            />
          ) : (
            <>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.email')}
              </label>
              <div className="relative input-with-icon-wrapper">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 input-icon-left" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent email-input"
                  placeholder="admin@shiftgy.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.password')}
              </label>
              <div className="relative input-with-icon-wrapper">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 input-icon-left" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-900">
                  {t('login.remember_me')}
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                {t('login.forgot_password')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              {t('login.signin')}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleMicrosoftLogin}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M13 1h10v10H13z"/>
                  <path fill="#05a6f0" d="M1 13h10v10H1z"/>
                  <path fill="#ffba08" d="M13 13h10v10H13z"/>
                </svg>
                <span className="ml-2">Microsoft</span>
              </button>
            </div>
          </div>

          {/* SSO Login */}
          <div className="mt-4">
            <button
              onClick={() => setShowSSOOptions(!showSSOOptions)}
              className="w-full text-blue-600 hover:text-blue-700 font-medium text-center py-2"
            >
              {showSSOOptions ? 'Hide SSO Options' : 'Sign in with SSO'}
            </button>
            
            {showSSOOptions && (
              <div className="mt-3 space-y-3">
                <button
                  onClick={() => handleSSOLogin('google')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Google Workspace SSO
                </button>
                <button
                  onClick={() => handleSSOLogin('microsoft')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Microsoft Azure SSO
                </button>
                <button
                  onClick={() => handleSSOLogin('okta')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Okta SSO
                </button>
              </div>
            )}
          </div>

          {/* Join Now Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('login.no_account')} {t('login.create_account')} →
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}