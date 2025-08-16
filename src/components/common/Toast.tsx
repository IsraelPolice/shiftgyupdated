import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-green-500',
      icon: CheckCircle,
      text: 'text-white'
    },
    error: {
      bg: 'bg-red-500',
      icon: XCircle,
      text: 'text-white'
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: AlertTriangle,
      text: 'text-white'
    },
    info: {
      bg: 'bg-blue-500',
      icon: Info,
      text: 'text-white'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`
        ${config.bg} ${config.text} px-4 py-3 rounded-lg shadow-lg transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        max-w-sm
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;