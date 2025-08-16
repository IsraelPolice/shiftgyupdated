import React, { useState } from 'react';
import { MessageSquare, Plus, BarChart3, Users, Calendar, Eye, Lock, Settings, BookTemplate as Template, Clock, TrendingUp, FileText, Download, Edit, Copy, Archive, Play, Pause, ChevronRight, Star, CheckCircle, AlertCircle, Target, Zap, Filter, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useUpgrade } from '../contexts/UpgradeContext';
import { formatSurveyScore, formatDecimal } from '../utils/formatters';

// Types
interface Survey {
  id: string;
  title: string;
  description: string;
  category: 'job_satisfaction' | 'facilities' | 'management' | 'custom';
  status: 'draft' | 'active' | 'completed' | 'archived';
  questionCount: number;
  responseCount: number;
  targetCount: number;
  completionRate: number;
  averageScore?: number;
  createdDate: string;
  scheduledDate?: string;
  endDate?: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly';
  shiftIntegration?: {
    type: 'shift_start' | 'shift_end' | 'break_time' | 'specific_time';
    shiftTypes?: string[];
    time?: string;
  };
  targetAudience: {
    type: 'all' | 'departments' | 'roles' | 'individuals' | 'shifts';
    departments?: string[];
    roles?: string[];
    individuals?: string[];
    shifts?: string[];
  };
  responseTypes: string[];
  isPremium: boolean;
  tags: string[];
}

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questionCount: number;
  estimatedTime: string;
  icon: React.ReactNode;
  isPopular: boolean;
}

// Sample Data
const sampleSurveys: Survey[] = [
  {
    id: '1',
    title: 'Daily Shift Satisfaction',
    description: 'Quick daily check-in about shift workload and team dynamics',
    category: 'job_satisfaction',
    status: 'active',
    questionCount: 5,
    responseCount: 42,
    targetCount: 56,
    completionRate: 75,
    averageScore: 4.2,
    createdDate: '2024-01-15',
    scheduledDate: '2024-01-20',
    endDate: '2024-01-25',
    isAnonymous: true,
    isRecurring: true,
    recurrenceType: 'daily',
    shiftIntegration: {
      type: 'shift_end',
      shiftTypes: ['morning', 'afternoon']
    },
    targetAudience: {
      type: 'all'
    },
    responseTypes: ['rating', 'multiple_choice'],
    isPremium: false,
    tags: ['daily', 'satisfaction', 'workload']
  },
  {
    id: '2',
    title: 'Workplace Safety Assessment',
    description: 'Monthly safety protocols and equipment condition evaluation',
    category: 'facilities',
    status: 'active',
    questionCount: 12,
    responseCount: 28,
    targetCount: 56,
    completionRate: 50,
    averageScore: 4.7,
    createdDate: '2024-01-10',
    scheduledDate: '2024-01-15',
    endDate: '2024-01-30',
    isAnonymous: false,
    isRecurring: true,
    recurrenceType: 'monthly',
    shiftIntegration: {
      type: 'break_time'
    },
    targetAudience: {
      type: 'departments',
      departments: ['Operations', 'Maintenance']
    },
    responseTypes: ['yes_no', 'rating', 'text'],
    isPremium: false,
    tags: ['safety', 'equipment', 'monthly']
  },
  {
    id: '3',
    title: 'Management Communication Review',
    description: 'Quarterly feedback on management communication and leadership',
    category: 'management',
    status: 'draft',
    questionCount: 15,
    responseCount: 0,
    targetCount: 56,
    completionRate: 0,
    createdDate: '2024-01-18',
    isAnonymous: true,
    isRecurring: false,
    targetAudience: {
      type: 'all'
    },
    responseTypes: ['rating', 'text', 'multiple_choice'],
    isPremium: true,
    tags: ['management', 'communication', 'leadership']
  },
  {
    id: '4',
    title: 'Break Room Facilities Feedback',
    description: 'Weekly feedback on break room cleanliness and amenities',
    category: 'facilities',
    status: 'completed',
    questionCount: 8,
    responseCount: 52,
    targetCount: 56,
    completionRate: 93,
    averageScore: 3.8,
    createdDate: '2024-01-05',
    scheduledDate: '2024-01-08',
    endDate: '2024-01-15',
    isAnonymous: false,
    isRecurring: true,
    recurrenceType: 'weekly',
    shiftIntegration: {
      type: 'break_time'
    },
    targetAudience: {
      type: 'all'
    },
    responseTypes: ['yes_no', 'rating'],
    isPremium: false,
    tags: ['facilities', 'break room', 'weekly']
  }
];

const surveyTemplates: SurveyTemplate[] = [
  {
    id: 'shift_satisfaction',
    name: 'Shift Satisfaction Survey',
    description: 'Evaluate work hours, team dynamics, and workload balance',
    category: 'Job Satisfaction',
    questionCount: 8,
    estimatedTime: '3 min',
    icon: <Clock className="w-5 h-5" />,
    isPopular: true
  },
  {
    id: 'work_environment',
    name: 'Work Environment Assessment',
    description: 'Assess facilities, equipment, and safety conditions',
    category: 'Facilities',
    questionCount: 12,
    estimatedTime: '5 min',
    icon: <Settings className="w-5 h-5" />,
    isPopular: true
  },
  {
    id: 'cafeteria_feedback',
    name: 'Cafeteria & Facilities Feedback',
    description: 'Food quality, cleanliness, and amenity satisfaction',
    category: 'Facilities',
    questionCount: 6,
    estimatedTime: '2 min',
    icon: <Users className="w-5 h-5" />,
    isPopular: false
  },
  {
    id: 'management_communication',
    name: 'Management & Communication',
    description: 'Supervisor feedback and company communication effectiveness',
    category: 'Management',
    questionCount: 10,
    estimatedTime: '4 min',
    icon: <MessageSquare className="w-5 h-5" />,
    isPopular: true
  },
  {
    id: 'training_needs',
    name: 'Training & Development Needs',
    description: 'Identify skill gaps and learning preferences',
    category: 'Development',
    questionCount: 15,
    estimatedTime: '6 min',
    icon: <Target className="w-5 h-5" />,
    isPopular: false
  },
  {
    id: 'wellness_check',
    name: 'Employee Wellness Check',
    description: 'Stress levels, work-life balance, and wellbeing assessment',
    category: 'Wellness',
    questionCount: 12,
    estimatedTime: '5 min',
    icon: <CheckCircle className="w-5 h-5" />,
    isPopular: true
  }
];

export default function Surveys() {
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const [showSmartInsights, setShowSmartInsights] = useState(false);
  
  // State
  const [surveys, setSurveys] = useState<Survey[]>(sampleSurveys);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'analytics'>('cards');

  // Check feature access
  const canManageSurveys = hasPermission('manage_schedules') || hasPermission('view_all');


  // Filter surveys
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || survey.category === selectedCategory;
    const matchesStatus = !selectedStatus || survey.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate metrics
  const activeSurveys = surveys.filter(s => s.status === 'active').length;
  const totalResponses = surveys.reduce((sum, s) => sum + s.responseCount, 0);
  const avgCompletionRate = surveys.length > 0 
    ? surveys.reduce((sum, s) => sum + s.completionRate, 0) / surveys.length 
    : 0;
  const pendingReviews = surveys.filter(s => s.status === 'completed' && s.responseCount > 0).length;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'archived': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job_satisfaction': return 'bg-blue-100 text-blue-700';
      case 'facilities': return 'bg-green-100 text-green-700';
      case 'management': return 'bg-purple-100 text-purple-700';
      case 'custom': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className={`w-full ${language === 'he' ? 'text-right' : 'text-left'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
        <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span>Advanced Tools</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Surveys</span>
          </nav>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Surveys & Feedback</h1>
            <p className="text-gray-600">Create and manage employee surveys and feedback forms</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {filteredSurveys.length} of {surveys.length} surveys
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                <p className="text-3xl font-bold text-gray-900">{activeSurveys}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-green-600">{totalResponses}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600">{formatDecimal(avgCompletionRate)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">+5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-purple-600">{pendingReviews}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-purple-500 text-sm font-medium">Review needed</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {canManageSurveys && (
                <button 
                  onClick={() => setShowCreateWizard(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Survey
                </button>
              )}
              <button 
                onClick={() => setShowTemplates(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Template className="w-4 h-4 mr-2" />
                Survey Templates
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Survey
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'cards' ? 'analytics' : 'cards')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </button>
            </div>
            
            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Bulk Actions
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="job_satisfaction">Job Satisfaction</option>
              <option value="facilities">Facilities</option>
              <option value="management">Management</option>
              <option value="custom">Custom</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'cards' ? (
          /* Survey Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSurveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                {/* Survey Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                      {survey.isPremium && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Lock className="w-3 h-3 mr-1" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{survey.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(survey.status)}`}>
                      {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Survey Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{survey.questionCount} questions</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(survey.category)}`}>
                      {survey.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Response Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Responses</span>
                      <span>{survey.responseCount}/{survey.targetCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${survey.completionRate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {survey.completionRate}% completion rate
                    </div>
                  </div>

                  {/* Shift Integration */}
                  {survey.shiftIntegration && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {survey.shiftIntegration.type === 'shift_start' && 'Sent at shift start'}
                        {survey.shiftIntegration.type === 'shift_end' && 'Sent at shift end'}
                        {survey.shiftIntegration.type === 'break_time' && 'Sent during break'}
                        {survey.shiftIntegration.type === 'specific_time' && `Sent at ${survey.shiftIntegration.time}`}
                      </span>
                    </div>
                  )}

                  {/* Average Score */}
                  {survey.averageScore && survey.status === 'completed' && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">Average Score:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-lg font-bold text-green-900">
                          {formatSurveyScore(survey.averageScore)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {survey.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {survey.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {survey.isPremium && !canManageSurveys ? (
                    <div className="flex-1 text-center py-2">
                      <p className="text-sm text-gray-500 mb-2">Premium Feature</p>
                      <button className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        <Lock className="w-3 h-3 mr-1" />
                        Upgrade
                      </button>
                    </div>
                  ) : (
                    <>
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        View Results
                      </button>
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analytics
                      </button>
                      {canManageSurveys && (
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Analytics Dashboard View */
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Analytics Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Response Trends</p>
                      <p className="text-2xl font-bold text-blue-900">+23%</p>
                      <p className="text-xs text-blue-700">vs last month</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Avg Satisfaction</p>
                      <p className="text-2xl font-bold text-green-900">4.3/5</p>
                      <p className="text-xs text-green-700">across all surveys</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Quick Responses</p>
                      <p className="text-2xl font-bold text-purple-900">87%</p>
                      <p className="text-xs text-purple-700">under 2 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredSurveys.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No surveys found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || selectedStatus || selectedCategory
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first survey to start collecting employee feedback'
              }
            </p>
            {canManageSurveys && !searchTerm && !selectedStatus && !selectedCategory && (
              <button
                onClick={() => setShowCreateWizard(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Survey
              </button>
            )}
          </div>
        )}

        {/* Survey Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Survey Templates</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveyTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          {template.isPopular && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{template.questionCount} questions</span>
                      <span>{template.estimatedTime}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Use Template
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Survey Wizard Modal */}
        {showCreateWizard && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Survey</h2>
                <button
                  onClick={() => setShowCreateWizard(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Survey Creation Wizard</h3>
                  <p className="text-sm text-blue-800">
                    Follow the step-by-step wizard to create a comprehensive survey with shift integration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Daily Shift Satisfaction"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Category</option>
                      <option value="job_satisfaction">Job Satisfaction</option>
                      <option value="facilities">Facilities</option>
                      <option value="management">Management</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the purpose and scope of this survey"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateWizard(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Continue to Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}