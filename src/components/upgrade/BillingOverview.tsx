import React from 'react';
import { CreditCard, Calendar, DollarSign } from 'lucide-react';
import { useUpgrade } from '../../contexts/UpgradeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function BillingOverview() {
  const { features, getUpcomingCharges } = useUpgrade();
  const { t } = useLanguage();
  const { formatCurrency, convertCurrency } = useCurrency();

  const subscribedFeatures = features.filter(f => f.subscription?.isSubscribed);
  const upcomingCharges = getUpcomingCharges();
  const totalMonthly = upcomingCharges.reduce((sum, charge) => sum + charge.amount, 0);

  if (subscribedFeatures.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('upgrade.billing_overview')}</h3>
          <p className="text-sm text-gray-500">{t('upgrade.active_subscriptions')}</p>
        </div>
      </div>

      {/* Current Subscriptions */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-900">{t('upgrade.active_subscriptions')}</h4>
        {subscribedFeatures.map(feature => (
          <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{feature.name}</p>
              <p className="text-sm text-gray-500">
                {formatCurrency(convertCurrency(feature.pricePerEmployee, 'USD'))}{t('upgrade.per_employee_per_month')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {formatCurrency(convertCurrency(feature.pricePerEmployee * 62, 'USD'))}/month
              </p>
              <p className="text-xs text-gray-500">
                {t('upgrade.next_billing')}: {feature.subscription?.nextBillingDate?.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Charges */}
      {upcomingCharges.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">{t('upgrade.next_billing_cycle')}</h4>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(convertCurrency(totalMonthly, 'USD'))}</p>
              <p className="text-sm text-gray-500">{t('upgrade.total_monthly')}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">{t('upgrade.pro_rated_billing')}</p>
                <p className="text-sm text-blue-800">
                  {t('upgrade.prorated_first_charge')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}