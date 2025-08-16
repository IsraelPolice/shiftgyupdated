import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useAI } from '../../contexts/AIContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PredictiveAnalyticsPanel() {
  const { 
    showAIPanel, 
    setShowAIPanel, 
    conflictPredictions, 
    teamCompatibility, 
    satisfactionMetrics,
    aiInsights 
  } = useAI();
  const { language } = useLanguage();
  const isRTL = language === 'he';
  const navigate = useNavigate();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleActionClick = (action: string, conflictId: string) => {
    // Navigate based on the suggested action
    if (action.includes('move employees') || action.includes('העברת עובדים')) {
      navigate('/schedules?view=optimization');
    } else if (action.includes('overtime') || action.includes('שעות נוספות')) {
      navigate('/schedules?filter=overtime');
    } else if (action.includes('part-time') || action.includes('משרה חלקית')) {
      navigate('/employees?filter=part-time');
    } else if (action.includes('training') || action.includes('הכשרה')) {
      navigate('/employees?view=training');
    } else {
      navigate('/schedules');
    }
    setShowAIPanel(false);
  };

  if (!showAIPanel) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowAIPanel(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
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
                    {language === 'he' ? 'תובנות AI חכמות' : 'AI Smart Insights'}
                  </h2>
                  <p className="text-blue-100">
                    {language === 'he' 
                      ? 'ניתוח חכם של סידורי העבודה והצוות' 
                      : 'Intelligent analysis of schedules and team dynamics'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIPanel(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Conflict Predictions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'he' ? 'חיזוי קונפליקטים' : 'Conflict Predictions'}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {conflictPredictions.map((conflict) => (
                    <motion.div
                      key={conflict.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${getSeverityColor(conflict.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{conflict.description}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(conflict.confidence)}`}>
                          {Math.round(conflict.confidence * 100)}% {language === 'he' ? 'ביטחון' : 'confidence'}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-3">{conflict.timeframe}</p>
                      <div className="space-y-1">
                        {conflict.suggestedActions.map((action, index) => (
                          <button 
                            key={index} 
                            onClick={() => handleActionClick(action, conflict.id)}
                            className="flex items-center gap-2 text-sm hover:bg-white/20 rounded p-1 transition-colors cursor-pointer w-full text-left"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>{action}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Team Compatibility */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'he' ? 'תאימות צוות' : 'Team Compatibility'}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {teamCompatibility.map((pair, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      delay={index * 0.1}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Employee {pair.employeeA} & {pair.employeeB}</span>
                          {pair.recommendedPairing ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(pair.compatibilityScore * 100)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          {language === 'he' ? 'היסטוריית עבודה' : 'Working history'}: {pair.workingHistory} {language === 'he' ? 'משמרות' : 'shifts'}
                        </div>
                        <div>
                          {language === 'he' ? 'קונפליקטים' : 'Conflicts'}: {pair.conflictHistory}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Satisfaction Overview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'he' ? 'סקירת שביעות רצון' : 'Satisfaction Overview'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {Math.round(satisfactionMetrics.overall * 100)}%
                      </div>
                      <div className="text-sm text-green-700">
                        {language === 'he' ? 'שביעות רצון כללית' : 'Overall Satisfaction'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {Object.keys(satisfactionMetrics.byDepartment).length}
                      </div>
                      <div className="text-sm text-blue-700">
                        {language === 'he' ? 'מחלקות מנוטרות' : 'Departments Monitored'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {satisfactionMetrics.trends.length > 1 ? '+' : ''}
                        {satisfactionMetrics.trends.length > 1 
                          ? Math.round((satisfactionMetrics.trends[satisfactionMetrics.trends.length - 1].score - satisfactionMetrics.trends[0].score) * 100)
                          : 0
                        }%
                      </div>
                      <div className="text-sm text-purple-700">
                        {language === 'he' ? 'מגמה שבועית' : 'Weekly Trend'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'he' ? 'תובנות AI' : 'AI Insights'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          insight.type === 'optimization' ? 'bg-blue-100 text-blue-600' :
                          insight.type === 'warning' ? 'bg-red-100 text-red-600' :
                          insight.type === 'prediction' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {insight.type === 'optimization' && <Target className="w-4 h-4" />}
                          {insight.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                          {insight.type === 'prediction' && <TrendingUp className="w-4 h-4" />}
                          {insight.type === 'suggestion' && <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(insight.confidence)}`}>
                              {Math.round(insight.confidence * 100)}% {language === 'he' ? 'ביטחון' : 'confidence'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                              insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {insight.impact} {language === 'he' ? 'השפעה' : 'impact'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}