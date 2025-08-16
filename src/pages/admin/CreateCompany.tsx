import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  CheckCircle,
  ArrowLeft,
  Save,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CompanyFormData {
  companyName: string;
  industry: string;
  employeeCount: string;
  country: string;
  adminName: string;
  adminEmail: string;
  phone: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise' | 'custom';
  features: string[];
  activationType: 'trial' | 'paid';
}

export default function CreateCompany() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    industry: '',
    employeeCount: '',
    country: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    plan: 'basic',
    features: ['presence'],
    activationType: 'trial'
  });
  
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { formatCurrency, convertCurrency } = useCurrency();
  
  const industries = [
    { value: 'retail', label: 'Retail' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' }
  ];
  
  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'il', label: 'Israel' },
    { value: 'other', label: 'Other' }
  ];
  
  const plans = [
    { id: 'free', name: 'Free', price: '0', description: 'Basic scheduling for small teams' },
    { id: 'basic', name: 'Basic', price: '2', description: 'Essential tools for growing teams' },
    { id: 'pro', name: 'Pro', price: '4', description: 'Advanced features for optimized operations' },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', description: 'Tailored solutions for large organizations' }
  ];
  
  const features = [
    { id: 'presence', name: 'Presence Tracking', description: 'Clock in/out tracking and attendance management', price: '1.00', included: ['basic', 'pro', 'enterprise'] },
    { id: 'breaks', name: 'Break Management', description: 'Automated break scheduling and tracking', price: '1.25', included: ['pro', 'enterprise'] },
    { id: 'tasks', name: 'Task Management', description: 'Assign and track tasks across teams', price: '1.50', included: ['pro', 'enterprise'] },
    { id: 'surveys', name: 'Employee Surveys', description: 'Create and analyze employee feedback surveys', price: '1.00', included: ['pro', 'enterprise'] },
    { id: 'advanced_reports', name: 'Advanced Reporting', description: 'Custom reports and analytics dashboards', price: '2.50', included: ['enterprise'] }
  ];
  
  const handlePlanChange = (planId: 'free' | 'basic' | 'pro' | 'enterprise' | 'custom') => {
    // Update selected features based on plan
    const includedFeatures = features
      .filter(feature => feature.included.includes(planId))
      .map(feature => feature.id);
    
    setFormData({
      ...formData,
      plan: planId,
      features: includedFeatures
    });
  };
  
  const toggleFeature = (featureId: string) => {
    const newFeatures = formData.features.includes(featureId)
      ? formData.features.filter(id => id !== featureId)
      : [...formData.features, featureId];
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };
  
  const isFeatureIncluded = (featureId: string, planId: string) => {
    const feature = features.find(f => f.id === featureId);
    return feature?.included.includes(planId) || false;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the company
    navigate('/admin/companies');
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const steps = [
    {
      title: t('onboarding.welcome_title'),
      subtitle: t('onboarding.welcome_subtitle'),
    },
    {
      title: t('onboarding.company_info'),
      subtitle: t('onboarding.company_subtitle'),
    },
    {
      title: t('onboarding.admin_details'),
      subtitle: t('onboarding.admin_subtitle'),
    },
    {
      title: t('onboarding.plan_selection'),
      subtitle: t('onboarding.plan_subtitle'),
    },
    {
      title: t('onboarding.complete_title'),
      subtitle: t('onboarding.complete_subtitle'),
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Company</h1>
          <p className="text-gray-600 mt-1">Add a new company to the ShiftGY platform</p>
        </div>
        
        <button
          onClick={() => navigate('/admin/companies')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </button>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div 
            className={`flex-1 flex items-center gap-2 p-2 rounded-lg cursor-pointer ${currentStep === 0 ? 'bg-blue-50' : ''}`}
            onClick={() => setCurrentStep(0)}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className={`text-sm font-medium ${currentStep === 0 ? 'text-blue-700' : 'text-gray-600'}`}>Company Details</span>
          </div>
          
          <div className="w-8 h-1 bg-gray-200"></div>
          
          <div 
            className={`flex-1 flex items-center gap-2 p-2 rounded-lg cursor-pointer ${currentStep === 1 ? 'bg-blue-50' : ''}`}
            onClick={() => currentStep > 0 ? setCurrentStep(1) : null}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className={`text-sm font-medium ${currentStep === 1 ? 'text-blue-700' : 'text-gray-600'}`}>Admin Details</span>
          </div>
          
          <div className="w-8 h-1 bg-gray-200"></div>
          
          <div 
            className={`flex-1 flex items-center gap-2 p-2 rounded-lg cursor-pointer ${currentStep === 2 ? 'bg-blue-50' : ''}`}
            onClick={() => currentStep > 1 ? setCurrentStep(2) : null}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <span className={`text-sm font-medium ${currentStep === 2 ? 'text-blue-700' : 'text-gray-600'}`}>Subscription</span>
          </div>
          
          <div className="w-8 h-1 bg-gray-200"></div>
          
          <div 
            className={`flex-1 flex items-center gap-2 p-2 rounded-lg cursor-pointer ${currentStep === 3 ? 'bg-blue-50' : ''}`}
            onClick={() => currentStep > 2 ? setCurrentStep(3) : null}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              4
            </div>
            <span className={`text-sm font-medium ${currentStep === 3 ? 'text-blue-700' : 'text-gray-600'}`}>Review</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Step 1: Company Details */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>{industry.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Employees *
                  </label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Range</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.value} value={country.value}>{country.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.companyName || !formData.industry || !formData.employeeCount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Admin Details
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Admin Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Admin Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="admin@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">{t('onboarding.what_happens_next')}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('onboarding.account_created')}</li>
                <li>• {t('onboarding.login_credentials')}</li>
                <li>• {t('onboarding.trial_activated')}</li>
                <li>• {t('onboarding.setup_help')}</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back: Company Details
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.adminName || !formData.adminEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Subscription
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Subscription */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Subscription Plan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.plan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePlanChange(plan.id as any)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          {plan.price === 'Custom' ? plan.price : formatCurrency(convertCurrency(Number(plan.price), 'USD'))}
                        </span>
                        {plan.id !== 'free' && plan.id !== 'enterprise' && (
                          <span className="text-sm text-gray-500">/user/month</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                ))}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-3">Features</h3>
              <div className="space-y-3">
                {features.map(feature => {
                  const isIncluded = isFeatureIncluded(feature.id, formData.plan);
                  const isSelected = formData.features.includes(feature.id);
                  
                  return (
                    <div
                      key={feature.id}
                      className={`border rounded-lg p-4 ${
                        isIncluded
                          ? 'bg-blue-50 border-blue-200'
                          : isSelected
                            ? 'bg-green-50 border-green-200'
                            : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{feature.name}</h4>
                            {isIncluded ? (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {t('onboarding.included_in_plan')}
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-gray-900 mr-3">
                                +{formatCurrency(convertCurrency(Number(feature.price), 'USD'))}/user
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                        
                        <div className="ml-4 flex items-center">
                          {!isIncluded && (
                            <>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activation Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.activationType === 'trial'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, activationType: 'trial'})}
                >
                  <h4 className="font-semibold text-gray-900">{t('onboarding.trial')}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t('onboarding.trial_description')}</p>
                </div>
                
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.activationType === 'paid'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, activationType: 'paid'})}
                >
                  <h4 className="font-semibold text-gray-900">{t('onboarding.paid')}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t('onboarding.paid_description')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back: Admin Details
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Review Company Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Company Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company Name:</span>
                      <span className="font-medium text-gray-900">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium text-gray-900">{formData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employees:</span>
                      <span className="font-medium text-gray-900">{formData.employeeCount}</span>
                    </div>
                    {formData.country && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span className="font-medium text-gray-900">{formData.country}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Admin Contact</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{formData.adminName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{formData.adminEmail}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{formData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium text-gray-900">{formData.plan.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activation:</span>
                      <span className="font-medium text-gray-900">
                        {formData.activationType === 'trial' ? '30-Day Trial' : 'Immediate Paid'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Selected Features:</span>
                      <ul className="mt-1 space-y-1">
                        {formData.features.map(featureId => {
                          const feature = features.find(f => f.id === featureId);
                          return feature ? (
                            <li key={featureId} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{feature.name}</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Invitation Email</h4>
                  <p className="text-sm text-blue-800">
                    An invitation email will be sent to {formData.adminEmail} with instructions to set up their account.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back: Subscription
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Company
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}