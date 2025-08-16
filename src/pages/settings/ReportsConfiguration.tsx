import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Clock, Users, BarChart3, Settings, Eye, EyeOff, Plus, X } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'Attendance' | 'Hours' | 'Performance';
  frequency: string;
  lastGenerated: string;
  status: 'active' | 'inactive';
  recipients: string[];
}

const ReportsConfiguration: React.FC = () => {
  // Mock data for reports
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Weekly Attendance Summary',
      type: 'Attendance',
      frequency: 'Weekly',
      lastGenerated: '2024-01-15',
      status: 'active',
      recipients: ['manager@company.com', 'hr@company.com']
    },
    {
      id: '2',
      name: 'Monthly Hours Report',
      type: 'Hours',
      frequency: 'Monthly',
      lastGenerated: '2024-01-01',
      status: 'active',
      recipients: ['payroll@company.com']
    },
    {
      id: '3',
      name: 'Department Performance',
      type: 'Performance',
      frequency: 'Bi-weekly',
      lastGenerated: '2024-01-10',
      status: 'inactive',
      recipients: ['director@company.com']
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: '',
    frequency: '',
    department: '',
    recipients: {
      emails: [],
      managers: false,
      systemAdmins: false,
      departmentManager: false
    },
    schedule: {
      time: '09:00',
      dayOfWeek: 1,
      dayOfMonth: 1
    }
  });

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate a small delay

    return () => clearTimeout(timer);
  }, []);

  const toggleReportStatus = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: report.status === 'active' ? 'inactive' : 'active' }
        : report
    ));
  };

  const handleCreateReport = () => {
    // Validate required fields
    if (!newReport.name || !newReport.type || !newReport.frequency) {
      alert('Please fill in all required fields');
      return;
    }

    // Add the new report to the list
    const reportToAdd: Report = {
      id: Date.now().toString(),
      name: newReport.name,
      type: newReport.type as 'Attendance' | 'Hours' | 'Performance',
      frequency: newReport.frequency,
      lastGenerated: 'Never',
      status: 'active',
      recipients: [
        ...newReport.recipients.emails,
        ...(newReport.recipients.managers ? ['managers@company.com'] : []),
        ...(newReport.recipients.systemAdmins ? ['admin@company.com'] : []),
        ...(newReport.recipients.departmentManager ? [`${newReport.department}@company.com`] : [])
      ]
    };
    
    setReports(prev => [...prev, reportToAdd]);
    
    // Close modal and reset form
    setShowCreateReportModal(false);
    setNewReport({
      name: '',
      type: '',
      frequency: '',
      department: '',
      recipients: {
        emails: [],
        managers: false,
        systemAdmins: false,
        departmentManager: false
      },
      schedule: {
        time: '09:00',
        dayOfWeek: 1,
        dayOfMonth: 1
      }
    });
    
    alert('Report created successfully!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Attendance': return <Users className="w-4 h-4" />;
      case 'Hours': return <Clock className="w-4 h-4" />;
      case 'Performance': return <BarChart3 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reports Configuration</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage automated reports and delivery settings</p>
        </div>
      </div>

      {/* Report Generation Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Report Generation Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Report Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Zone
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      </div>

      {/* All Reports Table (Desktop View) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 overflow-hidden w-full hidden lg:block">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Reports</h3>
          <button 
            onClick={() => setShowCreateReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Create New Report
          </button>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto border-collapse min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="w-[25%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Report Name
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Type
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Frequency
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Last Generated
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Recipients
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Status
                </th>
                <th className="w-[5%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading reports...</p>
                  </td>
                </tr>
              </tbody>
            ) : (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-900 dark:text-gray-300">{report.type}</span>
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Calendar className="w-3 h-3 mr-1" />
                      {report.frequency}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-900 dark:text-gray-300">{report.lastGenerated}</span>
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-900 dark:text-gray-300">
                      {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200 dark:border-gray-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => toggleReportStatus(report.id)}
                        className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-full"
                        title={report.status === 'active' ? 'Disable report' : 'Enable report'}
                      >
                        {report.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 rounded-full" title="Download report">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 rounded-full" title="Configure report">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${report.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {report.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>Type: {report.type}</div>
                <div>Frequency: {report.frequency}</div>
                <div>Recipients: {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="flex justify-end mt-3 space-x-2">
                <button onClick={() => toggleReportStatus(report.id)} className="p-1 text-gray-500 hover:text-gray-700" title={report.status === 'active' ? 'Disable report' : 'Enable report'}>
                  {report.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700" title="Download report">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700" title="Configure report">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Send email notifications when reports are generated</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Auto-Archive</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically archive reports older than 90 days</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Report</h3>
                <button 
                  onClick={() => setShowCreateReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Basic Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Report Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Name
                  </label>
                  <input 
                    type="text"
                    value={newReport.name}
                    onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter report name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Report Type
                    </label>
                    <select 
                      value={newReport.type}
                      onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Hours">Hours</option>
                      <option value="Performance">Performance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <select 
                      value={newReport.department}
                      onChange={(e) => setNewReport({...newReport, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Departments</option>
                      <option value="sales">Sales</option>
                      <option value="operations">Operations</option>
                      <option value="customer_service">Customer Service</option>
                      <option value="security">Security</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Schedule Settings</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select 
                      value={newReport.frequency}
                      onChange={(e) => setNewReport({...newReport, frequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Time
                    </label>
                    <input 
                      type="time"
                      value={newReport.schedule.time}
                      onChange={(e) => setNewReport({...newReport, schedule: {...newReport.schedule, time: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Recipients Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Recipients</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Addresses (comma separated)
                  </label>
                  <textarea 
                    value={newReport.recipients.emails.join(', ')}
                    onChange={(e) => setNewReport({...newReport, recipients: {...newReport.recipients, emails: e.target.value.split(',').map(email => email.trim()).filter(email => email)}})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="email1@company.com, email2@company.com"
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={newReport.recipients.managers}
                      onChange={(e) => setNewReport({...newReport, recipients: {...newReport.recipients, managers: e.target.checked}})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Send to All Managers</span>
                  </label>

                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={newReport.recipients.systemAdmins}
                      onChange={(e) => setNewReport({...newReport, recipients: {...newReport.recipients, systemAdmins: e.target.checked}})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Send to System Administrators</span>
                  </label>

                  {newReport.department && (
                    <label className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={newReport.recipients.departmentManager}
                        onChange={(e) => setNewReport({...newReport, recipients: {...newReport.recipients, departmentManager: e.target.checked}})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Send to Department Manager</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setShowCreateReportModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsConfiguration;