import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Calendar, 
  Shield, 
  Star,
  ArrowRight,
  Crown,
  Zap,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface PremiumFeatureModalProps {
  featureId: string;
  onClose: () => void;
}

export default function PremiumFeatureModal({ featureId, onClose }: PremiumFeatureModalProps) {
  const { getFeature, startTrial, subscribe } = useUpgrade();
  const { formatCurrency } = useCurrency();
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [showTrialWarning, setShowTrialWarning] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const feature = getFeature(featureId);
  const employeeCount = 62; // Mock employee count
  const monthlyPrice = feature ? feature.pricePerEmployee * employeeCount : 0;
  
  if (!feature) return null;

  const handleStartTrial = async () => {
    if (!showTrialWarning) {
      setShowTrialWarning(true);
      return;
    }
    
    setIsStartingTrial(true);
    try {
      await startTrial(featureId);
      setCurrentStep(3); // Success step
    } catch (error) {
      console.error('Failed to start trial:', error);
    } finally {
      setIsStartingTrial(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribe(featureId);
      onClose();
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const getFeatureIcon = () => {
    switch (feature.icon) {
      case 'MessageSquare': return <Users className="w-16 h-16 text-blue-600" />;
      case 'CheckSquare': return <Check className="w-16 h-16 text-green-600" />;
      case 'Clock': return <Clock className="w-16 h-16 text-purple-600" />;
      case 'Coffee': return <Sparkles className="w-16 h-16 text-orange-600" />;
      case 'BarChart3': return <TrendingUp className="w-16 h-16 text-indigo-600" />;
      default: return <Crown className="w-16 h-16 text-blue-600" />;
    }
  };

  if (currentStep === 3) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
          <div className="p-8 text-center">
            {/* Success Animation */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to {feature.marketingCopy.headline}!
            </h2>
            <p className="text-gray-600 mb-6">
              Your 30-day free trial has started. Explore all features and see the difference.
            </p>
            
            {/* Quick Start Guide */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Quick Start Guide:</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</div>
                  <span>Navigate to {feature.name} in the main menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">2</div>
                  <span>Create your first {feature.name.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">3</div>
                  <span>Link it to your shifts for maximum impact</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore Now
              </button>
              <button
                onClick={() => {
                  // Add to calendar functionality would go here
                  alert('Calendar reminder added!');
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 text-center border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Feature Icon */}
          <div className="mb-4">
            {getFeatureIcon()}
          </div>
          
          {/* Headlines */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {feature.marketingCopy.headline}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {feature.marketingCopy.subheadline}
          </p>
          
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium mb-4">
            <Crown className="w-4 h-4 mr-2" />
            Premium Feature
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Description */}
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {feature.marketingCopy.description}
          </p>

          {/* Benefits List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feature.marketingCopy.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots Preview */}
          {feature.marketingCopy.screenshots && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">See it in action:</h3>
              <div className="grid grid-cols-2 gap-4">
                {feature.marketingCopy.screenshots.map((screenshot, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={screenshot} 
                      alt={`${feature.name} preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Proof */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-blue-900 font-medium">
              {feature.marketingCopy.valueProposition}
            </p>
          </div>

          {/* Trial Warning */}
          {showTrialWarning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Important Trial Information</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Your free trial includes full access to {feature.name} for 30 days. After your trial ends on{' '}
                    <strong>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>, 
                    you'll automatically be charged <strong>{formatCurrency(monthlyPrice)}/month</strong> unless you cancel in Settings {'>'}  Payments.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-yellow-600">
                    <Shield className="w-4 h-4" />
                    <span>No credit card required • Cancel anytime • 30-day guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(monthlyPrice)}
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-4">
                For {employeeCount} employees • {formatCurrency(feature.pricePerEmployee)} per employee
              </p>
              
              {/* Trial Offer Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                FREE 30-DAY TRIAL
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartTrial}
              disabled={isStartingTrial}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isStartingTrial ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Starting Trial...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {showTrialWarning ? 'Confirm & Start Trial' : 'Start Free Trial'}
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                // Learn more functionality
                alert('Learn more about this feature');
              }}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Footer Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>30-day guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <X className="w-4 h-4 text-gray-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}