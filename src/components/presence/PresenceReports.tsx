import React, { useState } from 'react';
import { Clock, Download, Filter, Calendar, User, MapPin, X, ChevronDown, Building2 } from 'lucide-react';
import { usePresence } from '../../contexts/PresenceContext';
import { useAuth } from '../../contexts/AuthContext';

export default function PresenceReports() {
  // Company and organizational filters
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Time range filters
  const [timeRangeType, setTimeRangeType] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState('2024-01-20');
  const [selectedWeek, setSelectedWeek] = useState('2024-W03');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [customStartDate, setCustomStartDate] = useState('2024-01-01');
  const [customEndDate, setCustomEndDate] = useState('2024-01-31');
  
  // UI state
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const { presenceLogs } = usePresence();
  const { hasPermission, user } = useAuth();

  const canViewReports = hasPermission('view_reports') || hasPermission('view_all');

  if (!canViewReports) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">You don't have permission to view presence reports</p>
      </div>
    );
  }

  // Mock data for companies and departments
  const companies = [
    { id: '1', name: 'ShiftGY Demo Company' },
    { id: '2', name: 'Retail Corp' }
  ];

  const departments = [
    { id: '1', name: 'Sales', companyId: '1' },
    { id: '2', name: 'Operations', companyId: '1' },
    { id: '3', name: 'Customer Service', companyId: '1' },
    { id: '4', name: 'Security', companyId: '1' }
  ];

  const employees = [
    { id: '1', name: 'Sarah Johnson', departmentId: '1', companyId: '1' },
    { id: '2', name: 'Michael Chen', departmentId: '1', companyId: '1' },
    { id: '3', name: 'Emily Davis', departmentId: '2', companyId: '1' },
    { id: '4', name: 'Alex Thompson', departmentId: '2', companyId: '1' }
  ];

  // Filter departments based on selected company
  const filteredDepartments = selectedCompany 
    ? departments.filter(dept => dept.companyId === selectedCompany)
    : departments;

  // Filter employees based on selected departments
  const filteredEmployees = selectedDepartments.length > 0
    ? employees.filter(emp => selectedDepartments.includes(emp.departmentId))
    : employees;

  // Validate custom date range (max 12 months)
  const validateCustomRange = () => {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 365;
  };

  // Filter logs based on all criteria
  const filteredLogs = presenceLogs.filter(log => {
    // Apply employee filter (which inherently filters by department and company)
    if (selectedEmployees.length > 0 && !selectedEmployees.includes(log.employeeId)) return false;
    
    // Apply status filter
    if (selectedStatus === 'active' && log.clockOutTime) return false;
    if (selectedStatus === 'completed' && !log.clockOutTime) return false;
    
    // Apply time range filter
    const logDate = new Date(log.clockInTime);
    
    switch (timeRangeType) {
      case 'daily':
        const selectedDateObj = new Date(selectedDate);
        return logDate.toDateString() === selectedDateObj.toDateString();
      
      case 'weekly':
        // Convert week format (2024-W03) to date range
        const [year, week] = selectedWeek.split('-W');
        const weekStart = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return logDate >= weekStart && logDate <= weekEnd;
      
      case 'monthly':
        const [selectedYear, selectedMonthNum] = selectedMonth.split('-');
        return logDate.getFullYear() === parseInt(selectedYear) && 
               logDate.getMonth() === parseInt(selectedMonthNum) - 1;
      
      case 'custom':
        if (!validateCustomRange()) return false;
        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        return logDate >= startDate && logDate <= endDate;
      
      default:
        return true;
    }
  });

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'In Progress';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderTimeRangeInput = () => {
    switch (timeRangeType) {
      case 'daily':
        return (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      
      case 'weekly':
        return (
          <input
            type="week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      
      case 'monthly':
        return (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      
      case 'custom':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End Date"
              />
            </div>
            {!validateCustomRange() && (
              <span className="text-red-500 text-xs">Maximum range: 12 months</span>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const clearAllFilters = () => {
    setSelectedCompany('');
    setSelectedDepartments([]);
    setSelectedEmployees([]);
    setSelectedStatus('');
    setTimeRangeType('weekly');
    setSelectedDate('2024-01-20');
    setSelectedWeek('2024-W03');
    setSelectedMonth('2024-01');
    setCustomStartDate('2024-01-01');
    setCustomEndDate('2024-01-31');
  };

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(d => d !== deptId)
        : [...prev, deptId]
    );
    // Clear employee selection when departments change
    setSelectedEmployees([]);
  };

  const toggleEmployee = (empId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(empId) 
        ? prev.filter(e => e !== empId)
        : [...prev, empId]
    );
  };

  const selectAllDepartments = () => {
    if (selectedDepartments.length === filteredDepartments.length) {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(filteredDepartments.map(d => d.id));
    }
    setSelectedEmployees([]);
  };

  const selectAllEmployees = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  // Generate filter summary for mobile
  const getFilterSummary = () => {
    const parts = [];
    if (selectedCompany) parts.push('1 Company');
    if (selectedDepartments.length > 0) parts.push(`${selectedDepartments.length} Departments`);
    if (selectedEmployees.length > 0) parts.push(`${selectedEmployees.length} Employees`);
    if (selectedStatus) parts.push('Status Filter');
    return parts.length > 0 ? parts.join(', ') : 'No filters applied';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presence Tracking</h1>
          <p className="text-gray-600 mt-1">Track employee clock in/out times and attendance</p>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Enhanced Layered Filters Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
            </div>
            
            {/* Mobile collapse toggle */}
            <button
              onClick={() => setFiltersCollapsed(!filtersCollapsed)}
              className="md:hidden flex items-center gap-2 text-sm text-gray-600"
            >
              <span>{getFilterSummary()}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${filtersCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className={`max-w-6xl mx-auto space-y-6 mt-6 ${filtersCollapsed ? 'hidden md:block' : ''}`}>
            {/* Filter Hierarchy Section */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Organization Filters</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company Level Filter - Only visible to Super Admins */}
                {user?.role === 'super_admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      Company
                    </label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => {
                        setSelectedCompany(e.target.value);
                        setSelectedDepartments([]);
                        setSelectedEmployees([]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Companies</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Departments Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {selectedDepartments.length === 0 
                          ? 'Select departments...' 
                          : `${selectedDepartments.length} selected`}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showDepartmentDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {/* Select All Option */}
                        <label className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.length === filteredDepartments.length && filteredDepartments.length > 0}
                            onChange={selectAllDepartments}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-900">Select All</span>
                        </label>
                        
                        {filteredDepartments.map(dept => (
                          <label key={dept.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedDepartments.includes(dept.id)}
                              onChange={() => toggleDepartment(dept.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">{dept.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Department Pills */}
                  {selectedDepartments.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedDepartments.map(deptId => {
                        const dept = departments.find(d => d.id === deptId);
                        return dept ? (
                          <span key={deptId} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {dept.name}
                            <button
                              onClick={() => toggleDepartment(deptId)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Employees Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {selectedEmployees.length === 0 
                          ? 'Select employees...' 
                          : `${selectedEmployees.length} selected`}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showEmployeeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {/* Select All Option */}
                        <label className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                            onChange={selectAllEmployees}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-900">Select All</span>
                        </label>
                        
                        {filteredEmployees.map(emp => (
                          <label key={emp.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(emp.id)}
                              onChange={() => toggleEmployee(emp.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">{emp.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Employee Pills */}
                  {selectedEmployees.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedEmployees.map(empId => {
                        const emp = employees.find(e => e.id === empId);
                        return emp ? (
                          <span key={empId} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {emp.name}
                            <button
                              onClick={() => toggleEmployee(empId)}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time Range Section */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Time Range Filter</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Time Range Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Time Range
                  </label>
                  <select
                    value={timeRangeType}
                    onChange={(e) => setTimeRangeType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Time Range Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {timeRangeType === 'daily' ? 'Select Date' :
                     timeRangeType === 'weekly' ? 'Select Week' :
                     timeRangeType === 'monthly' ? 'Select Month' : 'Date Range'}
                  </label>
                  {renderTimeRangeInput()}
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Currently Active</option>
                    <option value="completed">Completed Shifts</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
              
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{presenceLogs.length}</span> records
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-3xl font-bold text-gray-900">{filteredLogs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredLogs.filter(log => !log.clockOutTime).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredLogs.filter(log => log.clockOutTime).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(filteredLogs.reduce((sum, log) => sum + (log.totalMinutes || 0), 0) / 60)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Presence Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Presence Logs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const employee = employees.find(e => e.id === log.employeeId);
                const department = employee ? departments.find(d => d.id === employee.departmentId) : null;
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {employee ? employee.name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {employee ? employee.name : `Employee ${log.employeeId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {department ? department.name : 'Unknown Department'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.clockInTime.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.clockOutTime ? log.clockOutTime.toLocaleString() : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(log.totalMinutes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {log.location || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.method === 'manual' ? 'bg-blue-100 text-blue-800' :
                        log.method === 'automatic' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No presence logs found</h3>
            <p className="text-gray-500">No clock in/out records match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}