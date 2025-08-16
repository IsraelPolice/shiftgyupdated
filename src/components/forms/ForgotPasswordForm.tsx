import React, { useState } from 'react';
import { ArrowLeft, Mail, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { t, language } = useLanguage();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('auth.email_required'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('auth.invalid_email'));
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Always show success message for security (don't reveal if email exists)
      setSuccess(true);
      
      // Auto-close after showing success message
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      setError(t('auth.reset_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">{t('auth.check_email')}</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t('auth.reset_email_sent', { email })}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {t('auth.reset_instructions')}
          </p>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('auth.back_to_login')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {t('auth.forgot_password_title')}
        </h2>
        <p className="text-gray-600">
          {t('auth.forgot_password_subtitle')}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.email_address')}
          </label>
          <div className="relative input-with-icon-wrapper">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 input-icon-left" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent email-input ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('auth.enter_email')}
              required
              autoFocus
              aria-describedby={error ? 'email-error' : undefined}
            />
          </div>
          {error && (
            <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {t('auth.send_reset_link')}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('auth.back_to_login')}
          </button>
        </div>
      </form>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">{t('auth.having_trouble')}</h4>
        <p className="text-sm text-gray-600 mb-3">
          {t('auth.contact_support_text')}
        </p>
        <a
          href="mailto:support@shiftgy.com"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          support@shiftgy.com
        </a>
      </div>
    </div>
  );
}