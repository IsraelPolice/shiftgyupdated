import React, { useState } from 'react';
import { X, Mail, Phone, Send, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function InviteEmployeeModal({ isOpen, onClose, employee }: InviteEmployeeModalProps) {
  const [inviteMethod, setInviteMethod] = useState<'both' | 'email' | 'sms'>('both');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { t, language } = useLanguage();
  
  if (!isOpen) return null;
  
  const handleSendInvite = async () => {
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSending(false);
    setIsSent(true);
    
    // Close modal after showing success for a moment
    setTimeout(() => {
      onClose();
    }, 2000);
  };
  
  // Preview the invitation message
  const getEmailPreview = () => {
    const baseMessage = `
Welcome to ShiftGY!

Your user has been created.

Login: ${employee.email}
Set your password here: [link]

Download the app:
Android: [link]
iOS: [link]

${customMessage}
    `;
    
    const hebrewMessage = `
ברוך הבא ל-ShiftGY!

נוצר עבורך משתמש חדש.

שם משתמש: ${employee.email}
ליצירת סיסמה: [לינק]

להורדת האפליקציה:
אנדרואיד: [לינק]
אייפון: [לינק]

${customMessage}
    `;
    
    return (
      <div className="whitespace-pre-line text-sm text-gray-600 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
        {language === 'he' ? hebrewMessage : baseMessage}
      </div>
    );
  };
  
  const getSMSPreview = () => {
    const baseMessage = `Welcome to ShiftGY! Your account is ready. Set your password: [link] Download the app: [link]`;
    const hebrewMessage = `ברוך הבא ל-ShiftGY! המשתמש שלך מוכן. ליצירת סיסמה: [לינק] להורדת האפליקציה: [לינק]`;
    
    return (
      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
        {language === 'he' ? hebrewMessage : baseMessage}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isSent ? 'Invitation Sent!' : 'Send Login Information'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invitation Sent Successfully</h3>
            <p className="text-gray-600">
              {employee.name} will receive login instructions shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 mb-4">
                Would you like to send login information to <span className="font-medium">{employee.name}</span>?
              </p>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{employee.email}</p>
                  <p className="text-sm text-blue-700">Email</p>
                </div>
              </div>
              
              {employee.phone && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{employee.phone}</p>
                    <p className="text-sm text-green-700">SMS</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send invitation via:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inviteMethod"
                    value="both"
                    checked={inviteMethod === 'both'}
                    onChange={() => setInviteMethod('both')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Both Email & SMS {!employee.phone && '(SMS not available)'}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inviteMethod"
                    value="email"
                    checked={inviteMethod === 'email'}
                    onChange={() => setInviteMethod('email')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Email Only</span>
                </label>
                {employee.phone && (
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="inviteMethod"
                      value="sms"
                      checked={inviteMethod === 'sms'}
                      onChange={() => setInviteMethod('sms')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">SMS Only</span>
                  </label>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a custom message (optional):
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a personal welcome message..."
              />
            </div>
            
            {/* Message Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              {(inviteMethod === 'both' || inviteMethod === 'email') && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Email:</p>
                  {getEmailPreview()}
                </div>
              )}
              {(inviteMethod === 'both' || inviteMethod === 'sms') && employee.phone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">SMS:</p>
                  {getSMSPreview()}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={isSending || (!employee.phone && inviteMethod === 'sms')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
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