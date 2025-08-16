import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Brain, 
  AlertTriangle, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  Calendar,
  Building2,
  Target,
  ArrowRight,
  History,
  Zap,
  Info
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartInsight {
  id: string;
  title: {
    en: string;
    he: string;
  };
  context: {
    en: string;
    he: string;
  };
  action: {
    en: string;
    he: string;
  };
  link: string;
  urgency: 'critical' | 'warning' | 'info';
  category: 'staffing' | 'attendance' | 'performance' | 'compliance';
  timestamp: string;
  isRead: boolean;
  metrics?: {
    count: number;
    trend: 'up' | 'down' | 'stable';
    percentage?: number;
  };
}

interface SmartInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock insights data
const mockInsights: SmartInsight[] = [
  {
    id: '1',
    title: {
      en: '3 employees consistently late in Sales department',
      he: '3 עובדים מאחרים בקביעות במחלקת מכירות'
    },
    context: {
      en: '24 lateness incidents recorded this month - 15% increase from last month',
      he: 'נרשמו 24 מקרי איחור החודש - עלייה של 15% מהחודש הקודם'
    },
    action: {
      en: 'Schedule meeting with department manager',
      he: 'קבע פגישה עם מנהל המחלקה'
    },
    link: '/departments/sales/staff',
    urgency: 'warning',
    category: 'attendance',
    timestamp: '2024-01-22T10:30:00Z',
    isRead: false,
    metrics: {
      count: 24,
      trend: 'up',
      percentage: 15
    }
  },
  {
    id: '2',
    title: {
      en: 'Critical understaffing in 2 departments',
      he: 'מחסור קריטי בכוח אדם ב-2 מחלקות'
    },
    context: {
      en: '3rd time this month with unassigned shifts in Operations and Security',
      he: 'פעם שלישית החודש עם משמרות לא מאוישות בתפעול ואבטחה'
    },
    action: {
      en: 'Go to quick assignment panel',
      he: 'עבור לפאנל השיבוץ המהיר'
    },
    link: '/planner?filter=critical',
    urgency: 'critical',
    category: 'staffing',
    timestamp: '2024-01-22T09:15:00Z',
    isRead: false,
    metrics: {
      count: 3,
      trend: 'up'
    }
  },
  {
    id: '3',
    title: {
      en: 'Overtime costs increased 23% this quarter',
      he: 'עלויות שעות נוספות עלו ב-23% ברבעון זה'
    },
    context: {
      en: 'Pattern detected: Friday evening shifts consistently require overtime',
      he: 'זוהה דפוס: משמרות ערב יום שישי דורשות שעות נוספות באופן קבוע'
    },
    action: {
      en: 'Review Friday staffing levels',
      he: 'בדוק רמות איוש יום שישי'
    },
    link: '/schedules?day=friday&time=evening',
    urgency: 'warning',
    category: 'performance',
    timestamp: '2024-01-21T16:45:00Z',
    isRead: true,
    metrics: {
      count: 23,
      trend: 'up',
      percentage: 23
    }
  },
  {
    id: '4',
    title: {
      en: 'Employee satisfaction improved in Customer Service',
      he: 'שביעות רצון עובדים השתפרה בשירות לקוחות'
    },
    context: {
      en: 'New flexible scheduling resulted in 18% satisfaction increase',
      he: 'סידור עבודה גמיש חדש הביא לעלייה של 18% בשביעות הרצון'
    },
    action: {
      en: 'Consider expanding flexible scheduling',
      he: 'שקול הרחבת סידור עבודה גמיש'
    },
    link: '/departments/customer-service/settings',
    urgency: 'info',
    category: 'performance',
    timestamp: '2024-01-21T14:20:00Z',
    isRead: true,
    metrics: {
      count: 18,
      trend: 'up',
      percentage: 18
    }
  }
];

const SmartInsightsModal: React.FC<SmartInsightsModalProps> = ({ isOpen, onClose }) => {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [insights, setInsights] = useState<SmartInsight[]>(mockInsights);
  const [isLoading, setIsLoading] = useState(false);

  // Filter insights based on active tab
  const currentInsights = insights.filter(insight => !insight.isRead);
  const historyInsights = insights.filter(insight => insight.isRead);
  const displayInsights = activeTab === 'current' ? currentInsights : historyInsights;

  // Mark insight as read when clicked
  const handleInsightClick = (insightId: string, link: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, isRead: true } : insight
    ));
    
    // Navigate to the link and close modal
    navigate(link);
    onClose();
  };

  // Get urgency icon and color
  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      case 'warning':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200'
        };
      case 'info':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200'
        };
      default:
        return {
          icon: Info,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200'
        };
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'staffing': return Users;
      case 'attendance': return Clock;
      case 'performance': return TrendingUp;
      case 'compliance': return CheckCircle;
      default: return Target;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {language === 'he' ? 'תובנות חכמות' : 'Smart Insights'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {language === 'he' 
                      ? 'המלצות מבוססות AI לאופטימיזציה של הארגון'
                      : 'AI-powered recommendations for organizational optimization'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={language === 'he' ? 'סגור' : 'Close'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'current'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {language === 'he' ? 'תובנות נוכחיות' : 'Current Insights'}
                {currentInsights.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {currentInsights.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <History className="w-4 h-4 inline mr-2" />
                {language === 'he' ? 'היסטוריה' : 'History'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  {language === 'he' ? 'מנתח נתונים...' : 'Analyzing data...'}
                </span>
              </div>
            ) : displayInsights.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'current' 
                    ? (language === 'he' ? 'אין תובנות קריטיות' : 'No critical insights detected')
                    : (language === 'he' ? 'אין היסטוריה' : 'No history available')
                  }
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'current'
                    ? (language === 'he' 
                        ? 'נעדכן אותך כשיתגלו דפוסים חדשים'
                        : "We'll update you when patterns emerge"
                      )
                    : (language === 'he'
                        ? 'תובנות שנקראו יופיעו כאן'
                        : 'Read insights will appear here'
                      )
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayInsights.map((insight, index) => {
                  const urgencyConfig = getUrgencyConfig(insight.urgency);
                  const CategoryIcon = getCategoryIcon(insight.category);
                  const UrgencyIcon = urgencyConfig.icon;

                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${urgencyConfig.border} ${urgencyConfig.bg}`}
                      onClick={() => handleInsightClick(insight.id, insight.link)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon Section */}
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${urgencyConfig.bg} border ${urgencyConfig.border}`}>
                            <UrgencyIcon className={`w-6 h-6 ${urgencyConfig.color}`} />
                          </div>
                          <CategoryIcon className="w-4 h-4 text-gray-400" />
                        </div>

                        {/* Content Section */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                              {insight.title[language]}
                            </h4>
                            <div className="flex items-center gap-2 ml-4">
                              {insight.metrics && (
                                <div className="flex items-center gap-1">
                                  {insight.metrics.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4 text-red-500" />
                                  ) : insight.metrics.trend === 'down' ? (
                                    <TrendingDown className="w-4 h-4 text-green-500" />
                                  ) : null}
                                  {insight.metrics.percentage && (
                                    <span className={`text-sm font-medium ${
                                      insight.metrics.trend === 'up' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {insight.metrics.percentage}%
                                    </span>
                                  )}
                                </div>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(insight.timestamp)}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {insight.context[language]}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-600 font-medium">
                              <Zap className="w-4 h-4" />
                              <span>{insight.action[language]}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>

                          {/* Metrics Display */}
                          {insight.metrics && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                  {language === 'he' ? 'מקרים:' : 'Incidents:'} {insight.metrics.count}
                                </span>
                                {insight.metrics.percentage && (
                                  <span>
                                    {language === 'he' ? 'שינוי:' : 'Change:'} {insight.metrics.percentage}%
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Brain className="w-4 h-4" />
                <span>
                  {language === 'he' 
                    ? 'מופעל על ידי AI - מתעדכן כל 15 דקות'
                    : 'Powered by AI - Updates every 15 minutes'
                  }
                </span>
              </div>
              <button
                onClick={() => setIsLoading(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {language === 'he' ? 'רענן תובנות' : 'Refresh Insights'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SmartInsightsModal;