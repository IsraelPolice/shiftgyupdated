import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  Phone, 
  Search,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  Code,
  Grid,
  User
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { isEmployeeRole } from '../utils/roleUtils';
import ApiDocumentation from '../components/support/ApiDocumentation';
import ApiMarketplaceExplanation from '../components/support/ApiMarketplaceExplanation';
import { Link } from 'react-router-dom';

const faqItems = [
  {
    id: 1,
    question: 'How do I create a new shift schedule?',
    answer: 'To create a new shift schedule, go to the Schedules page and click "Add Shift". Fill in the employee details, time, and location information.',
    category: 'Scheduling'
  },
  {
    id: 2,
    question: 'Can employees request time off through the system?',
    answer: 'Yes, employees can submit time-off requests through their dashboard. Managers will receive notifications and can approve or deny requests.',
    category: 'Time Off'
  },
  {
    id: 3,
    question: 'How do I add new employees to the system?',
    answer: 'Navigate to the Employees page and click "Add Employee". Fill in their personal information, role, and department details.',
    category: 'Employee Management'
  },
  {
    id: 4,
    question: 'What reports are available in ShiftGY?',
    answer: 'ShiftGY offers various reports including attendance tracking, hours worked, labor costs, and department performance analytics.',
    category: 'Reports'
  },
  {
    id: 5,
    question: 'How do I set up shift templates?',
    answer: 'Go to the Templates page to create reusable shift patterns. Define roles, times, and staff requirements for quick scheduling.',
    category: 'Templates'
  }
];

// Add API Marketplace FAQ items
faqItems.push(
  { 
    id: 6, 
    question: 'What is the API Marketplace?', 
    answer: 'The API Marketplace provides access to ShiftGY\'s API integrations that allow you to connect with third-party services and extend functionality. You can integrate with calendar apps, communication tools, payroll systems, and more.', 
    category: 'API' 
  },
  { 
    id: 7, 
    question: 'How do I connect to the API?', 
    answer: 'To connect to our API, go to Settings > Marketplace to browse available integrations. For custom API access, you\'ll need to generate API keys in your account settings and refer to our API documentation.', 
    category: 'API' 
  },
  { 
    id: 8, 
    question: 'Are there any API usage limits?', 
    answer: 'Free and Basic plans include limited API access with rate limits. Premium plans offer higher rate limits and access to advanced API features. Check our pricing page for specific details on API quotas for your plan.', 
    category: 'API' 
  }
);

const helpCategories = [
  {
    id: 1,
    title: 'Getting Started',
    description: 'Learn the basics of ShiftGY',
    icon: Book,
    articles: 12
  },
  {
    id: 2,
    title: 'Scheduling',
    description: 'Create and manage shifts',
    icon: Clock,
    articles: 8
  },
  {
    id: 3,
    title: 'Employee Management',
    description: 'Add and manage your team',
    icon: CheckCircle,
    articles: 6
  },
  {
    id: 4,
    title: 'Reports & Analytics',
    description: 'Understanding your data',
    icon: HelpCircle,
    articles: 5
  }
  // Add API category to help categories
  ,{
    id: 5,
    title: 'API & Integrations',
    description: 'Connect with external systems',
    icon: Grid,
    articles: 8
  }
];

const supportChannels = [
  {
    id: 1,
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: MessageCircle,
    availability: 'Available 24/7',
    responseTime: 'Usually responds in minutes'
  },
  {
    id: 2,
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    availability: 'support@shiftgy.com',
    responseTime: 'Usually responds in 2-4 hours'
  },
  {
    id: 3,
    title: 'Phone Support',
    description: 'Speak directly with our team',
    icon: Phone,
    availability: '+1 (555) 123-SHIFT',
    responseTime: 'Mon-Fri, 9 AM - 6 PM EST'
  },
  {
    id: 4,
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    icon: Video,
    availability: 'Available anytime',
    responseTime: '50+ tutorial videos'
  }
];

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('help');
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isEmployee = isEmployeeRole(user);

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(faqItems.map(item => item.category))];

  return (
    <div className={`w-full ${language === 'he' ? 'text-right' : 'text-left'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('nav.support')}</h1>
        <p className="text-gray-600 mt-2">Get help and find answers to your questions</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('help')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'help'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Help & Support
              </div>
            </button>
            {!isEmployee && (
              <>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'api'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    API Documentation
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'marketplace'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    API Marketplace
                  </div>
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'help' ? (
            <div className="space-y-8">
              {/* Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative search-input-wrapper">
                  <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles, FAQs, and more..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* Support Channels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supportChannels
                  .filter(channel => !isEmployee || ['Live Chat', 'Email Support'].includes(channel.title))
                  .map((channel) => (
                  <div key={channel.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <channel.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{channel.title}</h3>
                        <p className="text-sm text-gray-500">{channel.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">{channel.availability}</p>
                      <p className="text-gray-500">{channel.responseTime}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Help Categories */}
              {!isEmployee && <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse Help Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {helpCategories.map((category) => (
                    <div key={category.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <category.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                      <p className="text-xs text-blue-600">{category.articles} articles</p>
                    </div>
                  ))}
                </div>
              </div>}

              {/* Quick Help Articles */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Help Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    to="/support/how-to-add-employee"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">How to Add an Employee</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Complete step-by-step guide for adding new employees to your ShiftGY system
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                      <span>Read Guide</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {faq.category}
                            </span>
                          </div>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                        <button className="ml-4 p-1 hover:bg-gray-200 rounded transition-colors">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">Try adjusting your search or browse our help categories</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'api' ? (
            <ApiDocumentation />
          ) : activeTab === 'marketplace' ? (
            <ApiMarketplaceExplanation />
          ) : null}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
        <p className="text-blue-100 mb-6">Our support team is here to help you succeed with ShiftGY</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Live Chat
          </button>
          <button className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
            <Mail className="w-5 h-5 mr-2" />
            Send Email
          </button>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}