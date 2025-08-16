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
  ArrowRight,
  Briefcase,
  Crown,
  Sparkles,
  Shield,
  Loader
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface OnboardingFormData {
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

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [formData, setFormData] = useState<OnboardingFormData>({
    companyName: '',
    industry: '',
    employeeCount: '',
    country: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    adminPassword: '',
    plan: 'basic',
    features: ['presence'],
    activationType: 'trial'
  });
  
  const { t, language, setLanguage } = useLanguage();
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
  
  const validateStep = (step: number): boolean => {
    setError('');
    
    switch (step) {
      case 1: // Company info
        if (!formData.companyName.trim()) {
          setError('Company name is required');
          return false;
        }
        if (!formData.industry) {
          setError('Please select an industry');
          return false;
        }
        if (!formData.employeeCount) {
          setError('Please select employee count');
          return false;
        }
        break;
      case 2: // Admin details
        if (!formData.adminName.trim()) {
          setError('Administrator name is required');
          return false;
        }
        if (!formData.adminEmail.trim()) {
          setError('Administrator email is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!adminPassword.trim()) {
          setError('Administrator password is required');
          return false;
        }
        if (adminPassword.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        break;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.adminEmail, adminPassword);
      const firebaseUser = userCredential.user;
      
      // Create company document
      const companyData = {
        name: formData.companyName,
        industry: formData.industry,
        employeeCount: formData.employeeCount,
        country: formData.country,
        mainContactName: formData.adminName,
        mainContactEmail: formData.adminEmail,
        phone: formData.phone,
        plan: formData.plan,
        features: formData.features,
        activationType: formData.activationType,
        isActive: true,
        createdAt: new Date(),
        trialEndDate: formData.activationType === 'trial' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      };
      
      const companyRef = await addDoc(collection(db, 'companies'), companyData);
      const companyId = companyRef.id;
      
      // Create admin user document
      const userData = {
        id: firebaseUser.uid,
        name: formData.adminName,
        email: formData.adminEmail,
        role: 'admin',
        department: 'Management',
        permissions: ['view_all', 'manage_employees', 'manage_schedules', 'view_reports', 'manage_departments'],
        companyId: companyId,
        avatar: null,
        createdAt: new Date(),
        isActive: true,
        requirePasswordChange: false
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Create default departments for the company
      const defaultDepartments = [
        { name: 'Management', description: 'Company management and administration' },
        { name: 'Sales', description: 'Sales and customer relations' },
        { name: 'Operations', description: 'Daily operations and logistics' },
        { name: 'Customer Service', description: 'Customer support and service' }
      ];
      
      for (const dept of defaultDepartments) {
        await addDoc(collection(db, 'departments'), {
          ...dept,
          companyId: companyId,
          createdAt: new Date(),
          isActive: true
        });
      }
      
      // Create initial presence settings for the company
      await setDoc(doc(db, 'presenceSettings', companyId), {
        enabled: formData.features.includes('presence'),
        reminderTime: '09:00',
        remindClockOut: true,
        allowGeoLocation: false,
        defaultMethod: 'manual',
        companyId: companyId
      });
      
      // Create initial break settings for the company
      await setDoc(doc(db, 'breakSettings', companyId), {
        enabled: formData.features.includes('breaks'),
        breaksPerShift: 2,
        defaultDuration: 20,
        autoAssign: false,
        maxConcurrentBreaks: 3,
        companyId: companyId
      });
      
      console.log('Company and admin user created successfully:', {
        companyId,
        userId: firebaseUser.uid,
        email: formData.adminEmail
      });
      
      // Navigate to dashboard
      navigate('/');
      
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-white/50 transition-colors"
          >
            {language === 'en' ? 'עברית' : 'English'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200">
            <div 
              className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Header */}
          <div className="text-center p-8 border-b border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h1>
            <p className="text-gray-600">{steps[currentStep].subtitle}</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">{t('onboarding.welcome_description')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('onboarding.smart_scheduling')}</h3>
                      <p className="text-sm text-gray-600">{t('onboarding.ai_powered')}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('onboarding.team_management')}</h3>
                      <p className="text-sm text-gray-600">{t('onboarding.employee_oversight')}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('onboarding.multi_department')}</h3>
                      <p className="text-sm text-gray-600">{t('onboarding.organize_teams')}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={nextStep}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  {t('onboarding.get_started')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
            
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('onboarding.company_name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('onboarding.company_name_placeholder')}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('onboarding.industry')} *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">{t('onboarding.select_industry')}</option>
                      {industries.map(industry => (
                        <option key={industry.value} value={industry.value}>{industry.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('onboarding.employee_count')} *
                    </label>
                    <select
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">{t('onboarding.select_range')}</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('onboarding.select_country')}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">{t('onboarding.select_country')}</option>
                        {countries.map(country => (
                          <option key={country.value} value={country.value}>{country.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Admin Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('onboarding.admin_name')} *
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
                      {t('onboarding.admin_email')} *
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
                      {t('onboarding.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('onboarding.phone_placeholder')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a secure password"
                    required
                    minLength={6}
                  />
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
              </div>
            )}
            
            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
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
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('onboarding.activation_type')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.activationType === 'trial'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, activationType: 'trial'})}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">{t('onboarding.free_trial')}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{t('onboarding.trial_description')}</p>
                    </div>
                    
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.activationType === 'paid'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, activationType: 'paid'})}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="w-6 h-6 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">{t('onboarding.paid')}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{t('onboarding.paid_description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to ShiftGY, {formData.companyName}!
                  </h2>
                  <p className="text-gray-600">
                    Your account has been created successfully. You can now start managing your workforce.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <p className="font-medium">{formData.companyName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Industry:</span>
                      <p className="font-medium">{formData.industry}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Admin:</span>
                      <p className="font-medium">{formData.adminName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plan:</span>
                      <p className="font-medium">{formData.plan.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  {t('onboarding.access_dashboard')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentStep > 0 && currentStep < 4 && (
            <div className="flex justify-between items-center p-8 border-t border-gray-100 bg-gray-50">
              <button
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              
              {currentStep === 3 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      {t('onboarding.create_account')}...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('onboarding.create_account')}
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}