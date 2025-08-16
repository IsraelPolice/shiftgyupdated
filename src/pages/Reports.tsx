import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import CustomReportBuilder from '../components/reports/CustomReportBuilder';

interface SavedCustomReport {
  id: string;
  name: string;
  description: string;
  dataSource: string;
  selectedFields: string[];
  chartConfig: { type: string; xAxis?: string; yAxis?: string; };
  createdAt: string;
}
import {
  Users, Clock, DollarSign, TrendingUp, Calendar, FileText, BarChart3,
  Download, RefreshCw, Plus, Mail, ChevronDown, ChevronRight, X
} from 'lucide-react';

export default function Reports() {
  const { language, isRTL } = useLanguage();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedSubReport, setSelectedSubReport] = useState('');
  const [expandedSections, setExpandedSections] = useState(['operational']);

  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [customReports, setCustomReports] = useState([]);

  // Sample data for charts
  const laborCostData = [
    { month: 'Jan', planned: 45000, actual: 47000 },
    { month: 'Feb', planned: 42000, actual: 43500 },
    { month: 'Mar', planned: 48000, actual: 50000 },
    { month: 'Apr', planned: 45000, actual: 46500 },
    { month: 'May', planned: 52000, actual: 54000 },
    { month: 'Jun', planned: 47000, actual: 48500 }
  ];

  const attendanceData = [
    { day: 'Mon', rate: 96 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 98 },
    { day: 'Thu', rate: 92 },
    { day: 'Fri', rate: 89 },
    { day: 'Sat', rate: 95 },
    { day: 'Sun', rate: 93 }
  ];

  const departmentData = [
    { name: 'Sales', efficiency: 94, cost: 28000, employees: 12 },
    { name: 'Operations', efficiency: 87, cost: 35000, employees: 18 },
    { name: 'Customer Service', efficiency: 91, cost: 22000, employees: 8 },
    { name: 'Security', efficiency: 96, cost: 15000, employees: 6 }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const reportCategories = [
    {
      id: 'operational',
      name: language === 'he' ? 'דוחות תפעוליים' : 'Operational Reports',
      icon: Users,
      reports: [
        { id: 'shift-coverage', name: language === 'he' ? 'ניתוח כיסוי משמרות' : 'Shift Coverage Analysis' },
        { id: 'attendance', name: language === 'he' ? 'דוחות נוכחות' : 'Attendance Reports' },
        { id: 'overtime', name: language === 'he' ? 'ניתוח שעות נוספות' : 'Overtime Analysis' },
        { id: 'department-performance', name: language === 'he' ? 'ביצועי מחלקות' : 'Department Performance' }
      ]
    },
    {
      id: 'analytics',
      name: language === 'he' ? 'ניתוח ותובנות' : 'Analytics & Insights',
      icon: TrendingUp,
      reports: [
        { id: 'predictive', name: language === 'he' ? 'תחזית כוח אדם' : 'Predictive Staffing Forecast' },
        { id: 'labor-trends', name: language === 'he' ? 'מגמות עלות עבודה' : 'Labor Cost Trends' },
        { id: 'productivity', name: language === 'he' ? 'מדדי פרודוקטיביות' : 'Productivity Metrics' },
        { id: 'patterns', name: language === 'he' ? 'ניתוח דפוסי משמרות' : 'Shift Pattern Analysis' }
      ]
    },
    {
      id: 'financial',
      name: language === 'he' ? 'דוחות כספיים' : 'Financial Reports',
      icon: DollarSign,
      reports: [
        { id: 'budget-actual', name: language === 'he' ? 'תקציב מול ביצוע' : 'Budget vs Actual' },
        { id: 'department-costs', name: language === 'he' ? 'ניתוח עלויות מחלקות' : 'Department Cost Analysis' },
        { id: 'overtime-costs', name: language === 'he' ? 'פירוט עלויות שעות נוספות' : 'Overtime Cost Breakdown' }
      ]
    },
    {
      id: 'compliance',
      name: language === 'he' ? 'דוחות ציות' : 'Compliance Reports',
      icon: FileText,
      reports: [
        { id: 'work-hours', name: language === 'he' ? 'ציות שעות עבודה' : 'Work Hours Compliance' },
        { id: 'break-monitoring', name: language === 'he' ? 'מעקב זמני הפסקה' : 'Break Time Monitoring' },
        { id: 'shift-length', name: language === 'he' ? 'ציות אורך משמרות' : 'Shift Length Compliance' }
      ]
    }
  ];

  const renderOverviewContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'he' ? 'דוחות וניתוחים' : 'Reports & Analytics'}
          </h1>
          <p className="text-gray-600">
            {language === 'he' ? 'תובנות מתקדמות ודוחות מותאמים אישית' : 'Advanced insights and customizable reports'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            {language === 'he' ? 'רענן' : 'Refresh'}
          </button>
          <button 
            onClick={() => setShowCustomReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            {language === 'he' ? 'דוח מותאם' : 'Custom Report'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Mail className="w-4 h-4" />
            {language === 'he' ? 'תזמון דוח' : 'Schedule Report'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select className="px-3 py-2 border border-gray-300 rounded-lg">
          <option>{language === 'he' ? 'החודש' : 'This Month'}</option>
          <option>{language === 'he' ? 'השבוע' : 'This Week'}</option>
          <option>{language === 'he' ? 'השנה' : 'This Year'}</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg">
          <option>{language === 'he' ? 'כל המחלקות' : 'All Departments'}</option>
          <option>{language === 'he' ? 'מכירות' : 'Sales'}</option>
          <option>{language === 'he' ? 'תפעול' : 'Operations'}</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות מתוכננות מול ביצוע' : 'Planned vs Actual Hours'}</p>
              <p className="text-2xl font-bold text-gray-900">2,340 / 2,280</p>
            </div>
            <div className="text-green-600 text-sm font-medium">+2.6%</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-blue-600 text-2xl font-bold">$118,500</h3>
          <p className="text-sm text-gray-600">{language === 'he' ? 'הוצאה בפועל' : 'Actual Spent'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-purple-600 text-2xl font-bold">$6,500</h3>
          <p className="text-sm text-gray-600">{language === 'he' ? 'מתחת לתקציב' : 'Under Budget'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-orange-600 text-2xl font-bold">$29.50</h3>
          <p className="text-sm text-gray-600">{language === 'he' ? 'עלות לשעה' : 'Cost per Hour'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{language === 'he' ? 'ניתוח עלויות עבודה' : 'Labor Cost Analysis'}</h3>
            <Download className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={laborCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="planned" fill="#3B82F6" name="Planned" />
              <Bar dataKey="actual" fill="#10B981" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{language === 'he' ? 'מגמות נוכחות' : 'Attendance Trends'}</h3>
            <Download className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderOperationalContent = () => {
    // If no sub-report selected, show general operational overview
    if (!selectedSubReport || selectedSubReport === '') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות תפעוליים' : 'Operational Reports'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">95%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שיעור כיסוי משמרות' : 'Shift Coverage Rate'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">42</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'משמרות פעילות היום' : 'Active Shifts Today'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">5</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'פערי כיסוי' : 'Coverage Gaps'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">247</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'כוח אדם במשמרת' : 'Total Staff On Duty'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">{language === 'he' ? 'מפת חום כיסוי משמרות' : 'Shift Coverage Heatmap'}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#3B82F6" fill="#93C5FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // SHIFT COVERAGE specific content
    if (selectedSubReport === 'shift-coverage') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ניתוח כיסוי משמרות' : 'Shift Coverage Analysis'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">98%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'כיסוי השבוע' : 'Coverage Rate This Week'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">15</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'משמרות מאוישות במלואן' : 'Shifts Fully Staffed'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">3</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'משמרות חסרות איוש' : 'Understaffed Shifts'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">2</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'פערים קריטיים' : 'Critical Gaps'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">🎯 {language === 'he' ? 'ניתוח כיסוי משמרות מפורט' : 'SHIFT COVERAGE SPECIFIC CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג ניתוח מפורט של כיסוי משמרות, חיזוי פערים והמלצות איוש.'
                : 'This shows detailed shift coverage analysis, gap predictions, and staffing recommendations.'
              }
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { shift: 'Morning', covered: 95, required: 100 },
                { shift: 'Afternoon', covered: 88, required: 90 },
                { shift: 'Evening', covered: 92, required: 95 },
                { shift: 'Night', covered: 85, required: 80 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shift" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="covered" fill="#10B981" name="Covered" />
                <Bar dataKey="required" fill="#3B82F6" name="Required" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // ATTENDANCE specific content  
    if (selectedSubReport === 'attendance') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות נוכחות' : 'Attendance Reports'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">94.2%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'נוכחות ממוצעת' : 'Average Attendance'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">23</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'נוכחות מושלמת' : 'Perfect Attendance'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-yellow-600 text-2xl font-bold">8</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'איחורים היום' : 'Late Arrivals Today'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">4</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'היעדרויות היום' : 'Absences Today'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">👥 {language === 'he' ? 'תוכן ספציפי לנוכחות' : 'ATTENDANCE SPECIFIC CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג דפוסי נוכחות מפורטים, מגמות איחורים וניתוח היעדרויות.'
                : 'This shows detailed attendance patterns, late arrival trends, and absence analysis.'
              }
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // OVERTIME specific content
    if (selectedSubReport === 'overtime') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ניתוח שעות נוספות' : 'Overtime Analysis'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">156</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות נוספות השבוע' : 'Overtime Hours This Week'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">$4,200</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלות שעות נוספות' : 'Overtime Cost'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">12</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עובדים עם שעות נוספות' : 'Employees with OT'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">8.2%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות נוספות מסך השעות' : 'OT as % of Total Hours'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">⏰ {language === 'he' ? 'תוכן ספציפי לשעות נוספות' : 'OVERTIME SPECIFIC CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג חלוקת שעות נוספות, ניתוח עלויות והמלצות להפחתת שעות נוספות.'
                : 'This shows overtime distribution, cost analysis, and recommendations for OT reduction.'
              }
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { dept: 'Sales', overtime: 45, regular: 320 },
                { dept: 'Operations', overtime: 67, regular: 450 },
                { dept: 'Customer Service', overtime: 23, regular: 180 },
                { dept: 'Security', overtime: 21, regular: 160 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="regular" fill="#3B82F6" name="Regular Hours" />
                <Bar dataKey="overtime" fill="#EF4444" name="Overtime Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // DEPARTMENT PERFORMANCE specific content
    if (selectedSubReport === 'department-performance') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ביצועי מחלקות' : 'Department Performance'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">Sales</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מחלקה מובילה (94%)' : 'Top Performer (94%)'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">Operations</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'השתפרות מרבית (87%)' : 'Most Improved (87%)'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">4</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מחלקות במעקב' : 'Departments Tracked'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">89.5%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'ביצועים ממוצעים' : 'Average Performance'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">🏢 {language === 'he' ? 'תוכן ספציפי לביצועי מחלקות' : 'DEPARTMENT PERFORMANCE SPECIFIC CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג השוואת מחלקות, מדדי יעילות ומגמות ביצועים.'
                : 'This shows department comparison, efficiency metrics, and performance trends.'
              }
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData.map(dept => ({ name: dept.name, value: dept.efficiency }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות תפעוליים' : 'Operational Reports'}</h1>
        <div className="bg-yellow-100 p-4 rounded">
          <p>{language === 'he' ? 'תת-דוח לא ידוע:' : 'Unknown sub-report:'} {selectedSubReport}</p>
        </div>
      </div>
    );
  };

  const renderAnalyticsContent = () => {
    console.log('renderAnalyticsContent called with selectedSubReport:', selectedSubReport);
    
    // If no sub-report selected, show general analytics overview
    if (!selectedSubReport || selectedSubReport === '') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ניתוח ותובנות' : 'Analytics & Insights'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">+15%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'צמיחת פרודוקטיביות' : 'Productivity Growth'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">278</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'צורך כוח אדם חזוי' : 'Predicted Staff Need'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">91%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'דיוק תחזיות' : 'Forecast Accuracy'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">88%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שביעות רצון עובדים' : 'Employee Satisfaction'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">{language === 'he' ? 'מגמות פרודוקטיביות' : 'Productivity Trends'}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={laborCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">{language === 'he' ? 'ביצועי מחלקות' : 'Department Performance'}</h3>
              <div className="space-y-3">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">{dept.name}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">{dept.efficiency}%</span>
                      <span className="text-blue-600">${dept.cost.toLocaleString()}</span>
                      <span className="text-gray-600">{dept.employees} employees</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-100 p-4 rounded">
            <p className="text-blue-800">📈 {language === 'he' ? 'בחר דוח ניתוח ספציפי מהסרגל הצדדי לצפייה בתובנות מפורטות.' : 'Select a specific analytics report from the sidebar to view detailed insights.'}</p>
            <p className="text-sm text-blue-600 mt-2">Current sub-report: {selectedSubReport || 'none'}</p>
          </div>
        </div>
      );
    }

    // PREDICTIVE STAFFING
    if (selectedSubReport === 'predictive') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'תחזית כוח אדם' : 'Predictive Staffing Forecast'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">+12</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עובדים נוספים נדרשים' : 'Additional Staff Needed'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">87%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'דיוק חיזוי' : 'Prediction Accuracy'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">3</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שבועות תחזית' : 'Weeks Forecasted'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">$15K</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'חיסכון צפוי' : 'Expected Savings'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">🔮 {language === 'he' ? 'תוכן ספציפי לתחזיות' : 'PREDICTIVE FORECASTING CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג תחזיות מבוססות AI לצרכי כוח אדם, זיהוי מגמות עונתיות והמלצות איוש.'
                : 'Shows AI-powered forecasts for staffing needs, seasonal trend identification, and staffing recommendations.'
              }
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">{language === 'he' ? 'תחזיות AI מתקדמות' : 'Advanced AI Predictions'}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">{language === 'he' ? 'עומס עבודה צפוי:' : 'Expected Workload:'}</span>
                  <span className="ml-2 font-medium">+23% {language === 'he' ? 'בחודש הבא' : 'next month'}</span>
                </div>
                <div>
                  <span className="text-blue-700">{language === 'he' ? 'מגמה עונתית:' : 'Seasonal Trend:'}</span>
                  <span className="ml-2 font-medium">{language === 'he' ? 'עלייה בקיץ' : 'Summer peak'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // LABOR COST TRENDS
    if (selectedSubReport === 'labor-trends') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'מגמות עלות עבודה' : 'Labor Cost Trends'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">-5.2%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפחתת עלויות ברבעון' : 'Cost Reduction This Quarter'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">$127K</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלות חודשית ממוצעת' : 'Average Monthly Cost'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">$28.75</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מגמת עלות לשעה' : 'Cost per Hour Trend'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">12%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות נוספות מסך הכל' : 'Overtime as % of Total'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">📊 {language === 'he' ? 'תוכן מגמות עלות עבודה' : 'LABOR COST TRENDS CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג ניתוח היסטורי של עלויות עבודה, זיהוי מגמות והזדמנויות אופטימיזציה.'
                : 'Shows historical labor cost analysis, trend identification, and cost optimization opportunities.'
              }
            </p>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={laborCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="planned" fill="#3B82F6" name={language === 'he' ? 'מתוכנן' : 'Planned'} />
                  <Bar dataKey="actual" fill="#10B981" name={language === 'he' ? 'בפועל' : 'Actual'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    // PRODUCTIVITY METRICS
    if (selectedSubReport === 'productivity') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'מדדי פרודוקטיביות' : 'Productivity Metrics'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">+18%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלייה בפרודוקטיביות' : 'Productivity Increase'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">92%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'דירוג יעילות' : 'Efficiency Rating'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">247</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'משימות הושלמו/יום' : 'Tasks Completed/Day'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">4.8</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'ציון ביצועים' : 'Performance Score'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">⚡ {language === 'he' ? 'תוכן מדדי פרודוקטיביות' : 'PRODUCTIVITY METRICS CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג ניתוח פרודוקטיביות עובדים, מדדי יעילות ותובנות אופטימיזציה של ביצועים.'
                : 'Shows employee productivity analysis, efficiency metrics, and performance optimization insights.'
              }
            </p>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={3} name={language === 'he' ? 'פרודוקטיביות' : 'Productivity'} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    // SHIFT PATTERN ANALYSIS
    if (selectedSubReport === 'patterns') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ניתוח דפוסי משמרות' : 'Shift Pattern Analysis'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">3</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'דפוסי משמרות אופטימליים' : 'Optimal Shift Patterns'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">85%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'יעילות דפוס' : 'Pattern Efficiency'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">6.5h</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'אורך משמרת ממוצע' : 'Average Shift Length'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">24/7</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מודל כיסוי' : 'Coverage Model'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">🔄 {language === 'he' ? 'תוכן ניתוח דפוסי משמרות' : 'SHIFT PATTERN ANALYSIS CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג ניתוח רוטציית משמרות, זיהוי דפוסים אופטימליים ותובנות יעילות תזמון.'
                : 'Shows shift rotation analysis, optimal pattern identification, and scheduling efficiency insights.'
              }
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">{language === 'he' ? 'דפוס A' : 'Pattern A'}</h4>
                <p className="text-sm text-green-600">{language === 'he' ? 'בוקר-ערב-לילה' : 'Morning-Evening-Night'}</p>
                <p className="text-xs text-green-500">85% {language === 'he' ? 'יעילות' : 'efficiency'}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">{language === 'he' ? 'דפוס B' : 'Pattern B'}</h4>
                <p className="text-sm text-blue-600">{language === 'he' ? 'משמרות מתחלפות' : 'Rotating Shifts'}</p>
                <p className="text-xs text-blue-500">78% {language === 'he' ? 'יעילות' : 'efficiency'}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800">{language === 'he' ? 'דפוס C' : 'Pattern C'}</h4>
                <p className="text-sm text-purple-600">{language === 'he' ? 'משמרות קבועות' : 'Fixed Shifts'}</p>
                <p className="text-xs text-purple-500">92% {language === 'he' ? 'יעילות' : 'efficiency'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Analytics overview (fallback)
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ניתוח ותובנות' : 'Analytics & Insights'}</h1>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-green-600 text-2xl font-bold">+15%</h3>
            <p className="text-sm text-gray-600">{language === 'he' ? 'צמיחת פרודוקטיביות' : 'Productivity Growth'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-blue-600 text-2xl font-bold">278</h3>
            <p className="text-sm text-gray-600">{language === 'he' ? 'צורך כוח אדם חזוי' : 'Predicted Staff Need'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-purple-600 text-2xl font-bold">91%</h3>
            <p className="text-sm text-gray-600">{language === 'he' ? 'דיוק תחזיות' : 'Forecast Accuracy'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-orange-600 text-2xl font-bold">88%</h3>
            <p className="text-sm text-gray-600">{language === 'he' ? 'שביעות רצון עובדים' : 'Employee Satisfaction'}</p>
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">🔍 {language === 'he' ? 'בחר דוח ניתוח ספציפי מהסרגל הצדדי לצפייה בתובנות מפורטות.' : 'Select a specific analytics report from the sidebar to view detailed insights.'}</p>
          <p className="text-sm text-red-600 mt-2">Current sub-report: {selectedSubReport || 'none'}</p>
        </div>
      </div>
    );
  };

  const renderFinancialContent = () => {
    // If no sub-report selected, show general financial overview
    if (!selectedSubReport || selectedSubReport === '') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות כספיים' : 'Financial Reports'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">$125,000</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'תקציב חודשי' : 'Monthly Budget'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">$118,500</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הוצאה בפועל' : 'Actual Spent'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">$6,500</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מתחת לתקציב' : 'Under Budget'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">$29.50</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלות לשעה' : 'Cost per Hour'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">{language === 'he' ? 'תקציב מול ביצוע' : 'Budget vs Actual Spending'}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={laborCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#3B82F6" name="Budget" />
                <Bar dataKey="actual" fill="#EF4444" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // BUDGET VS ACTUAL
    if (selectedSubReport === 'budget-actual') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'תקציב מול ביצוע' : 'Budget vs Actual'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">$132,000</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'תקציב מתוכנן' : 'Planned Budget'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">$127,800</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הוצאה בפועל' : 'Actual Spending'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">$4,200</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'חיסכון' : 'Savings'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">3.2%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מתחת לתקציב' : 'Under Budget'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">💰 {language === 'he' ? 'תוכן ספציפי לתקציב מול ביצוע' : 'BUDGET vs ACTUAL SPECIFIC CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג השוואה מפורטת בין תקציב מתוכנן להוצאה בפועל, ניתוח סטיות והמלצות לחיסכון.'
                : 'Shows detailed comparison between planned budget and actual spending, variance analysis, and cost-saving recommendations.'
              }
            </p>
          </div>
        </div>
      );
    }

    // DEPARTMENT COST ANALYSIS
    if (selectedSubReport === 'department-costs') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ניתוח עלויות מחלקות' : 'Department Cost Analysis'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">Sales</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלות גבוהה ביותר: $45K' : 'Highest Cost: $45K'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">Security</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'היעיל ביותר: $15K' : 'Most Efficient: $15K'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">4</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מחלקות נותחו' : 'Departments Analyzed'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">$28.50</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלות ממוצעת/שעה' : 'Average Cost/Hour'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">🏢 {language === 'he' ? 'תוכן ניתוח עלויות מחלקות' : 'DEPARTMENT COST ANALYSIS CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג פירוט עלויות לפי מחלקה, השוואת יעילות והזדמנויות אופטימיזציה של עלויות.'
                : 'Shows cost breakdown by department, efficiency comparison, and cost optimization opportunities.'
              }
            </p>
          </div>
        </div>
      );
    }

    // OVERTIME COST BREAKDOWN
    if (selectedSubReport === 'overtime-costs') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'פירוט עלויות שעות נוספות' : 'Overtime Cost Breakdown'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">$12.4K</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עלות שעות נוספות החודש' : 'Total OT Cost This Month'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">156</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'סך שעות נוספות' : 'Total OT Hours'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">12</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'עובדים עם שעות נוספות' : 'Employees with OT'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">9.5%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות נוספות מהתקציב' : 'OT as % of Budget'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">⏰ {language === 'he' ? 'תוכן פירוט עלויות שעות נוספות' : 'OVERTIME COST BREAKDOWN CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג ניתוח מפורט של עלויות שעות נוספות, פירוט לפי מחלקה ואסטרטגיות הפחתת שעות נוספות.'
                : 'Shows detailed overtime cost analysis, department breakdown, and OT reduction strategies.'
              }
            </p>
          </div>
        </div>
      );
    }

    // Default Financial overview
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות כספיים' : 'Financial Reports'}</h1>
        <div className="bg-yellow-100 p-4 rounded">
          <p>{language === 'he' ? 'תת-דוח לא ידוע:' : 'Unknown sub-report:'} {selectedSubReport}</p>
        </div>
      </div>
    );
  };

  const renderComplianceContent = () => {
    // WORK HOURS COMPLIANCE
    if (selectedSubReport === 'work-hours') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ציות שעות עבודה' : 'Work Hours Compliance'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">97.8%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'ציות שעות שבועיות' : 'Weekly Hours Compliance'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-yellow-600 text-2xl font-bold">2</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפרות השבוע' : 'Violations This Week'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">45</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'מגבלת שעות' : 'Hour Limit'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">42.3</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות ממוצעות' : 'Avg Weekly Hours'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">⚖️ {language === 'he' ? 'תוכן ציות שעות עבודה' : 'WORK HOURS COMPLIANCE CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג מעקב ציות לחוקי עבודה, זיהוי הפרות ודיווח רגולטורי.'
                : 'Shows labor law compliance tracking, violation detection, and regulatory reporting.'
              }
            </p>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>{language === 'he' ? 'שעות שבועיות מקסימליות (45 שעות)' : 'Maximum Weekly Hours (45h)'}</span>
                <span className="text-green-600 font-bold">✓ {language === 'he' ? 'תואם' : 'Compliant'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>{language === 'he' ? 'תקופות מנוחה חובה' : 'Mandatory Rest Periods'}</span>
                <span className="text-green-600 font-bold">✓ {language === 'he' ? 'תואם' : 'Compliant'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span>{language === 'he' ? 'התראות שעות נוספות' : 'Overtime Notifications'}</span>
                <span className="text-yellow-600 font-bold">⚠ {language === 'he' ? '2 הפרות' : '2 Violations'}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // BREAK TIME MONITORING
    if (selectedSubReport === 'break-monitoring') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'מעקב זמני הפסקה' : 'Break Time Monitoring'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">100%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שיעור ציות הפסקות' : 'Break Compliance Rate'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">15min</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'משך הפסקה סטנדרטי' : 'Standard Break Duration'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">2</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפסקות למשמרת' : 'Breaks per Shift'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">0</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפסקות שהוחמצו' : 'Missed Breaks'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">☕ {language === 'he' ? 'תוכן מעקב זמני הפסקה' : 'BREAK TIME MONITORING CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג ציות לוח זמנים הפסקות, מעקב משך זמן וניתוח תקופות מנוחה.'
                : 'Shows break schedule compliance, duration tracking, and rest period analysis.'
              }
            </p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <h4 className="font-semibold">{language === 'he' ? 'הפסקות משמרת בוקר' : 'Morning Shift Breaks'}</h4>
                <p className="text-sm text-gray-600">10:30 AM - 15 min</p>
                <p className="text-sm text-gray-600">12:30 PM - 30 min ({language === 'he' ? 'ארוחת צהריים' : 'Lunch'})</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <h4 className="font-semibold">{language === 'he' ? 'הפסקות משמרת ערב' : 'Evening Shift Breaks'}</h4>
                <p className="text-sm text-gray-600">3:30 PM - 15 min</p>
                <p className="text-sm text-gray-600">6:30 PM - 30 min ({language === 'he' ? 'ארוחת ערב' : 'Dinner'})</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // SHIFT LENGTH COMPLIANCE
    if (selectedSubReport === 'shift-length') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ציות אורך משמרות' : 'Shift Length Compliance'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">95%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שיעור ציות אורך' : 'Length Compliance Rate'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">8h</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'אורך משמרת סטנדרטי' : 'Standard Shift Length'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-red-600 text-2xl font-bold">2</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפרות שעות נוספות' : 'Overtime Violations'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">7.8h</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'אורך משמרת ממוצע' : 'Average Shift Length'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">📏 {language === 'he' ? 'תוכן ציות אורך משמרות' : 'SHIFT LENGTH COMPLIANCE CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג מעקב משך משמרות, הפרות שעות נוספות וציות לתקנות אורך.'
                : 'Shows shift duration tracking, overtime violations, and length regulation compliance.'
              }
            </p>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>{language === 'he' ? 'משמרות סטנדרטיות 8 שעות' : 'Standard 8-hour shifts'}</span>
                <span className="text-green-600">✓ {language === 'he' ? '95% תואם' : '95% Compliant'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span>{language === 'he' ? 'משמרות מעל 12 שעות' : 'Shifts over 12 hours'}</span>
                <span className="text-red-600">⚠ {language === 'he' ? '2 הפרות' : '2 Violations'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span>{language === 'he' ? 'משמרות כפולות (16+ שעות)' : 'Double shifts (16h+)'}</span>
                <span className="text-blue-600">ℹ {language === 'he' ? 'לא מותר' : 'Not Allowed'}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Compliance overview
    // If no sub-report selected, show general compliance overview
    if (!selectedSubReport || selectedSubReport === '') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות ציות' : 'Compliance Reports'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">98.5%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שיעור ציות' : 'Compliance Rate'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-yellow-600 text-2xl font-bold">3</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפרות קלות' : 'Minor Violations'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">0</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפרות חמורות' : 'Major Violations'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">100%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'ציות הפסקות' : 'Break Compliance'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">{language === 'he' ? 'מעקב ציות שעות עבודה' : 'Work Hours Compliance Monitoring'}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-green-800">{language === 'he' ? 'ציות שעות עבודה שבועיות' : 'Weekly Work Hours Compliance'}</span>
                <span className="text-green-600 font-bold">98.5%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">{language === 'he' ? 'ציות זמני הפסקה' : 'Break Time Compliance'}</span>
                <span className="text-blue-600 font-bold">100%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="font-medium text-yellow-800">{language === 'he' ? 'ציות אורך משמרות' : 'Shift Length Compliance'}</span>
                <span className="text-yellow-600 font-bold">95%</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // WORK HOURS specific content
    if (selectedSubReport === 'work-hours') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'ציות שעות עבודה' : 'Work Hours Compliance'}</h1>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-green-600 text-2xl font-bold">97.8%</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'ציות שעות שבועיות' : 'Weekly Hours Compliance'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-blue-600 text-2xl font-bold">2</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'הפרות השבוע' : 'Violations This Week'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-orange-600 text-2xl font-bold">45</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'שעות מקסימום' : 'Max Hours Limit'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-purple-600 text-2xl font-bold">42.3</h3>
              <p className="text-sm text-gray-600">{language === 'he' ? 'ממוצע שעות שבועיות' : 'Avg Weekly Hours'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">⚖️ {language === 'he' ? 'תוכן ספציפי לציות שעות עבודה' : 'WORK HOURS COMPLIANCE CONTENT'}</h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'מציג מעקב אחר ציות לחוקי עבודה, זיהוי הפרות ודוחות לרשויות.'
                : 'Shows labor law compliance tracking, violation detection, and regulatory reporting.'
              }
            </p>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{language === 'he' ? 'דוחות ציות' : 'Compliance Reports'}</h1>
        <div className="bg-yellow-100 p-4 rounded">
          <p>{language === 'he' ? 'תת-דוח לא ידוע:' : 'Unknown sub-report:'} {selectedSubReport}</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    console.log('renderContent called with selectedReport:', selectedReport, 'selectedSubReport:', selectedSubReport);
    
    switch (selectedReport) {
      case 'overview':
        return renderOverviewContent();
      case 'operational':
        return renderOperationalContent();
      case 'analytics':
        return renderAnalyticsContent();  // Make sure this calls the correct function
      case 'financial':
        return renderFinancialContent();
      case 'custom':
        const customReport = customReports.find(r => r.id === selectedSubReport);
        if (customReport) {
          return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{customReport.name}</h1>
                  <p className="text-gray-600 mt-1">{customReport.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <RefreshCw className="w-4 h-4" />
                    {language === 'he' ? 'רענן' : 'Refresh'}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    {language === 'he' ? 'ייצא' : 'Export'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'he' ? 'דוח מותאם' : 'Custom Report'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {language === 'he' 
                      ? `מקור נתונים: ${customReport.dataSource} • ${customReport.selectedFields.length} שדות`
                      : `Data source: ${customReport.dataSource} • ${customReport.selectedFields.length} fields`
                    }
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-blue-800 text-sm">
                      {language === 'he' 
                        ? 'תצוגת נתונים בפועל תתווסף בגרסאות הבאות'
                        : 'Live data visualization will be added in future versions'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return renderOverviewContent();
      case 'compliance':
        return renderComplianceContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-sm border-r flex-shrink-0">
        <div className="h-full overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {language === 'he' ? 'דוחות וניתוחים' : 'Reports & Analytics'}
                </h2>
                <p className="text-sm text-gray-600">
                  {language === 'he' ? 'תובנות מתקדמות לעסק שלך' : 'Advanced insights for your business'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Overview */}
            <button
              onClick={() => {
                setSelectedReport('overview');
                setSelectedSubReport('');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left mb-2 ${
                selectedReport === 'overview' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{language === 'he' ? 'סקירה כללית' : 'Overview'}</span>
            </button>

            {/* Report Categories */}
          {/* Custom Reports Section */}
          {customReports.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'he' ? 'דוחות מותאמים' : 'Custom Reports'}
              </div>
              <div className="space-y-1">
                {customReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => {
                      setSelectedReport('custom');
                      setSelectedSubReport(report.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                      selectedSubReport === report.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <div className="flex-1 min-w-0">
                      <span className="truncate">{report.name}</span>
                      <div className="text-xs text-gray-400 truncate">
                        {report.dataSource} • {report.selectedFields.length} fields
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

            {reportCategories.map((category) => {
              const IconComponent = category.icon;
              const isExpanded = expandedSections.includes(category.id);
              
              return (
                <div key={category.id} className="mb-2">
                  <button
                    onClick={() => {
                      setSelectedReport(category.id);
                      setSelectedSubReport('');
                      toggleSection(category.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                      selectedReport === category.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                    {category.reports && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Sub-reports */}
                  {category.reports && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.reports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => {
                            setSelectedReport(category.id);
                            setSelectedSubReport(report.id);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            selectedSubReport === report.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {report.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Advanced Custom Report Builder */}
      <CustomReportBuilder
        isOpen={showCustomReportModal}
        onClose={() => setShowCustomReportModal(false)}
        onSave={(reportConfig) => {
          console.log('Advanced custom report created:', reportConfig);
          const newReport: SavedCustomReport = {
            id: Date.now().toString(),
            name: reportConfig.name,
            description: reportConfig.description,
            dataSource: reportConfig.dataSource,
            selectedFields: reportConfig.selectedFields,
            chartConfig: reportConfig.chartConfig,
            createdAt: new Date().toISOString()
          };
          
          setCustomReports(prev => [...prev, newReport]);
          console.log('Custom report saved:', newReport);
          alert(`${language === 'he' ? 'דוח נוצר בהצלחה:' : 'Report created successfully:'} ${reportConfig.name}`);
          setShowCustomReportModal(false);
        }}
      />
    </div>
  );
}