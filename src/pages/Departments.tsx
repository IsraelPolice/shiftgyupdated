import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function Departments() {
  const { language, isRTL } = useLanguage();
  const { currentCompany, user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAssignEmployeesModal, setShowAssignEmployeesModal] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);

  // Load employees for assignment
  useEffect(() => {
    const loadEmployees = async () => {
      if (!currentCompany?.id) return;

      try {
        // Load employees from localStorage (same source as Employees page)
        const localEmployees = JSON.parse(localStorage.getItem(`employees_${currentCompany.id}`) || '[]');
        setAvailableEmployees(localEmployees);
      } catch (error) {
        console.warn('Error loading employees:', error);
        setAvailableEmployees([]);
      }
    };

    loadEmployees();
  }, [currentCompany?.id]);

  const AssignEmployeesModal = () => {
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    if (!selectedDepartment) return null;

    // Filter employees not in this department
    const unassignedEmployees = availableEmployees.filter(emp => 
      emp.department !== selectedDepartment.name &&
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssignEmployees = async () => {
      if (selectedEmployees.length === 0) return;

      try {
        // Update employees' department
        const updatedEmployees = availableEmployees.map(emp => 
          selectedEmployees.includes(emp.id) 
            ? { ...emp, department: selectedDepartment.name }
            : emp
        );

        // Save to localStorage
        localStorage.setItem(`employees_${currentCompany.id}`, JSON.stringify(updatedEmployees));
        setAvailableEmployees(updatedEmployees);

        // Update department employee count
        const updatedDepartments = departments.map(dept => 
          dept.id === selectedDepartment.id 
            ? { ...dept, employeeCount: (dept.employeeCount || 0) + selectedEmployees.length }
            : dept
        );
        setDepartments(updatedDepartments);
        localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(updatedDepartments));

        setShowAssignEmployeesModal(false);
        setSelectedEmployees([]);
      } catch (error) {
        console.error('Error assigning employees:', error);
      }
    };

    const toggleEmployee = (employeeId) => {
      setSelectedEmployees(prev => 
        prev.includes(employeeId)
          ? prev.filter(id => id !== employeeId)
          : [...prev, employeeId]
      );
    };

    return (
      <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' 
                  ? `הוסף עובדים למחלקת ${selectedDepartment.name}`
                  : `Add Employees to ${selectedDepartment.name} Department`}
              </h2>
              <button 
                onClick={() => setShowAssignEmployeesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'he' ? 'חפש עובדים...' : 'Search employees...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unassignedEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'he' ? 'אין עובדים זמינים' : 'No Available Employees'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'he' 
                      ? 'כל העובדים כבר משויכים למחלקה זו או למחלקות אחרות'
                      : 'All employees are already assigned to this or other departments'}
                  </p>
                </div>
              ) : (
                unassignedEmployees.map(employee => (
                  <label
                    key={employee.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployee(employee.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.role}</div>
                        <div className="text-xs text-gray-400">
                          {language === 'he' ? 'מחלקה נוכחית:' : 'Current department:'} {employee.department}
                        </div>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAssignEmployeesModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </button>
              <button
                onClick={handleAssignEmployees}
                disabled={selectedEmployees.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'he' 
                  ? `הוסף ${selectedEmployees.length} עובדים`
                  : `Add ${selectedEmployees.length} Employee${selectedEmployees.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [departments, setDepartments] = useState([]);

  const canManageDepartments = hasPermission('manage_employees') || hasPermission('view_all');

  // Load departments from Firestore
  useEffect(() => {
    const loadDepartments = async () => {
      if (!currentCompany?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to load from Firestore first
        try {
          const departmentsQuery = query(
            collection(db, 'departments'),
            where('companyId', '==', currentCompany.id)
          );
          
          const snapshot = await getDocs(departmentsQuery);
          const firestoreDepartments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Also load from localStorage as fallback
          const localDepartments = JSON.parse(localStorage.getItem(`departments_${currentCompany.id}`) || '[]');
          
          // Combine and deduplicate (Firestore takes priority)
          const allDepartments = [...firestoreDepartments];
          localDepartments.forEach(localDept => {
            if (!firestoreDepartments.find(fsDept => fsDept.name === localDept.name)) {
              allDepartments.push(localDept);
            }
          });
          
          // Calculate employee counts for each department
          const departmentsWithCounts = allDepartments.map(dept => {
            const employeeCount = availableEmployees.filter(emp => emp.department === dept.name).length;
            return { ...dept, employeeCount };
          });
          
          setDepartments(departmentsWithCounts);
        } catch (firestoreError) {
          console.warn('Firestore access denied, loading from localStorage:', firestoreError);
          // Fallback to localStorage only
          const localDepartments = JSON.parse(localStorage.getItem(`departments_${currentCompany.id}`) || '[]');
          
          // Calculate employee counts for each department
          const departmentsWithCounts = localDepartments.map(dept => {
            const employeeCount = availableEmployees.filter(emp => emp.department === dept.name).length;
            return { ...dept, employeeCount };
          });
          
          setDepartments(departmentsWithCounts);
        }
      } catch (error) {
        console.warn('Error loading departments:', error);
        // Fallback to empty array for new companies
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, [currentCompany?.id, availableEmployees]);

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dept.nameHe && dept.nameHe.includes(searchTerm)) ||
                         dept.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dept.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // פונקציה לחישוב השבוע הנוכחי (ראשון עד שבת)
  const getCurrentWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = ראשון, 1 = שני, וכו'
    
    // חישוב תחילת השבוע (יום ראשון)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // חישוב סוף השבוע (יום שבת)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return {
      start: startOfWeek.toISOString().split('T')[0], // פורמט YYYY-MM-DD
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  // פונקציות ניווט
  const handleTotalEmployeesClick = () => {
    navigate('/employees');
  };

  const handleActiveShiftsClick = () => {
    const weekRange = getCurrentWeekRange();
    // ניווט לעמוד SCHEDULES עם טווח השבוע הנוכחי
    navigate(`/schedules?startDate=${weekRange.start}&endDate=${weekRange.end}&view=week`);
  };

  const handleViewDepartment = (department) => {
    // Navigate to employees page with department filter
    setSelectedDepartment(department.name);
    navigate('/employees', { 
      state: { 
        filterDepartment: department.name 
      } 
    });
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setShowEditModal(true);
  };

  const EditDepartmentModal = () => {
    const [formData, setFormData] = useState({
      name: editingDepartment?.name || '',
      nameHe: editingDepartment?.nameHe || '',
      description: editingDepartment?.description || '',
      descriptionHe: editingDepartment?.descriptionHe || '',
      manager: editingDepartment?.manager || '',
      location: editingDepartment?.location || '',
      locationHe: editingDepartment?.locationHe || '',
      email: editingDepartment?.email || '',
      phone: editingDepartment?.phone || '',
      color: editingDepartment?.color || 'blue'
    });

    const colorOptions = [
      { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
      { value: 'green', label: 'Green', class: 'bg-green-500' },
      { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
      { value: 'red', label: 'Red', class: 'bg-red-500' },
      { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
      { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' }
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) return;

      const updatedDepartment = {
        ...editingDepartment,
        ...formData,
        updatedAt: new Date(),
        updatedBy: user?.id
      };

      try {
        // Update in state
        setDepartments(prev => prev.map(dept => 
          dept.id === editingDepartment.id ? updatedDepartment : dept
        ));
        
        // Update in localStorage
        const updatedDepartments = departments.map(dept => 
          dept.id === editingDepartment.id ? updatedDepartment : dept
        );
        localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(updatedDepartments));
        
        setShowEditModal(false);
        setEditingDepartment(null);
      } catch (error) {
        console.error('Error updating department:', error);
      }
    };

    if (!showEditModal || !editingDepartment) return null;

    return (
      <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' ? 'ערוך מחלקה' : 'Edit Department'}
              </h2>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDepartment(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Department Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'שם מחלקה (אנגלית)' : 'Department Name (English)'} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sales"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'שם מחלקה (עברית)' : 'Department Name (Hebrew)'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="למשל: מכירות"
                    value={formData.nameHe}
                    onChange={(e) => setFormData({...formData, nameHe: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Manager and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מנהל מחלקה' : 'Department Manager'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'he' ? 'שם המנהל' : 'Manager name'}
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מיקום' : 'Location'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'he' ? 'מיקום המחלקה' : 'Department location'}
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'צבע מחלקה' : 'Department Color'}
                </label>
                <div className="flex gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({...formData, color: color.value})}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingDepartment(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {language === 'he' ? 'שמור שינויים' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleAddEmployeesToDepartment = (department) => {
    setSelectedDepartment(department);
    setShowAssignEmployeesModal(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק מחלקה זו?' : 'Are you sure you want to delete this department?')) {
      return;
    }

    try {
      // Remove from Firestore if possible
      try {
        await updateDoc(doc(db, 'departments', departmentId), { isActive: false });
      } catch (firestoreError) {
        console.warn('Could not update Firestore, updating locally:', firestoreError);
      }

      // Update local state
      setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
      
      // Update localStorage
      const updatedDepartments = departments.filter(dept => dept.id !== departmentId);
      localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(updatedDepartments));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const CreateDepartmentModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      nameHe: '',
      description: '',
      descriptionHe: '',
      manager: '',
      location: '',
      locationHe: '',
      email: '',
      phone: '',
      color: 'blue'
    });

    const colorOptions = [
      { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
      { value: 'green', label: 'Green', class: 'bg-green-500' },
      { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
      { value: 'red', label: 'Red', class: 'bg-red-500' },
      { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
      { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' }
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) return;

      const newDepartment = {
        id: Date.now().toString(),
        ...formData,
        companyId: currentCompany.id,
        employeeCount: 0,
        activeShifts: 0,
        status: 'active',
        lastActivity: 'Just created',
        createdAt: new Date(),
        createdBy: user?.id
      };

      try {
        // Try to save to Firestore
        try {
          const docRef = await addDoc(collection(db, 'departments'), newDepartment);
          const departmentWithFirestoreId = { ...newDepartment, id: docRef.id };
          setDepartments(prev => [...prev, departmentWithFirestoreId]);
          
          // Also save to localStorage as backup
          const existingDepartments = JSON.parse(localStorage.getItem(`departments_${currentCompany.id}`) || '[]');
          existingDepartments.push(departmentWithFirestoreId);
          localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(existingDepartments));
        } catch (firestoreError) {
          console.warn('Firestore permission denied, using local storage fallback:', firestoreError);
          setDepartments(prev => [...prev, newDepartment]);
          
          const existingDepartments = JSON.parse(localStorage.getItem(`departments_${currentCompany.id}`) || '[]');
          existingDepartments.push(newDepartment);
          localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(existingDepartments));
        }
        
        setShowCreateModal(false);
      } catch (error) {
        console.error('Error creating department:', error);
        setDepartments(prev => [...prev, newDepartment]);
        setShowCreateModal(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'he' ? 'יצירת מחלקה חדשה' : 'Create New Department'}
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Department Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'שם מחלקה (אנגלית)' : 'Department Name (English)'} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sales"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'שם מחלקה (עברית)' : 'Department Name (Hebrew)'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="למשל: מכירות"
                    value={formData.nameHe}
                    onChange={(e) => setFormData({...formData, nameHe: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Manager and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מנהל מחלקה' : 'Department Manager'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'he' ? 'שם המנהל' : 'Manager name'}
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מיקום' : 'Location'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'he' ? 'מיקום המחלקה' : 'Department location'}
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'צבע מחלקה' : 'Department Color'}
                </label>
                <div className="flex gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({...formData, color: color.value})}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {language === 'he' ? 'יצור מחלקה' : 'Create Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleCreateDepartment = async (formData) => {
    if (!currentCompany?.id) return;

    try {
      const newDepartment = {
        id: Date.now().toString(),
        ...formData,
        companyId: currentCompany.id,
        employeeCount: 0,
        activeShifts: 0,
        status: 'active',
        lastActivity: 'Just created',
        createdAt: new Date(),
        createdBy: user?.id
      };

      // Try to save to Firestore
      try {
        const docRef = await addDoc(collection(db, 'departments'), newDepartment);
        // Update local state with Firestore ID
        const departmentWithFirestoreId = { ...newDepartment, id: docRef.id };
        setDepartments(prev => [...prev, departmentWithFirestoreId]);
        
        // Also save to localStorage as backup
        const existingDepartments = JSON.parse(localStorage.getItem(`departments_${currentCompany.id}`) || '[]');
        existingDepartments.push(departmentWithFirestoreId);
        localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(existingDepartments));
      } catch (firestoreError) {
        console.warn('Firestore permission denied, using local storage fallback:', firestoreError);
        // Fallback to local state with generated ID
        setDepartments(prev => [...prev, newDepartment]);
        
        // Store in localStorage as backup
        const existingDepartments = JSON.parse(localStorage.getItem(`departments_${currentCompany.id}`) || '[]');
        existingDepartments.push(newDepartment);
        localStorage.setItem(`departments_${currentCompany.id}`, JSON.stringify(existingDepartments));
      }
      
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating department:', error);
      // Final fallback to local state
      const newDepartment = {
        id: Date.now().toString(),
        ...formData,
        companyId: currentCompany.id,
        employeeCount: 0,
        activeShifts: 0,
        status: 'active',
        lastActivity: 'Just created',
        createdAt: new Date(),
        createdBy: user?.id
      };
      setDepartments(prev => [...prev, newDepartment]);
      setShowCreateModal(false);
    }
  };

  return (
    <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'he' ? 'מחלקות' : 'Departments'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'he' ? 'נהל מחלקות הארגון ומידע הצוות' : 'Manage organization departments and team information'}
              </p>
            </div>
            {canManageDepartments && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                {language === 'he' ? 'הוסף מחלקה' : 'Add Department'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'סך מחלקות' : 'Total Departments'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleTotalEmployeesClick}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer text-left"
              aria-label={language === 'he' ? 'עבור לעמוד עובדים' : 'Go to employees page'}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'סך עובדים' : 'Total Employees'}</p>
                </div>
              </div>
            </button>
            <button 
              onClick={handleActiveShiftsClick}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer text-left"
              aria-label={language === 'he' ? 'עבור לעמוד לוחות זמנים - שבוע נוכחי' : 'Go to schedules page - current week'}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.reduce((sum, dept) => sum + (dept.activeShifts || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'משמרות פעילות' : 'Active Shifts'}</p>
                </div>
              </div>
            </button>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {departments.filter(d => d.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'he' ? 'מחלקות פעילות' : 'Active Departments'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={language === 'he' ? 'חפש מחלקות...' : 'Search departments...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'he' ? 'כל הסטטוסים' : 'All Statuses'}</option>
              <option value="active">{language === 'he' ? 'פעיל' : 'Active'}</option>
              <option value="warning">{language === 'he' ? 'אזהרה' : 'Warning'}</option>
            </select>
          </div>
        </div>

        {/* Departments Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map(department => (
              <div key={department.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                {/* Department Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${department.color || 'blue'}-100 rounded-lg flex items-center justify-center`}>
                        <Building2 className={`w-5 h-5 text-${department.color || 'blue'}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {language === 'he' ? (department.nameHe || department.name) : department.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            department.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                          }`} />
                          <span className="text-xs text-gray-500">
                            {department.status === 'active' 
                              ? (language === 'he' ? 'פעיל' : 'Active')
                              : (language === 'he' ? 'אזהרה' : 'Warning')
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {language === 'he' ? (department.descriptionHe || department.description || 'אין תיאור') : (department.description || 'No description')}
                  </p>
                </div>

                {/* Department Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{department.employeeCount || 0}</p>
                      <p className="text-xs text-gray-500">{language === 'he' ? 'עובדים' : 'Employees'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{department.activeShifts || 0}</p>
                      <p className="text-xs text-gray-500">{language === 'he' ? 'משמרות פעילות' : 'Active Shifts'}</p>
                    </div>
                  </div>

                  {/* Department Info */}
                  <div className="space-y-2 mb-4">
                    {department.manager && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{language === 'he' ? 'מנהל:' : 'Manager:'} {department.manager}</span>
                      </div>
                    )}
                    {department.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{language === 'he' ? (department.locationHe || department.location) : department.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'he' ? 'פעילות אחרונה:' : 'Last activity:'} {department.lastActivity || 'Never'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDepartment(department)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                      title={language === 'he' ? 'צפה בעובדי המחלקה' : 'View department employees'}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">{language === 'he' ? 'צפה' : 'View'}</span>
                    </button>
                    {canManageDepartments && (
                      <>
                        <button 
                          onClick={() => handleEditDepartment(department)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                          title={language === 'he' ? 'ערוך מחלקה' : 'Edit department'}
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">{language === 'he' ? 'ערוך' : 'Edit'}</span>
                        </button>
                        <button 
                          onClick={() => handleAddEmployeesToDepartment(department)}
                          className="flex-1 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                          title={language === 'he' ? 'הוסף עובדים למחלקה' : 'Add employees to department'}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">{language === 'he' ? 'הוסף' : 'Add'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' 
                ? (language === 'he' ? 'לא נמצאו מחלקות' : 'No departments found')
                : (language === 'he' ? 'אין מחלקות עדיין' : 'No departments yet')
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? (language === 'he' ? 'נסה לשנות את מונחי החיפוש או הסינון' : 'Try adjusting your search or filter criteria')
                : (language === 'he' ? 'התחל על ידי יצירת המחלקה הראשונה שלך' : 'Start by creating your first department')
              }
            </p>
            {canManageDepartments && !searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === 'he' ? 'צור מחלקה ראשונה' : 'Create First Department'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Department Modal */}
      {showCreateModal && <CreateDepartmentModal />}
      {/* Edit Department Modal */}
      <EditDepartmentModal />
      {showAssignEmployeesModal && <AssignEmployeesModal />}
    </div>
  );
}