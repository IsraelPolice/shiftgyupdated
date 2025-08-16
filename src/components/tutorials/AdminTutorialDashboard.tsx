import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3, 
  CreditCard,
  Shield,
  Star,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminTutorialDashboard() {
  const {
    availableTutorials,
    startTutorial,
    completedTutorials,
    getCompletionPercentage,
    certifications,
    getUnlockedFeatures
  } = useTutorial();
  
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: language === 'he' ? 'הכל' : 'All', icon: BookOpen },
    { id: 'setup', name: language === 'he' ? 'הגדרה' : 'Setup', icon: Settings },
    { id: 'management', name: language === 'he' ? 'ניהול' : 'Management', icon: Users },
    { id: 'analytics', name: language === 'he' ? 'אנליטיקה' : 'Analytics', icon: BarChart3 },
    { id: 'billing', name: language === 'he' ? 'חיוב' : 'Billing', icon: CreditCard },
    { id: 'advanced', name: language === 'he' ? 'מתקדם' : 'Advanced', icon: Shield }
  ];

  const filteredTutorials = availableTutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup': return Settings;
      case 'management': return Users;
      case 'analytics': return BarChart3;
      case 'billing': return CreditCard;
      case 'advanced': return Shield;
      default: return BookOpen;
    }
  };

  const completionPercentage = getCompletionPercentage();
  const unlockedFeatures = getUnlockedFeatures();

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'he' ? `ברוך הבא, ${user?.name}!` : `Welcome, ${user?.name}!`}
            </h1>
            <p className="text-indigo-100">
              {language === 'he' 
                ? 'מרכז הדרכה למנהלי מערכת - למד לנהל את ShiftGY ביעילות'
                : 'Admin Training Center - Master ShiftGY system administration'
              }
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{completionPercentage}%</div>
            <p className="text-indigo-200 text-sm">
              {language === 'he' ? 'הושלם' : 'Complete'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {language === 'he' ? 'הדרכות שהושלמו' : 'Completed Tutorials'}
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {completedTutorials.length}/{availableTutorials.length}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {language === 'he' ? 'הסמכות' : 'Certifications'}
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {certifications.filter(cert => 
                  cert.requiredTutorials.every(id => completedTutorials.includes(id))
                ).length}/{certifications.length}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'he' ? 'השג הסמכות לפתיחת תכונות מתקדמות' : 'Earn certifications to unlock advanced features'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {language === 'he' ? 'תכונות פתוחות' : 'Unlocked Features'}
              </h3>
              <p className="text-2xl font-bold text-blue-600">{unlockedFeatures.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {language === 'he' ? 'תכונות מתקדמות זמינות לשימוש' : 'Advanced features available for use'}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'he' ? 'חפש הדרכות...' : 'Search tutorials...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tutorial Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTutorials.map(tutorial => {
          const isCompleted = completedTutorials.includes(tutorial.id);
          const CategoryIcon = getCategoryIcon(tutorial.category);
          
          return (
            <div
              key={tutorial.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
                isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : 'bg-indigo-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <CategoryIcon className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600">{tutorial.description}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                  {tutorial.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.estimatedTime} {language === 'he' ? 'דקות' : 'min'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{tutorial.steps.length} {language === 'he' ? 'שלבים' : 'steps'}</span>
                </div>
              </div>

              {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>{language === 'he' ? 'דרישות קדם:' : 'Prerequisites:'}</strong>
                    {' '}
                    {tutorial.prerequisites.map(prereq => {
                      const prereqTutorial = availableTutorials.find(t => t.id === prereq);
                      return prereqTutorial?.title;
                    }).join(', ')}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="text-sm text-green-600 font-medium">
                      {language === 'he' ? '✓ הושלם' : '✓ Completed'}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => startTutorial(tutorial.id)}
                  disabled={isCompleted}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {language === 'he' ? 'הושלם' : 'Completed'}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {language === 'he' ? 'התחל' : 'Start'}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {language === 'he' ? 'הסמכות מנהל מערכת' : 'Admin Certifications'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map(cert => {
            const isEarned = cert.requiredTutorials.every(id => completedTutorials.includes(id));
            const completedCount = cert.requiredTutorials.filter(id => completedTutorials.includes(id)).length;
            
            return (
              <div
                key={cert.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isEarned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-4xl ${isEarned ? 'grayscale-0' : 'grayscale'}`}>
                    {cert.badgeIcon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{language === 'he' ? 'התקדמות' : 'Progress'}</span>
                    <span>{completedCount}/{cert.requiredTutorials.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isEarned ? 'bg-green-600' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${(completedCount / cert.requiredTutorials.length) * 100}%` }}
                    />
                  </div>
                </div>

                {isEarned && (
                  <div className="p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      {language === 'he' ? '🎉 הסמכה הושגה!' : '🎉 Certification Earned!'}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {language === 'he' 
                        ? `${cert.unlockedFeatures.length} תכונות מתקדמות נפתחו`
                        : `${cert.unlockedFeatures.length} advanced features unlocked`
                      }
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}