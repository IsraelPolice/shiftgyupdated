import React, { useState } from 'react';
import { useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Search, 
  Plus, 
  Filter,
  Tag,
  FileSpreadsheet,
  Download, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Send,
  List,
  Grid,
  Building2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import InviteEmployeeModal from '../components/employees/InviteEmployeeModal';
import BulkAccessModal from '../components/employees/BulkAccessModal';
import ImportEmployeesModal from '../components/employees/ImportEmployeesModal';

// Mock job templates for employee assignment
const mockJobTemplates = [
  { id: '1', name: 'Student Flexible', category: 'student' },
  { id: '2', name: 'Student Fixed Schedule', category: 'student' },
  { id: '3', name: '60% Position', category: 'partial' },
  { id: '4', name: 'Full-time Regular', category: 'full-time' },
  { id: '5', name: 'Night Shift Specialist', category: 'special' }
];

// Mock employees only for demo company
const demoEmployees = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Manager',
    department: 'Sales',
    tags: ['Team Lead', 'Trainer'],
    status: 'active',
    hireDate: '2022-03-15',
    lastActive: '2 hours ago',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'yearly',
    salaryRate: 65000,
    assignedTemplate: '1'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    role: 'Sales Associate',
    department: 'Sales',
    tags: ['Cashier', 'Team 1'],
    status: 'active',
    hireDate: '2023-01-08',
    lastActive: '30 minutes ago',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'hourly',
    salaryRate: 18.50,
    assignedTemplate: '2'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 345-6789',
    role: 'Cashier',
    department: 'Operations',
    tags: ['Cashier', 'Team 2'],
    status: 'inactive',
    hireDate: '2023-05-20',
    lastActive: '2 days ago',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'hourly',
    salaryRate: 16.00,
    assignedTemplate: undefined
  },
  {
    id: '4',
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    phone: '+1 (555) 456-7890',
    role: 'Stock Associate',
    department: 'Operations',
    tags: ['Inventory', 'Team 3'],
    status: 'active',
    hireDate: '2022-11-12',
    lastActive: '1 hour ago',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'weekly',
    salaryRate: 720,
    assignedTemplate: '3'
  },
  {
    id: '5',
    name: 'Jessica Wong',
    email: 'jessica.wong@company.com',
    phone: '+1 (555) 567-8901',
    role: 'Customer Service',
    department: 'Customer Service',
    tags: ['Support', 'Team Lead'],
    status: 'active',
    hireDate: '2023-02-14',
    lastActive: '45 minutes ago',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'hourly',
    salaryRate: 19.00,
    assignedTemplate: undefined
  },
  {
    id: '6',
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.com',
    phone: '+1 (555) 678-9012',
    role: 'Shift Supervisor',
    department: 'Operations',
    tags: ['Supervisor', 'Team 3'],
    status: 'active',
    hireDate: '2022-08-30',
    lastActive: '3 hours ago',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'yearly',
    salaryRate: 52000,
    assignedTemplate: '4'
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    phone: '+1 (555) 789-0123',
    role: 'Marketing Coordinator',
    department: 'Marketing',
    tags: ['Marketing', 'Creative'],
    status: 'active',
    hireDate: '2023-04-10',
    lastActive: '1 hour ago',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'yearly',
    salaryRate: 48000,
    assignedTemplate: undefined
  },
  {
    id: '8',
    name: 'Robert Kim',
    email: 'robert.kim@company.com',
    phone: '+1 (555) 890-1234',
    role: 'Security Guard',
    department: 'Security',
    tags: ['Security', 'Night Shift'],
    status: 'active',
    hireDate: '2022-12-05',
    lastActive: '6 hours ago',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2',
    salaryType: 'hourly',
    salaryRate: 17.50,
    assignedTemplate: '5'
  }
];

export default function EmployeesSimple() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { currentCompany, user } = useAuth();
  
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showBulkAccessModal, setShowBulkAccessModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const [showTagTooltip, setShowTagTooltip] = useState(false);

  // Load employees from Firestore
  useEffect(() => {
    const loadEmployees = async () => {
      if (!currentCompany?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // For demo company, use mock data
        if (currentCompany.id === 'company-1') {
          setEmployees(demoEmployees);
          setIsLoading(false);
          return;
        }

        // For real companies, load from Firestore
        const employeesQuery = query(
          collection(db, 'employees'),
          where('companyId', '==', currentCompany.id)
        );
        
        const snapshot = await getDocs(employeesQuery);
        const employeesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setEmployees(employeesList);
      } catch (error) {
        console.warn('Error loading employees from Firestore:', error);
        // Fallback to empty array for new companies
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [currentCompany?.id]);

  const canManageEmployees = hasPermission('manage_employees');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;
    const matchesTag = !selectedTag || (employee.tags && employee.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase())));
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesTag;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];
  const statuses = [...new Set(employees.map(emp => emp.status))];
  const allTags = [...new Set(employees.flatMap(emp => emp.tags || []))];

  const handleAddEmployee = async (employeeData: any) => {
    if (!currentCompany?.id) return;

    try {
      // For demo company, just update local state
      if (currentCompany.id === 'company-1') {
        setEmployees(prev => [...prev, { ...employeeData, id: Date.now().toString() }]);
        return;
      }

      // For real companies, save to Firestore
      const employeeToSave = {
        ...employeeData,
        companyId: currentCompany.id,
        createdAt: new Date(),
        createdBy: user?.id
      };

      const docRef = await addDoc(collection(db, 'employees'), employeeToSave);
      
      // Update local state with the new employee including Firestore ID
      setEmployees(prev => [...prev, { ...employeeToSave, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding employee:', error);
      // Fallback to local state if Firestore fails
      setEmployees(prev => [...prev, { ...employeeData, id: Date.now().toString() }]);
    }
  };

  const handleEditEmployee = async (employeeData: any) => {
    if (!currentCompany?.id) return;

    try {
      // For demo company, just update local state
      if (currentCompany.id === 'company-1') {
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeData.id ? employeeData : emp
        ));
        setEditingEmployee(null);
        return;
      }

      // For real companies, update in Firestore
      await updateDoc(doc(db, 'employees', employeeData.id), {
        ...employeeData,
        updatedAt: new Date(),
        updatedBy: user?.id
      });
      
      // Update local state
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeData.id ? employeeData : emp
      ));
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      // Fallback to local state update
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeData.id ? employeeData : emp
      ));
      setEditingEmployee(null);
    }
  };

  const openEditModal = (employee: any) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const openInviteModal = (employee: any) => {
    setSelectedEmployee(employee);
    setShowInviteModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setSelectedEmployee(null);
  };
  
  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };
  
  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleImportEmployees = async (importedEmployees: any[]) => {
    if (!currentCompany?.id) return;

    try {
      // For demo company, just update local state
      if (currentCompany.id === 'company-1') {
        setEmployees(prev => [...prev, ...importedEmployees]);
        return;
      }

      // For real companies, save to Firestore
      const employeesToSave = importedEmployees.map(emp => ({
        ...emp,
        companyId: currentCompany.id,
        createdAt: new Date(),
        createdBy: user?.id
      }));

      // Save all employees to Firestore
      const promises = employeesToSave.map(emp => addDoc(collection(db, 'employees'), emp));
      const docRefs = await Promise.all(promises);
      
      // Update local state with Firestore IDs
      const employeesWithIds = employeesToSave.map((emp, index) => ({
        ...emp,
        id: docRefs[index].id
      }));
      
      setEmployees(prev => [...prev, ...employeesWithIds]);
    } catch (error) {
      console.error('Error importing employees:', error);
      // Fallback to local state
      setEmployees(prev => [...prev, ...importedEmployees]);
    }
  };

  const getTemplateName = (templateId: string) => {
    const template = mockJobTemplates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  const handleExportCsv = () => {
    // Create CSV headers
    const headers = [
      'Name',
      'Email', 
      'Phone',
      'Role',
      'Department',
      'Tags',
      'Status',
      'Hire Date',
      'Salary Type',
      'Salary Rate',
      'Last Active'
    ];

    // Convert filtered employees to CSV rows
    const csvRows = filteredEmployees.map(employee => [
      employee.name,
      employee.email,
      employee.phone,
      employee.role,
      employee.department,
      (employee.tags || []).join('; '), // Join tags with semicolon
      employee.status,
      employee.hireDate,
      employee.salaryType,
      employee.salaryRate.toString(),
      employee.lastActive
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getHourlyRate = (employee: any) => {
    switch (employee.salaryType) {
      case 'hourly':
        return employee.salaryRate;
      case 'weekly':
        return employee.salaryRate / 40;
      case 'monthly':
        return employee.salaryRate / (40 * 4.33);
      case 'yearly':
        return employee.salaryRate / (40 * 52);
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'on_break':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`w-full ${language === 'he' ? 'text-right' : 'text-left'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
              <p className="text-gray-600 mt-1">Manage your team members and their information</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {filteredEmployees.length} of {employees.length} employees
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                    viewMode === 'card' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Card View
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List View
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {canManageEmployees && (
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowBulkAccessModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Access Details
                </button>
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Import Employees
                </button>
                <button 
                  onClick={handleExportCsv}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by name or role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
          </div>
          
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Employee Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleEmployeeClick(employee)}
              >
                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{employee.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{employee.role}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(employee.status)}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-gray-600 dark:text-gray-300">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{employee.department}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {employee.tags && employee.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Job Template Display */}
                {employee.assignedTemplate && (
                  <div className="mb-4">
                    <div className="flex items-center text-xs">
                      <Tag className="w-3 h-3 text-purple-500 mr-1" />
                      <span className="text-purple-600 font-medium">
                        Job Template: {getTemplateName(employee.assignedTemplate)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">${employee.salaryRate.toLocaleString()} / {employee.salaryType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Last active: {employee.lastActive}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {canManageEmployees && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(employee);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openInviteModal(employee);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Invite
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Job Template</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{employee.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        {employee.assignedTemplate ? (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            {getTemplateName(employee.assignedTemplate)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No template</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          ${employee.salaryRate.toLocaleString()} / {employee.salaryType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {canManageEmployees && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(employee)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openInviteModal(employee)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No employees found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or add your first employee to get started.
            </p>
            {canManageEmployees && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Employee
              </button>
            )}
          </div>
        )}

        {/* Employee Details Modal */}
        {showEmployeeModal && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                    <p className="text-gray-600">{selectedEmployee.role} • {selectedEmployee.department}</p>
                  </div>
                </div>
                <button
                  onClick={closeEmployeeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Work Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">Hired: {new Date(selectedEmployee.hireDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Employee Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.tags && selectedEmployee.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                  {(!selectedEmployee.tags || selectedEmployee.tags.length === 0) && (
                    <p className="text-gray-500">No tags assigned</p>
                  )}
                </div>
              </div>
              
              {/* Job Template Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Job Template</h3>
                {selectedEmployee.assignedTemplate ? (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">
                        {getTemplateName(selectedEmployee.assignedTemplate)}
                      </span>
                    </div>
                    <p className="text-sm text-purple-700">
                      This employee follows specific work rules defined by their job template.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">No job template assigned</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Consider assigning a template to enforce work rules automatically.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Salary Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Salary Rate:</span>
                    <span className="font-medium text-gray-900">${selectedEmployee.salaryRate.toLocaleString()} / {selectedEmployee.salaryType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hourly Equivalent:</span>
                    <span className="font-medium text-gray-900">${getHourlyRate(selectedEmployee).toFixed(2)}/hr</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeEmployeeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                
                {canManageEmployees && (
                  <>
                    <button
                      onClick={() => {
                        closeEmployeeModal();
                        openEditModal(selectedEmployee);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        closeEmployeeModal();
                        openInviteModal(selectedEmployee);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Invite
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Employee Modal */}
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
          employee={editingEmployee}
          isEditing={!!editingEmployee}
        />

        {/* Bulk Access Modal */}
        <BulkAccessModal
          isOpen={showBulkAccessModal}
          onClose={() => setShowBulkAccessModal(false)}
          employees={employees}
        />
        
        {/* Import Employees Modal */}
        <ImportEmployeesModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportEmployees}
        />

        {/* Invite Employee Modal */}
        {showInviteModal && selectedEmployee && (
          <InviteEmployeeModal
            isOpen={showInviteModal}
            onClose={closeInviteModal}
            employee={selectedEmployee}
          />
        )}
      </div>
    </div>
  );
}