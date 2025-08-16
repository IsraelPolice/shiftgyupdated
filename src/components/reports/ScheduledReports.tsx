import React from 'react';

export default function ScheduledReports() {
  return (
    <div className="space-y-6">
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-card-icon bg-green-100">
            <div className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="settings-card-title">Scheduled Reports</h3>
            <p className="settings-card-description">Configure automated report generation and delivery</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600">Scheduled reports functionality will be available soon.</p>
        </div>
      </div>
    </div>
  );
}