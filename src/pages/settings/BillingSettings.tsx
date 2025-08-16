import React from 'react';
import { CreditCard, Calendar, DollarSign, Download, AlertTriangle } from 'lucide-react';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import SubscriptionManager from '../../components/upgrade/SubscriptionManager';

export default function BillingSettings() {
  const { features, getUpcomingCharges } = useUpgrade();
  const { formatCurrency } = useCurrency();
  
  const upcomingCharges = getUpcomingCharges();
  const totalMonthly = upcomingCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const nextBillingDate = upcomingCharges.length > 0 
    ? upcomingCharges.reduce((earliest, charge) => 
        charge.date < earliest ? charge.date : earliest, 
        upcomingCharges[0].date
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      {upcomingCharges.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Billing Overview</h3>
              <p className="text-sm text-gray-500">Your active subscriptions and upcoming charges</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatCurrency(totalMonthly)}
              </div>
              <div className="text-sm text-blue-700">Total Monthly</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {nextBillingDate?.toLocaleDateString()}
              </div>
              <div className="text-sm text-green-700">Next Billing</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {upcomingCharges.length}
              </div>
              <div className="text-sm text-purple-700">Active Features</div>
            </div>
          </div>

          {/* Pro-rated Billing Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Pro-rated Billing</p>
                <p className="text-sm text-blue-800">
                  Your first charge may be pro-rated based on when you started your subscription during the billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Manager */}
      <SubscriptionManager />
      
      {/* Payment Method */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Update
            </button>
          </div>
          
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
            + Add Payment Method
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { date: '2024-01-15', amount: 124.00, status: 'Paid', invoice: 'INV-001' },
            { date: '2023-12-15', amount: 124.00, status: 'Paid', invoice: 'INV-002' },
            { date: '2023-11-15', amount: 62.00, status: 'Paid', invoice: 'INV-003' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formatCurrency(bill.amount)}</p>
                  <p className="text-sm text-gray-500">{bill.date} • {bill.invoice}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {bill.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}