import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Building2, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  Clock,
  DollarSign,
  Heart,
  Play,
  Star,
  Zap,
  TrendingUp,
  Smartphone,
  MessageSquare,
  BarChart3,
  CheckSquare,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Award,
  Rocket,
  Gift,
  Download,
  BookOpen,
  Headphones,
  Video,
  Coffee,
  X,
  Info,
  AlertTriangle,
  Crown,
  Calculator,
  TrendingDown,
  Briefcase,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingData {
  companyName: string;
  industry: string;
  employeeCount: string;
  country: string;
  adminName: string;
  adminEmail: string;
  phone: string;
  password: string;
  selectedFeatures: string[];
  selectedPlan: string;
  roiData: {
    weeklyHours: number;
    annualSavings: number;
    timeReduction: number;
    trialValue: number;
    monthlyCost: number;
    netMonthlySavings: number;
    roi: number;
  };
}

interface PlanRecommendation {
  recommendedPlan: string;
  reasoning: string[];
  industryBenefits: string[];
  alternatives: {
    plan: string;
    reason: string;
    suitable: boolean;
  }[];
  industryStats: {
    laborCostReduction: number;
    timeReduction: number;
    satisfactionImprovement: number;
  };
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [timeOnStep, setTimeOnStep] = useState(0);
  const [showHesitationBanner, setShowHesitationBanner] = useState(false);
  const [currentFeaturePreview, setCurrentFeaturePreview] = useState(0);
  const [showCompetitorComparison, setShowCompetitorComparison] = useState(false);
  const [showPlanMatcher, setShowPlanMatcher] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    industry: '',
    employeeCount: '',
    country: 'us',
    adminName: '',
    adminEmail: '',
    phone: '',
    password: '',
    selectedFeatures: [],
    selectedPlan: '',
    roiData: {
      weeklyHours: 0,
      annualSavings: 0,
      timeReduction: 80,
      trialValue: 0,
      monthlyCost: 0,
      netMonthlySavings: 0,
      roi: 0
    }
  });
  
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Currency conversion function
  const getLocalizedPrice = (priceUsd: number, lang: string = language): string => {
    if (lang === 'en') return `$${priceUsd}`;
    const raw = priceUsd * 3.6;
    const dec = raw % 1;
    let rounded: number;
    if (dec < 0.3) rounded = Math.floor(raw);
    else if (dec < 0.8) rounded = Math.floor(raw) + 0.5;
    else rounded = Math.ceil(raw);
    return `₪${rounded}`;
  };

  // Industry options with ROI multipliers
  const industries = [
    { value: 'retail', label: 'Retail & Commerce', multiplier: 1.2, hourlyRate: 25 },
    { value: 'restaurants', label: 'Restaurants & Food Service', multiplier: 1.8, hourlyRate: 30 },
    { value: 'healthcare', label: 'Healthcare & Medical', multiplier: 2.2, hourlyRate: 35 },
    { value: 'hospitality', label: 'Hospitality & Tourism', multiplier: 1.6, hourlyRate: 28 },
    { value: 'technology', label: 'Technology & Startups', multiplier: 1.0, hourlyRate: 40 },
    { value: 'manufacturing', label: 'Manufacturing & Production', multiplier: 1.4, hourlyRate: 32 },
    { value: 'education', label: 'Education & Training', multiplier: 1.1, hourlyRate: 26 },
    { value: 'security', label: 'Security & Safety', multiplier: 1.3, hourlyRate: 29 },
    { value: 'other', label: 'Other', multiplier: 1.0, hourlyRate: 27 }
  ];

  // Employee count options with base hours
  const employeeCounts = [
    { value: '1-10', label: '1-10 employees', baseHours: 3, midpoint: 5 },
    { value: '11-20', label: '11-20 employees', baseHours: 6, midpoint: 15 },
    { value: '21-40', label: '21-40 employees', baseHours: 12, midpoint: 30 },
    { value: '41-80', label: '41-80 employees', baseHours: 20, midpoint: 60 },
    { value: '80-100', label: '80-100 employees', baseHours: 25, midpoint: 90 },
    { value: '100+', label: 'Over 100 employees', baseHours: 35, midpoint: 150 }
  ];

  // Countries with flags
  const countries = [
    { value: 'us', label: '🇺🇸 United States', code: '+1' },
    { value: 'uk', label: '🇬🇧 United Kingdom', code: '+44' },
    { value: 'il', label: '🇮🇱 Israel', code: '+972' },
    { value: 'ca', label: '🇨🇦 Canada', code: '+1' },
    { value: 'au', label: '🇦🇺 Australia', code: '+61' },
    { value: 'de', label: '🇩🇪 Germany', code: '+49' },
    { value: 'fr', label: '🇫🇷 France', code: '+33' },
    { value: 'es', label: '🇪🇸 Spain', code: '+34' },
    { value: 'it', label: '🇮🇹 Italy', code: '+39' },
    { value: 'nl', label: '🇳🇱 Netherlands', code: '+31' },
    { value: 'other', label: 'Other', code: '+1' }
  ];

  // Plans configuration
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      subtitle: 'Perfect for micro-businesses',
      description: 'Start team scheduling for free — perfect for micro-teams and first-time managers. Up to 5 users at no cost. Essential features only. Upgrade anytime.',
      maxEmployees: 5,
      features: ['Basic scheduling', 'Employee profiles', 'Email support'],
      badge: null
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      subtitle: 'For small growing teams',
      description: 'Smart workforce management for growing teams. Full scheduling, break tracking, and role profiles for up to 20 users. Gain clarity and control.',
      maxEmployees: 20,
      features: ['Advanced scheduling', 'Time tracking', 'Mobile app', 'Basic reports', 'Chat support'],
      badge: null
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 59,
      subtitle: 'Most popular choice',
      description: 'Unlock powerful automation, advanced analytics, and seamless integrations — manage up to 100 users. Empowered control for ambitious businesses. Most popular!',
      maxEmployees: 100,
      features: ['All Basic features', 'Advanced analytics', 'API access', 'Priority support', 'Custom reports'],
      badge: 'Popular'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      subtitle: 'For large organizations',
      description: 'Enterprise-grade scheduling and reporting for multi-location organizations. Scalable, secure, fully supported up to 100 users (add more as needed). Custom solutions available.',
      maxEmployees: 100,
      features: ['All Professional features', 'Multi-location', 'Custom integrations', 'Dedicated support', 'Advanced security'],
      badge: null
    }
  ];

  // Add-ons configuration
  const addOns = [
    {
      id: 'tasks',
      name: 'Task Management Integration',
      price: 8,
      description: 'Boost team productivity by up to 35%. Assign tasks to shifts and track completion. E.g., Retail stores automate closing checklists and save 2+ hours weekly per manager.',
      benefits: ['Assign tasks to shifts', 'Track completion rates', 'Quality control checklists'],
      roiHighlight: 'Increase productivity by 35%',
      icon: <CheckSquare className="w-8 h-8" />
    },
    {
      id: 'surveys',
      name: 'Employee Surveys & Feedback',
      price: 5,
      description: 'Reduce turnover and increase retention. Collect real-time employee feedback and insights. E.g., Hospitality business dropped exit rate by 28% with weekly staff surveys.',
      benefits: ['Custom survey builder', 'Anonymous feedback', 'Satisfaction tracking', 'Exit interviews'],
      roiHighlight: 'Save $4,500 per retained employee',
      icon: <MessageSquare className="w-8 h-8" />
    }
  ];

  // Feature preview rotation
  const featurePreviews = [
    { 
      title: 'Smart Scheduling Dashboard', 
      description: 'AI-powered scheduling that learns your patterns and optimizes automatically',
      icon: <Calendar className="w-12 h-12 text-indigo-600" />
    },
    { 
      title: 'Employee Self-Service Portal', 
      description: 'Let employees manage their own schedules, request time off, and swap shifts',
      icon: <Users className="w-12 h-12 text-green-600" />
    },
    { 
      title: 'Real-time Attendance Tracking', 
      description: 'GPS-enabled clock in/out with instant alerts and compliance monitoring',
      icon: <MapPin className="w-12 h-12 text-orange-600" />
    },
    { 
      title: 'Advanced Analytics & Reports', 
      description: 'Deep insights into labor costs, efficiency metrics, and optimization opportunities',
      icon: <BarChart3 className="w-12 h-12 text-purple-600" />
    }
  ];

  // Calculate ROI based on form data
  const calculateROI = () => {
    const employeeData = employeeCounts.find(e => e.value === formData.employeeCount);
    const industryData = industries.find(i => i.value === formData.industry);
    
    if (!employeeData || !industryData) return;

    const baseHours = employeeData.baseHours;
    const multiplier = industryData.multiplier;
    const hourlyRate = industryData.hourlyRate;
    const weeklyHours = Math.round(baseHours * multiplier);
    const timeReduction = 80; // 80% time reduction
    const annualSavings = Math.round(weeklyHours * 52 * hourlyRate * (timeReduction / 100));
    
    // Calculate plan cost
    const selectedPlanData = plans.find(p => p.id === formData.selectedPlan);
    const planCost = selectedPlanData ? selectedPlanData.price : 0;
    const addOnCost = formData.selectedFeatures.reduce((sum, featureId) => {
      const addOn = addOns.find(a => a.id === featureId);
      return sum + (addOn ? addOn.price * employeeData.midpoint : 0);
    }, 0);
    
    const monthlyCost = planCost + addOnCost;
    const netMonthlySavings = Math.round(annualSavings / 12) - monthlyCost;
    const roi = monthlyCost > 0 ? Math.round((netMonthlySavings / monthlyCost) * 100) : 0;

    const trialValue = formData.selectedFeatures.reduce((sum, featureId) => {
      const addOn = addOns.find(a => a.id === featureId);
      return sum + (addOn ? addOn.price * employeeData.midpoint : 0);
    }, 0) + planCost;

    setFormData(prev => ({
      ...prev,
      roiData: {
        weeklyHours,
        annualSavings,
        timeReduction,
        trialValue,
        monthlyCost,
        netMonthlySavings,
        roi
      }
    }));
  };

  // Get intelligent plan recommendation
  const getIntelligentRecommendation = (): PlanRecommendation => {
    const employeeData = employeeCounts.find(e => e.value === formData.employeeCount);
    const industryData = industries.find(i => i.value === formData.industry);
    
    if (!employeeData || !industryData) {
      return {
        recommendedPlan: 'basic',
        reasoning: [],
        industryBenefits: [],
        alternatives: [],
        industryStats: { laborCostReduction: 0, timeReduction: 0, satisfactionImprovement: 0 }
      };
    }

    const employeeCount = employeeData.midpoint;
    let recommendedPlan = 'basic';
    let reasoning: string[] = [];
    let industryBenefits: string[] = [];
    let alternatives: { plan: string; reason: string; suitable: boolean }[] = [];

    // Recommendation logic based on employee count and industry
    if (employeeCount <= 5) {
      recommendedPlan = 'free';
      reasoning = [
        'Perfect size match: Free plan supports up to 5 employees',
        'Cost-effective: Start free and upgrade as you grow',
        'Essential features: All basic scheduling needs covered'
      ];
    } else if (employeeCount <= 20) {
      recommendedPlan = 'basic';
      reasoning = [
        `Perfect size match: Basic handles up to 20 employees (room to grow from your ${employeeCount})`,
        'Cost-effective: Core features without paying for unused advanced tools',
        'Growth ready: Easy upgrade path when you expand'
      ];
    } else if (employeeCount <= 100) {
      recommendedPlan = 'professional';
      reasoning = [
        `Perfect size match: Professional handles up to 100 employees (room to grow from your ${employeeCount})`,
        'Industry-specific: Advanced analytics crucial for labor cost control',
        'Growth ready: API access for future system integrations'
      ];
    } else {
      recommendedPlan = 'enterprise';
      reasoning = [
        'Large team support: Enterprise handles 100+ employees with custom pricing',
        'Multi-location ready: Perfect for complex organizational structures',
        'Dedicated support: Personal account management for large operations'
      ];
    }

    // Industry-specific benefits
    switch (formData.industry) {
      case 'restaurants':
        industryBenefits = [
          'Rush hour optimization algorithms',
          'Break scheduling for continuous service',
          'Integration readiness for POS systems',
          'Compliance tracking for labor laws'
        ];
        break;
      case 'healthcare':
        industryBenefits = [
          'Compliance tracking for healthcare regulations',
          '24/7 coverage optimization',
          'Certification and license tracking',
          'Emergency shift coverage protocols'
        ];
        break;
      case 'retail':
        industryBenefits = [
          'Peak hours staffing optimization',
          'Seasonal scheduling adjustments',
          'Multi-location coordination',
          'Sales performance correlation'
        ];
        break;
      case 'technology':
        industryBenefits = [
          'Flexible remote work scheduling',
          'Project-based team allocation',
          'Developer productivity tracking',
          'Agile sprint planning integration'
        ];
        break;
      default:
        industryBenefits = [
          'Industry-optimized scheduling algorithms',
          'Compliance and regulation tracking',
          'Performance analytics and insights',
          'Scalable team management'
        ];
    }

    // Alternative analysis
    plans.forEach(plan => {
      if (plan.id !== recommendedPlan) {
        let reason = '';
        let suitable = false;

        if (plan.id === 'free' && employeeCount > 5) {
          reason = `Only supports 5 employees - won't work for your team of ${employeeCount}`;
          suitable = false;
        } else if (plan.id === 'basic' && employeeCount > 20) {
          reason = `Limited to 20 employees - you'd outgrow it quickly with ${employeeCount} team members`;
          suitable = false;
        } else if (plan.id === 'professional' && employeeCount <= 10) {
          reason = 'Advanced features might be overkill for smaller teams - Basic offers better value';
          suitable = true;
        } else if (plan.id === 'enterprise' && employeeCount < 50) {
          reason = 'Enterprise features might be overkill - Professional offers better value';
          suitable = true;
        } else {
          reason = 'Alternative option with different feature set';
          suitable = true;
        }

        alternatives.push({ plan: plan.id, reason, suitable });
      }
    });

    const industryStats = {
      laborCostReduction: formData.industry === 'restaurants' ? 23 : formData.industry === 'healthcare' ? 18 : 20,
      timeReduction: 80,
      satisfactionImprovement: formData.industry === 'hospitality' ? 28 : 18
    };

    return {
      recommendedPlan,
      reasoning,
      industryBenefits,
      alternatives,
      industryStats
    };
  };

  // Hesitation detection
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnStep(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2 && timeOnStep > 45 && !showHesitationBanner) {
      setShowHesitationBanner(true);
    }
  }, [timeOnStep, currentStep, showHesitationBanner]);

  // Feature preview rotation
  useEffect(() => {
    if (currentStep === 3) {
      const interval = setInterval(() => {
        setCurrentFeaturePreview(prev => (prev + 1) % featurePreviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Calculate ROI when relevant fields change
  useEffect(() => {
    calculateROI();
  }, [formData.industry, formData.employeeCount, formData.selectedFeatures, formData.selectedPlan]);

  // Confetti animation for step 5
  useEffect(() => {
    if (currentStep === 5) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setTimeOnStep(0);
      setShowHesitationBanner(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeOnStep(0);
      setShowHesitationBanner(false);
    }
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(id => id !== featureId)
        : [...prev.selectedFeatures, featureId]
    }));
  };

  const selectPlan = (planId: string) => {
    setFormData(prev => ({ ...prev, selectedPlan: planId }));
  };

  const handleComplete = () => {
    // Save to database and redirect to dashboard
    navigate('/');
  };

  const steps = [
    { id: 1, label: 'Welcome', completed: currentStep > 1 },
    { id: 2, label: 'Company', completed: currentStep > 2 },
    { id: 3, label: 'Admin', completed: currentStep > 3 },
    { id: 4, label: 'Features', completed: currentStep > 4 },
    { id: 5, label: 'Launch', completed: currentStep > 5 }
  ];

  const recommendation = getIntelligentRecommendation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'עברית' : 'English'}
        </button>
      </div>

      {/* Hesitation Banner */}
      {showHesitationBanner && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 z-40 animate-slide-down">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6" />
              <span className="font-semibold">Need more time to decide? Start with a risk-free 30-day trial!</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Continue Trial
              </button>
              <button
                onClick={() => setShowHesitationBanner(false)}
                className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-6xl w-full">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step.completed
                          ? 'bg-green-500 text-white shadow-lg'
                          : currentStep === step.id
                          ? 'bg-indigo-600 text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={`text-sm font-medium mt-2 ${
                      currentStep === step.id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Step 1: Welcome & Value Proposition */}
            {currentStep === 1 && (
              <div className="p-12">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">ShiftGY</h1>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Transform Your Workforce Management
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Join 5,000+ businesses saving <span className="font-bold text-green-600">$2,847/month</span> on average
                  </p>
                </div>

                {/* Hero Illustration */}
                <div className="flex justify-center mb-12">
                  <div className="relative w-96 h-64 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="text-center z-10">
                      <Users className="w-24 h-24 text-indigo-600 mx-auto mb-4" />
                      <p className="text-indigo-700 font-medium">Happy teams using smart scheduling</p>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-orange-400 rounded-full animate-float opacity-70"></div>
                    <div className="absolute top-8 right-8 w-6 h-6 bg-green-400 rounded-full animate-float-delayed opacity-70"></div>
                    <div className="absolute bottom-6 left-8 w-10 h-10 bg-purple-400 rounded-full animate-float-slow opacity-70"></div>
                    <div className="absolute bottom-4 right-4 w-7 h-7 bg-pink-400 rounded-full animate-float opacity-70"></div>
                  </div>
                </div>

                {/* Value Proposition Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Save 80% Scheduling Time</h3>
                    <p className="text-gray-600">Cut hours to minutes daily</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Reduce Labor Costs 23%</h3>
                    <p className="text-gray-600">Eliminate overtime waste</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Boost Team Satisfaction</h3>
                    <p className="text-gray-600">Happy employees stay longer</p>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mb-8">
                  <button
                    onClick={nextStep}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  
                  <button className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-50 transition-all duration-300 ml-4">
                    <Play className="w-4 h-4 mr-2" />
                    Watch 2-Min Demo
                  </button>
                  
                  <div className="flex items-center justify-center gap-8 text-sm text-gray-600 mt-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>30-Day Free Trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>No Credit Card Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span>5-Star Rated</span>
                    </div>
                  </div>
                </div>

                {/* Competitive Edge */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 text-center border border-indigo-100">
                  <div className="flex items-center justify-center gap-2 text-indigo-700">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Unlike competitors, our AI reduces manual work by 80%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Information with ROI Preview */}
            {currentStep === 2 && (
              <div className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Your Business</h2>
                  <p className="text-xl text-gray-600">We'll calculate your potential savings</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                  {/* Form Fields */}
                  <div className="lg:col-span-3 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                      >
                        <option value="">Select your industry</option>
                        {industries.map(industry => (
                          <option key={industry.value} value={industry.value}>{industry.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Employees
                      </label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: e.target.value }))}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                      >
                        <option value="">Select employee count</option>
                        {employeeCounts.map(count => (
                          <option key={count.value} value={count.value}>{count.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country/Region
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                      >
                        {countries.map(country => (
                          <option key={country.value} value={country.value}>{country.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ROI Calculator */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 sticky top-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        Your Potential Savings
                      </h3>
                      
                      {formData.industry && formData.employeeCount ? (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                              {getLocalizedPrice(Math.round(formData.roiData.annualSavings / 12))}
                            </div>
                            <p className="text-gray-600">{language === 'en' ? 'Monthly savings' : 'חיסכון חודשי'}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white rounded-xl">
                              <div className="text-2xl font-bold text-indigo-600">{formData.roiData.weeklyHours}</div>
                              <p className="text-sm text-gray-600">{language === 'en' ? 'Hours saved/week' : 'שעות נחסכות/שבוע'}</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl">
                              <div className="text-2xl font-bold text-indigo-600">{formData.roiData.timeReduction}%</div>
                              <p className="text-sm text-gray-600">{language === 'en' ? 'Time reduction' : 'הפחתת זמן'}</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {language === 'en' ? 'Based on your business:' : 'בהתבסס על העסק שלך:'}
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {formData.roiData.weeklyHours} {language === 'en' ? 'hours currently spent on manual scheduling' : 'שעות המושקעות כיום בתכנון ידני'}
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {language === 'en' ? '80% automation with ShiftGY AI' : '80% אוטומציה עם AI של ShiftGY'}
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {getLocalizedPrice(Math.round(formData.roiData.annualSavings / 12))}{language === 'en' ? '/month in savings' : '/חודש בחיסכון'}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                            {language === 'en' ? 'Complete the form to see your savings' : 'השלם את הטופס לראות את החיסכון'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* What makes ShiftGY different */}
                <div className="mt-12">
                  <button
                    onClick={() => setShowCompetitorComparison(!showCompetitorComparison)}
                    className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  >
                    {language === 'en' ? 'What makes ShiftGY different?' : 'מה מייחד את ShiftGY?'}
                    <ArrowRight className={`w-4 h-4 transition-transform ${showCompetitorComparison ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {showCompetitorComparison && (
                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {language === 'en' ? '30% faster than competitors' : '30% מהיר יותר מהמתחרים'}
                        </h4>
                        <p className="text-sm text-blue-800">
                          {language === 'en' ? 'Setup in minutes, not hours' : 'הגדרה בדקות, לא שעות'}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <h4 className="font-semibold text-purple-900 mb-2">
                          {language === 'en' ? 'AI-powered optimization' : 'אופטימיזציה מבוססת AI'}
                        </h4>
                        <p className="text-sm text-purple-800">
                          {language === 'en' ? 'Smart algorithms learn your patterns' : 'אלגוריתמים חכמים לומדים את הדפוסים שלך'}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <h4 className="font-semibold text-green-900 mb-2">
                          {language === 'en' ? '99.9% uptime guarantee' : 'ערבות זמינות 99.9%'}
                        </h4>
                        <p className="text-sm text-green-800">
                          {language === 'en' ? 'Enterprise-grade reliability' : 'אמינות ברמה ארגונית'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {language === 'en' ? 'Back' : 'חזור'}
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!formData.companyName || !formData.industry || !formData.employeeCount}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {language === 'en' ? 'Continue' : 'המשך'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Admin Setup with Feature Preview */}
            {currentStep === 3 && (
              <div className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {language === 'en' ? 'Set Up Your Admin Account' : 'הגדר את חשבון המנהל שלך'}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {language === 'en' ? "You're just minutes away from smarter scheduling" : 'אתה במרחק דקות מתכנון חכם יותר'}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Admin Form */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'en' ? 'Administrator Name' : 'שם המנהל'} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.adminName}
                          onChange={(e) => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                          placeholder={language === 'en' ? 'Your full name' : 'השם המלא שלך'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'en' ? 'Email Address' : 'כתובת אימייל'} *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.adminEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                          placeholder={language === 'en' ? 'admin@company.com' : 'admin@company.com'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'en' ? 'Phone Number' : 'מספר טלפון'}
                      </label>
                      <div className="flex gap-3">
                        <select
                          value={countries.find(c => c.value === formData.country)?.code || '+1'}
                          className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        >
                          {countries.map(country => (
                            <option key={country.value} value={country.code}>
                              {country.code}
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                            placeholder={language === 'en' ? 'Your phone number' : 'מספר הטלפון שלך'}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'en' ? 'Password' : 'סיסמה'} *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                          placeholder={language === 'en' ? 'Create a secure password' : 'צור סיסמה מאובטחת'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full ${
                                  formData.password.length > i * 2 + 2
                                    ? formData.password.length > 8
                                      ? 'bg-green-500'
                                      : formData.password.length > 6
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.password.length < 6
                              ? language === 'en' ? 'Weak password' : 'סיסמה חלשה'
                              : formData.password.length < 8
                              ? language === 'en' ? 'Good password' : 'סיסמה טובה'
                              : language === 'en' ? 'Strong password' : 'סיסמה חזקה'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feature Preview */}
                  <div className="space-y-6">
                    {/* Progress Motivation */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-indigo-900">
                          {language === 'en' ? 'Setup Progress: 60% Complete' : 'התקדמות הגדרה: 60% הושלם'}
                        </h3>
                        <div className="text-indigo-600 font-bold">60%</div>
                      </div>
                      <div className="w-full bg-indigo-200 rounded-full h-3 mb-4">
                        <div className="bg-indigo-600 h-3 rounded-full w-3/5 transition-all duration-1000"></div>
                      </div>
                      <p className="text-indigo-700">
                        {language === 'en' ? 'Next: Unlock premium features that save even more time' : 'הבא: פתח תכונות פרימיום שחוסכות עוד יותר זמן'}
                      </p>
                    </div>

                    {/* Feature Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {language === 'en' ? 'Feature Preview' : 'תצוגה מקדימה של תכונות'}
                      </h3>
                      <div className="bg-white rounded-xl p-6 text-center min-h-[200px] flex flex-col items-center justify-center">
                        {featurePreviews[currentFeaturePreview].icon}
                        <h4 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                          {featurePreviews[currentFeaturePreview].title}
                        </h4>
                        <p className="text-gray-600">
                          {featurePreviews[currentFeaturePreview].description}
                        </p>
                      </div>
                      <div className="flex justify-center gap-2 mt-4">
                        {featurePreviews.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentFeaturePreview ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* What Happens Next */}
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">
                        {language === 'en' ? 'What Happens Next' : 'מה קורה הלאה'}
                      </h3>
                      <ul className="space-y-3">
                        {[
                          language === 'en' ? 'Instant account activation' : 'הפעלת חשבון מיידית',
                          language === 'en' ? 'Full feature access for 30 days' : 'גישה מלאה לתכונות למשך 30 יום',
                          language === 'en' ? 'Personal onboarding session' : 'סשן הכנסה אישי',
                          language === 'en' ? '24/7 support included' : 'תמיכה 24/7 כלולה'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {language === 'en' ? 'Back' : 'חזור'}
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!formData.adminName || !formData.adminEmail || !formData.password}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {language === 'en' ? 'Continue' : 'המשך'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Intelligent Features Selection */}
            {currentStep === 4 && (
              <div className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {language === 'en' ? 'Customize Your ShiftGY Experience' : 'התאם את חוויית ShiftGY שלך'}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {language === 'en' ? 'Get personalized recommendations based on your business needs' : 'קבל המלצות מותאמות אישית בהתבסס על צרכי העסק שלך'}
                  </p>
                </div>

                {/* Included Features Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {language === 'en' ? 'Included in All Plans' : 'כלול בכל התוכניות'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Time Tracking */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {language === 'en' ? 'Advanced Time Tracking' : 'מעקב זמן מתקדם'}
                            </h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              ✓ {language === 'en' ? 'INCLUDED' : 'כלול'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {language === 'en' 
                              ? 'Clock in/out with GPS, Break management, Overtime alerts'
                              : 'כניסה/יציאה עם GPS, ניהול הפסקות, התראות שעות נוספות'
                            }
                          </p>
                          <p className="text-blue-700 text-sm font-medium">
                            {language === 'en' 
                              ? 'Restaurant chain reduced time theft by 23% with GPS tracking'
                              : 'רשת מסעדות הפחיתה גניבת זמן ב-23% עם מעקב GPS'
                            }
                          </p>
                          <p className="text-green-600 text-sm font-bold mt-2">
                            {language === 'en' ? 'Save $1,200/month on payroll accuracy' : 'חסוך $1,200/חודש על דיוק שכר'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reports & Analytics */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {language === 'en' ? 'Smart Reports & Analytics' : 'דוחות וניתוחים חכמים'}
                            </h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              ✓ {language === 'en' ? 'INCLUDED' : 'כלול'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {language === 'en' 
                              ? 'Labor cost analysis, Attendance patterns, Performance metrics'
                              : 'ניתוח עלויות עבודה, דפוסי נוכחות, מדדי ביצועים'
                            }
                          </p>
                          <p className="text-purple-700 text-sm font-medium">
                            {language === 'en' 
                              ? 'Tech company identified $3,500 monthly savings through scheduling optimization'
                              : 'חברת טכנולוגיה זיהתה חיסכון של $3,500 חודשי דרך אופטימיזציה של תכנון'
                            }
                          </p>
                          <p className="text-green-600 text-sm font-bold mt-2">
                            {language === 'en' ? 'Spot inefficiencies worth 15% cost reduction' : 'זהה חוסר יעילות בשווי הפחתת עלויות של 15%'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile App */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {language === 'en' ? 'Employee Mobile App' : 'אפליקציה לעובדים'}
                            </h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              ✓ {language === 'en' ? 'INCLUDED' : 'כלול'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {language === 'en' 
                              ? 'Clock in/out anywhere, Shift swapping, Push notifications'
                              : 'כניסה/יציאה מכל מקום, החלפת משמרות, התראות דחיפה'
                            }
                          </p>
                          <p className="text-green-700 text-sm font-medium">
                            {language === 'en' 
                              ? 'Healthcare facility reduced no-shows by 40% with mobile reminders'
                              : 'מתקן בריאות הפחית אי-הגעות ב-40% עם תזכורות נייד'
                            }
                          </p>
                          <p className="text-green-600 text-sm font-bold mt-2">
                            {language === 'en' ? 'Reduce no-shows by 40%' : 'הפחת אי-הגעות ב-40%'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Break Management */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {language === 'en' ? 'Intelligent Break Scheduling' : 'תכנון הפסקות חכם'}
                            </h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              ✓ {language === 'en' ? 'INCLUDED' : 'כלול'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {language === 'en' 
                              ? 'Auto break assignments, Compliance tracking, Coverage optimization'
                              : 'הקצאת הפסקות אוטומטית, מעקב ציות, אופטימיזציה של כיסוי'
                            }
                          </p>
                          <p className="text-orange-700 text-sm font-medium">
                            {language === 'en' 
                              ? 'Manufacturing plant ensured 100% break compliance while maintaining productivity'
                              : 'מפעל ייצור הבטיח 100% ציות להפסקות תוך שמירה על פרודוקטיביות'
                            }
                          </p>
                          <p className="text-green-600 text-sm font-bold mt-2">
                            {language === 'en' ? 'Maintain productivity during breaks' : 'שמור על פרודוקטיביות במהלך הפסקות'}
                          </p>
                          <ul className="space-y-1 text-sm text-gray-600 mt-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Hybrid work support with remote task management</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>AI-powered shift preference matching</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Add-Ons Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    💎 {language === 'en' ? 'Premium Features (Add to Trial)' : 'תכונות פרימיום (הוסף לניסיון)'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {addOns.map(addOn => (
                      <div key={addOn.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            {addOn.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{addOn.name}</h4>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.selectedFeatures.includes(addOn.id)}
                                  onChange={() => toggleFeature(addOn.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>
                            <p className="text-purple-600 font-semibold text-sm mb-2">
                              + {getLocalizedPrice(addOn.price)}{language === 'en' ? '/month per user' : '/חודש לכל משתמש'}
                            </p>
                            <ul className="text-gray-600 text-sm mb-3 space-y-1">
                              {addOn.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                            <p className="text-gray-700 text-sm mb-2">{addOn.description}</p>
                            <p className="text-green-600 text-sm font-bold">{addOn.roiHighlight}</p>
                            <p className="text-purple-600 text-xs mt-2">
                              {language === 'en' ? '30-day trial included' : 'ניסיון 30 יום כלול'}
                            </p>
                            {addOn.id === 'surveys' && (
                              <ul className="space-y-1 text-sm text-gray-600 mt-2">
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>Smart preference matching with 85% conflict reduction</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>20% reduction in employee turnover</span>
                                </li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Help Me Choose Button */}
                <div className="text-center mb-8">
                  <button
                    onClick={() => setShowPlanMatcher(true)}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Help Me Choose the Perfect Plan' : 'עזור לי לבחור את התוכנית המושלמת'}
                  </button>
                </div>

                {/* Plan Selection Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {plans.map(plan => {
                    const isRecommended = plan.id === recommendation.recommendedPlan;
                    const employeeData = employeeCounts.find(e => e.value === formData.employeeCount);
                    const employeeCount = employeeData?.midpoint || 0;
                    const isSelected = formData.selectedPlan === plan.id;
                    
                    return (
                      <div
                        key={plan.id}
                        onClick={() => selectPlan(plan.id)}
                        className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                          isSelected
                            ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200'
                            : isRecommended
                            ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Badge */}
                        {plan.badge && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {plan.badge}
                          </div>
                        )}
                        {isRecommended && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            {language === 'en' ? 'RECOMMENDED' : 'מומלץ'}
                          </div>
                        )}

                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <div className="mb-4">
                            <span className="text-3xl font-bold text-gray-900">
                              {getLocalizedPrice(plan.price)}
                            </span>
                            <span className="text-gray-600">
                              {language === 'en' ? '/month' : '/חודש'}
                            </span>
                          </div>
                          {plan.price > 0 && (
                            <p className="text-sm text-gray-500 mb-4">
                              {language === 'en' ? '+$1.25 per additional employee' : '+₪5 לכל עובד נוסף'}
                            </p>
                          )}
                          <p className="text-gray-600 text-sm mb-4">{plan.subtitle}</p>
                          <p className="text-gray-700 text-sm mb-6 leading-relaxed">{plan.description}</p>
                          
                          {/* Features */}
                          <ul className="space-y-2 text-sm text-left">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Employee Limit */}
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">
                              {language === 'en' ? `Up to ${plan.maxEmployees} employees` : `עד ${plan.maxEmployees} עובדים`}
                            </p>
                          </div>

                          {/* Smart Indicators */}
                          {employeeCount > plan.maxEmployees && (
                            <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-xs text-red-700 flex items-center gap-1">
                                <X className="w-3 h-3" />
                                {language === 'en' ? `Too small for your ${employeeCount} employees` : `קטן מדי עבור ${employeeCount} העובדים שלך`}
                              </p>
                            </div>
                          )}
                          {isRecommended && (
                            <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-xs text-purple-700 flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                {language === 'en' ? 'RECOMMENDED FOR YOUR BUSINESS' : 'מומלץ לעסק שלך'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cost Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'en' ? 'Cost Summary' : 'סיכום עלויות'}
                  </h3>
                  {formData.selectedPlan ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {plans.find(p => p.id === formData.selectedPlan)?.name} {language === 'en' ? 'Plan' : 'תוכנית'}:
                        </span>
                        <span className="font-semibold">
                          {getLocalizedPrice(plans.find(p => p.id === formData.selectedPlan)?.price || 0)}
                          {language === 'en' ? '/month' : '/חודש'}
                        </span>
                      </div>
                      {formData.selectedFeatures.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {language === 'en' ? 'Add-ons' : 'תוספות'}:
                          </span>
                          <span className="font-semibold">
                            {getLocalizedPrice(formData.selectedFeatures.reduce((sum, featureId) => {
                              const addOn = addOns.find(a => a.id === featureId);
                              const employeeData = employeeCounts.find(e => e.value === formData.employeeCount);
                              return sum + (addOn ? addOn.price * (employeeData?.midpoint || 0) : 0);
                            }, 0))}
                            {language === 'en' ? '/month' : '/חודש'}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">
                            {language === 'en' ? 'Total' : 'סך הכל'}:
                          </span>
                          <span className="text-lg font-bold text-indigo-600">
                            {getLocalizedPrice(formData.roiData.monthlyCost)}
                            {language === 'en' ? '/month' : '/חודש'}
                          </span>
                        </div>
                        {formData.roiData.netMonthlySavings > 0 && (
                          <p className="text-green-600 font-semibold mt-2">
                            {language === 'en' ? 'Net monthly savings' : 'חיסכון חודשי נטו'}: {getLocalizedPrice(formData.roiData.netMonthlySavings)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {language === 'en' ? 'Select a plan to see pricing' : 'בחר תוכנית לראות תמחור'}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {language === 'en' ? 'Back' : 'חזור'}
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!formData.selectedPlan}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {language === 'en' ? 'Continue' : 'המשך'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Launch Confirmation */}
            {currentStep === 5 && (
              <div className="p-12">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {language === 'en' ? 'Welcome to ShiftGY!' : 'ברוכים הבאים ל-ShiftGY!'}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {language === 'en' ? "Your account is ready. Let's get you started." : 'החשבון שלך מוכן. בואו נתחיל.'}
                  </p>
                </div>

                {/* Account Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {language === 'en' ? 'Account Summary' : 'סיכום חשבון'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {language === 'en' ? 'Company Details' : 'פרטי החברה'}
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li><strong>{language === 'en' ? 'Company' : 'חברה'}:</strong> {formData.companyName}</li>
                        <li><strong>{language === 'en' ? 'Industry' : 'תחום'}:</strong> {industries.find(i => i.value === formData.industry)?.label}</li>
                        <li><strong>{language === 'en' ? 'Employees' : 'עובדים'}:</strong> {employeeCounts.find(e => e.value === formData.employeeCount)?.label}</li>
                        <li><strong>{language === 'en' ? 'Country' : 'מדינה'}:</strong> {countries.find(c => c.value === formData.country)?.label}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {language === 'en' ? 'Selected Plan & Features' : 'תוכנית ותכונות נבחרות'}
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <strong>{plans.find(p => p.id === formData.selectedPlan)?.name} {language === 'en' ? 'Plan' : 'תוכנית'}</strong>
                        </li>
                        {formData.selectedFeatures.map(featureId => {
                          const addOn = addOns.find(a => a.id === featureId);
                          return addOn ? (
                            <li key={featureId} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {addOn.name}
                            </li>
                          ) : null;
                        })}
                        <li className="pt-2 border-t border-green-200">
                          <strong>{language === 'en' ? 'Trial period' : 'תקופת ניסיון'}:</strong> {language === 'en' ? '30 days of full access' : '30 יום גישה מלאה'}
                        </li>
                        {formData.roiData.netMonthlySavings > 0 && (
                          <li className="text-green-600 font-bold">
                            {language === 'en' ? 'Projected monthly savings' : 'חיסכון חודשי צפוי'}: {getLocalizedPrice(formData.roiData.netMonthlySavings)}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Start Options */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {language === 'en' ? 'Quick Start Options' : 'אפשרויות התחלה מהירה'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Download className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? 'Import Your Current Schedule' : 'ייבא את הלוח הנוכחי שלך'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Upload CSV/Excel' : 'העלה CSV/Excel'}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? 'Add Your First Employees' : 'הוסף את העובדים הראשונים שלך'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Manual entry or bulk import' : 'הזנה ידנית או ייבוא בכמות'}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? 'Take the Guided Tour' : 'קח את הסיור המודרך'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Interactive tutorial' : 'מדריך אינטראקטיבי'}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Headphones className="w-8 h-8 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? 'Schedule Onboarding Call' : 'תזמן שיחת הכנסה'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Calendar integration' : 'אינטגרציה עם יומן'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Steps Timeline */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {language === 'en' ? 'Your Success Timeline' : 'ציר הזמן להצלחה שלך'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === 'en' ? 'First 7 days: Get familiar with basics' : 'שבעת הימים הראשונים: הכר את היסודות'}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {language === 'en' ? 'Set up employees, create your first schedule, explore core features' : 'הגדר עובדים, צור את הלוח הראשון שלך, חקור תכונות ליבה'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === 'en' ? 'Week 2-3: Advanced features training' : 'שבוע 2-3: הכשרה על תכונות מתקדמות'}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {language === 'en' ? 'Master analytics, automation, and mobile app features' : 'שלוט בניתוחים, אוטומציה ותכונות אפליקציה נייד'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === 'en' ? 'Week 4: Optimization recommendations' : 'שבוע 4: המלצות אופטימיזציה'}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {language === 'en' ? 'Receive personalized tips to maximize your ROI and efficiency' : 'קבל טיפים מותאמים אישית למקסום ROI ויעילות'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Resources */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {language === 'en' ? 'Support Resources' : 'משאבי תמיכה'}
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? '24/7 Chat Support' : 'תמיכת צ\'אט 24/7'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Instant help when you need it' : 'עזרה מיידית כשאתה צריך'}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? 'Help Center' : 'מרכז עזרה'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Comprehensive guides and tutorials' : 'מדריכים ומדריכים מקיפים'}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {language === 'en' ? 'Video Tutorial Library' : 'ספריית מדריכי וידאו'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Step-by-step video guides' : 'מדריכי וידאו שלב אחר שלב'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                  <button
                    onClick={handleComplete}
                    className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Rocket className="w-6 h-6 mr-3" />
                    {language === 'en' ? 'Launch My ShiftGY Account!' : 'הפעל את חשבון ShiftGY שלי!'}
                  </button>
                  
                  <p className="text-gray-600 mt-4">
                    {language === 'en' ? "You're all set! Let's transform your workforce management." : 'הכל מוכן! בואו נשנה את ניהול כוח העבודה שלכם.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Plan Matcher Modal */}
          {showPlanMatcher && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'en' ? 'Smart Plan Analysis' : 'ניתוח תוכנית חכם'}
                    </h2>
                    <button
                      onClick={() => setShowPlanMatcher(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Business Analysis */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {language === 'en' ? 'Personalized Business Analysis' : 'ניתוח עסקי מותאם אישית'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-700 mb-2">
                          <strong>{language === 'en' ? 'Industry' : 'תחום'}:</strong> {industries.find(i => i.value === formData.industry)?.label}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>{language === 'en' ? 'Team Size' : 'גודל צוות'}:</strong> {employeeCounts.find(e => e.value === formData.employeeCount)?.label}
                        </p>
                        <p className="text-gray-700">
                          <strong>{language === 'en' ? 'Location' : 'מיקום'}:</strong> {countries.find(c => c.value === formData.country)?.label}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {language === 'en' ? 'ROI Analysis' : 'ניתוח ROI'}
                        </h4>
                        <p className="text-green-600 font-bold text-lg">
                          {language === 'en' ? 'Annual ROI' : 'ROI שנתי'}: {formData.roiData.roi}%
                        </p>
                        <p className="text-gray-600 text-sm">
                          {language === 'en' ? 'Net monthly savings' : 'חיסכון חודשי נטו'}: {getLocalizedPrice(formData.roiData.netMonthlySavings)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="w-8 h-8 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">
                        {plans.find(p => p.id === recommendation.recommendedPlan)?.name} {language === 'en' ? 'Plan - Perfect Match' : 'תוכנית - התאמה מושלמת'}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {language === 'en' ? 'Why Professional Plan for YOUR Business:' : 'למה תוכנית Professional לעסק שלך:'}
                        </h4>
                        <ul className="space-y-2">
                          {recommendation.reasoning.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                              <span className="text-gray-700 text-sm">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {language === 'en' ? `Industry-Specific Benefits for ${industries.find(i => i.value === formData.industry)?.label}:` : `יתרונות ספציפיים לתחום ${industries.find(i => i.value === formData.industry)?.label}:`}
                        </h4>
                        <ul className="space-y-2">
                          {recommendation.industryBenefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                              <span className="text-gray-700 text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {language === 'en' ? `${industries.find(i => i.value === formData.industry)?.label} Like Yours Report:` : `דוח עסקים כמו שלך ב${industries.find(i => i.value === formData.industry)?.label}:`}
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{recommendation.industryStats.laborCostReduction}%</div>
                            <p className="text-xs text-gray-600">
                              {language === 'en' ? 'reduction in labor costs' : 'הפחתה בעלויות עבודה'}
                            </p>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{recommendation.industryStats.timeReduction}%</div>
                            <p className="text-xs text-gray-600">
                              {language === 'en' ? 'less time on scheduling' : 'פחות זמן על תכנון'}
                            </p>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">{recommendation.industryStats.satisfactionImprovement}%</div>
                            <p className="text-xs text-gray-600">
                              {language === 'en' ? 'improvement in satisfaction' : 'שיפור בשביעות רצון'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => {
                          selectPlan(recommendation.recommendedPlan);
                          setShowPlanMatcher(false);
                        }}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                      >
                        {language === 'en' ? 'Select Recommended Plan' : 'בחר תוכנית מומלצת'}
                      </button>
                    </div>
                  </div>

                  {/* Alternative Analysis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {language === 'en' ? 'Alternative Analysis' : 'ניתוח חלופות'}
                    </h3>
                    {recommendation.alternatives.map(alt => {
                      const plan = plans.find(p => p.id === alt.plan);
                      return plan ? (
                        <div key={alt.plan} className={`p-4 rounded-xl border ${alt.suitable ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex items-center gap-3">
                            {alt.suitable ? (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900">{plan.name} {language === 'en' ? 'Plan' : 'תוכנית'}:</h4>
                              <p className="text-sm text-gray-700">{alt.reason}</p>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slide-down {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}