import React, { useState } from 'react';
import { 
  Crown, 
  Calendar, 
  DollarSign, 
  Settings, 
  AlertTriangle, 
  Check, 
  X,
  Download,
  RefreshCw,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function SubscriptionManager() {
  const { features, cancelTrial, unsubscribe, getTrialDaysRemaining } = useUpgrade();
  const { formatCurrency } = useCurrency();
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState('');
  
  const activeFeatures = features.filter(f => f.hasAccess);
  const employeeCount = 62; // Mock employee count
  
  const handleCancelSubscription = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;
    
    if (feature.trial?.isActive) {
      await cancelTrial(featureId);
    } else if (feature.subscription?.isSubscribed) {
      await unsubscribe(featureId);
    }
    
    setShowCancelModal(null);
    setCancelReason('');
    setCancelFeedback('');
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <Crown className="w-8 h-8 text-purple-600" />;
      case 'CheckSquare': return <Check className="w-8 h-8 text-green-600" />;
      case 'Clock': return <Clock className="w-8 h-8 text-blue-600" />;
      case 'Coffee': return <Zap className="w-8 h-8 text-orange-600" />;
      case 'BarChart3': return <DollarSign className="w-8 h-8 text-indigo-600" />;
      default: return <Crown className="w-8 h-8 text-purple-600" />;
    }
  };

  const getStatusBadge = (feature: any) => {
    if (feature.trial?.isActive) {
      const daysRemaining = getTrialDaysRemaining(feature.id);
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
          <Clock className="w-4 h-4 mr-1" />
          Trial • {daysRemaining} days left
        </span>
      );
    } else if (feature.subscription?.isSubscribed) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
          <Check className="w-4 h-4 mr-1" />
          Active
        </span>
      );
    }
    return null;
  };

  if (activeFeatures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscriptions</h3>
        <p className="text-gray-500">You don't have any active premium features or trials.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Active Subscriptions & Trials</h2>
        <p className="text-gray-600">Manage your premium features and billing</p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        {activeFeatures.map((feature) => (
          <div key={feature.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Feature Header */}
            <div className="p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
                {getStatusBadge(feature)}
              </div>
            </div>

            {/* Feature Details */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Billing Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Information</h4>
                  <div className="space-y-2">
                    {feature.trial?.isActive ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Trial ends:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(feature.trial.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Then:</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(feature.pricePerEmployee * employeeCount)}/month
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next billing:</span>
                          <span className="font-medium text-gray-900">
                            {feature.subscription?.nextBillingDate?.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(feature.pricePerEmployee * employeeCount)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">This month:</span>
                      <span className="font-medium text-gray-900">
                        {feature.id === 'tasks' ? '47 tasks created' : 
                         feature.id === 'surveys' ? '3 surveys sent' : 
                         feature.id === 'presence' ? '1,240 clock-ins' : 
                         feature.id === 'breaks' ? '156 breaks scheduled' : 
                         '23 reports generated'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement:</span>
                      <span className="font-medium text-green-600">
                        {feature.id === 'tasks' ? '94% completion rate' : 
                         feature.id === 'surveys' ? '87% response rate' : 
                         feature.id === 'presence' ? '98% accuracy' : 
                         feature.id === 'breaks' ? '100% compliance' : 
                         '76% utilization'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 inline mr-2" />
                      Manage Settings
                    </button>
                    <button className="w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Export Data
                    </button>
                    <button
                      onClick={() => setShowCancelModal(feature.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 inline mr-2" />
                      {feature.trial?.isActive ? 'Cancel Trial' : 'Cancel Subscription'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel {features.find(f => f.id === showCancelModal)?.name}?
                </h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  You'll lose access to all {features.find(f => f.id === showCancelModal)?.name} features immediately. 
                  This action cannot be undone.
                </p>
                
                {/* Feedback Collection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Help us improve (optional):
                    </label>
                    <div className="space-y-2">
                      {[
                        'Too expensive',
                        'Not using enough',
                        'Missing features',
                        'Found alternative',
                        'Other'
                      ].map((reason) => (
                        <label key={reason} className="flex items-center">
                          <input
                            type="radio"
                            name="cancelReason"
                            value={reason}
                            checked={cancelReason === reason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <textarea
                      value={cancelFeedback}
                      onChange={(e) => setCancelFeedback(e.target.value)}
                      placeholder="Additional feedback (optional)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={() => handleCancelSubscription(showCancelModal)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}