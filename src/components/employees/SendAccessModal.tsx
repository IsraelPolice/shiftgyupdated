import React, { useState } from 'react';
import { X, Mail, Send, User, Building2, Eye, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface SendAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
  };
}

export default function SendAccessModal({ isOpen, onClose, employee }: SendAccessModalProps) {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const { language, t } = useLanguage();
  const { user } = useAuth();
  
  // Generate temporary credentials (in real app, these would come from your auth system)
  const tempCredentials = {
    username: employee.email,
    password: 'TempPass123!',
    loginUrl: window.location.origin + '/login'
  };

  React.useEffect(() => {
    if (isOpen) {
      // Set default email content based on language
      const defaultSubject = language === 'he' 
        ? `פרטי גישה למערכת ShiftGY - ${employee.name}`
        : `ShiftGY Access Details - ${employee.name}`;
      
      const defaultBody = language === 'he' 
        ? `שלום ${employee.name},

נוצר עבורך חשבון במערכת ShiftGY לניהול משמרות.

פרטי הגישה שלך:
שם משתמש: ${tempCredentials.username}
סיסמה זמנית: ${tempCredentials.password}

קישור להתחברות: ${tempCredentials.loginUrl}

אנא התחבר ושנה את הסיסמה בהתחברות הראשונה.

בברכה,
צוות ShiftGY`
        : `Hello ${employee.name},

Your ShiftGY account has been created for shift management.

Your access details:
Username: ${tempCredentials.username}
Temporary Password: ${tempCredentials.password}

Login URL: ${tempCredentials.loginUrl}

Please log in and change your password on first login.

Best regards,
ShiftGY Team`;

      setEmailSubject(defaultSubject);
      setEmailBody(defaultBody);
      setIsSent(false);
    }
  }, [isOpen, employee, language]);

  const handleSend = async () => {
    setIsSending(true);
    
    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the action (in real app, save to database)
      console.log('Access details sent to:', employee.email);
      
      setIsSent(true);
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to send access details:', error);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const insertMergeField = (field: string) => {
    const mergeFields = {
      name: employee.name,
      username: tempCredentials.username,
      password: tempCredentials.password,
      company: 'ShiftGY Demo Company',
      loginUrl: tempCredentials.loginUrl
    };
    
    const value = mergeFields[field as keyof typeof mergeFields];
    setEmailBody(prev => prev + ` ${value}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' ? 'שלח פרטי גישה' : 'Send Access Details'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'he' ? `שלח פרטי התחברות ל${employee.name}` : `Send login details to ${employee.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSent ? (
          /* Success State */
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'he' ? 'פרטי הגישה נשלחו בהצלחה!' : 'Access Details Sent Successfully!'}
            </h3>
            <p className="text-gray-600">
              {language === 'he' 
                ? `פרטי הגישה נשלחו לכתובת ${employee.email}`
                : `Access details have been sent to ${employee.email}`}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Employee Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                  <p className="text-xs text-gray-400">{employee.department} • {employee.role}</p>
                </div>
              </div>
            </div>

            {/* Access Credentials Preview */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">
                {language === 'he' ? 'פרטי גישה שיישלחו:' : 'Access credentials to be sent:'}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {language === 'he' ? 'שם משתמש:' : 'Username:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded">{tempCredentials.username}</code>
                    <button
                      onClick={() => copyToClipboard(tempCredentials.username, 'username')}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      {copiedField === 'username' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {language === 'he' ? 'סיסמה זמנית:' : 'Temporary Password:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded">{tempCredentials.password}</code>
                    <button
                      onClick={() => copyToClipboard(tempCredentials.password, 'password')}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      {copiedField === 'password' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'he' ? 'נושא האימייל:' : 'Email Subject:'}
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'he' ? 'הזן נושא האימייל' : 'Enter email subject'}
              />
            </div>

            {/* Email Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'he' ? 'תוכן האימייל:' : 'Email Body:'}
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview 
                    ? (language === 'he' ? 'עריכה' : 'Edit')
                    : (language === 'he' ? 'תצוגה מקדימה' : 'Preview')
                  }
                </button>
              </div>
              
              {showPreview ? (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px] whitespace-pre-wrap">
                  {emailBody}
                </div>
              ) : (
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'he' ? 'הזן את תוכן האימייל' : 'Enter email content'}
                />
              )}
            </div>

            {/* Merge Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'he' ? 'הוסף שדות:' : 'Insert Fields:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'name', label: language === 'he' ? 'שם העובד' : 'Employee Name' },
                  { key: 'username', label: language === 'he' ? 'שם משתמש' : 'Username' },
                  { key: 'password', label: language === 'he' ? 'סיסמה' : 'Password' },
                  { key: 'company', label: language === 'he' ? 'שם החברה' : 'Company Name' },
                  { key: 'loginUrl', label: language === 'he' ? 'קישור התחברות' : 'Login URL' }
                ].map(field => (
                  <button
                    key={field.key}
                    onClick={() => insertMergeField(field.key)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !emailSubject.trim() || !emailBody.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {language === 'he' ? 'שולח...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'he' ? 'שלח פרטי גישה' : 'Send Access Details'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}