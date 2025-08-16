import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  Check, 
  Download, 
  Info, 
  HelpCircle,
  Mail
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';

interface ImportEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (employees: any[]) => void;
}

interface EmployeeRow {
  fullName: string;
  email: string;
  department: string;
  phone?: string;
  jobTitle?: string;
  notes?: string;
  isAdmin?: boolean;
  isManager?: boolean;
  isValid: boolean;
  errors: string[];
}

export default function ImportEmployeesModal({ isOpen, onClose, onImport }: ImportEmployeesModalProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<EmployeeRow[]>([]);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { t } = useLanguage();
  const { currentCompany } = useAuth();
  
  // Mock company plan details
  const companyPlan = {
    name: 'Pro',
    employeeLimit: 50,
    currentEmployeeCount: 42
  };
  
  const validEmployees = parsedData.filter(row => row.isValid);
  const invalidEmployees = parsedData.filter(row => !row.isValid);
  const willExceedLimit = (companyPlan.currentEmployeeCount + validEmployees.length) > companyPlan.employeeLimit;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx')) {
        setUploadError('Please upload an Excel (.xlsx) file');
        return;
      }
      
      setFile(selectedFile);
      setUploadError(null);
      parseExcelFile(selectedFile);
    }
  };
  
  const parseExcelFile = async (file: File) => {
    setIsUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      
      // Skip the header row
      const rows = jsonData.slice(1) as any[][];
      
      const parsedRows: EmployeeRow[] = rows.map(row => {
        const fullName = row[0]?.toString().trim() || '';
        const email = row[1]?.toString().trim() || '';
        const department = row[2]?.toString().trim() || '';
        const isAdmin = row[3]?.toString().trim().toLowerCase() === 'v';
        const isManager = row[4]?.toString().trim().toLowerCase() === 'v';
        const phone = row[5]?.toString().trim() || '';
        const jobTitle = row[6]?.toString().trim() || '';
        const notes = row[7]?.toString().trim() || '';
        
        const errors: string[] = [];
        
        // Validate required fields
        if (!fullName) errors.push('Missing full name');
        if (!email) errors.push('Missing email');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format');
        if (!department) errors.push('Missing department');
        
        return {
          fullName,
          email,
          department,
          phone,
          jobTitle,
          notes,
          isAdmin,
          isManager,
          isValid: errors.length === 0,
          errors
        };
      });
      
      setParsedData(parsedRows.filter(row => row.fullName || row.email || row.department));
      setStep(2);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      setUploadError('Failed to parse the Excel file. Please check the format and try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      setFile(droppedFile);
      setUploadError(null);
      parseExcelFile(droppedFile);
    } else {
      setUploadError('Please upload an Excel (.xlsx) file');
    }
  };
  
  const handleDownloadTemplate = () => {
    // Create a simple Excel template
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Full Name', 'Email', 'Department Name', 'Admin', 'Manager', 'Phone', 'Job Title', 'Notes'],
      ['John Doe', 'john.doe@company.com', 'Sales', '', 'V', '+1 (555) 123-4567', 'Sales Associate', 'Started June 2023'],
      ['Jane Smith', 'jane.smith@company.com', 'Operations', 'V', '', '+1 (555) 987-6543', 'Operations Manager', '']
    ]);
    
    // Set column widths
    const wscols = [
      { wch: 20 }, // Full Name
      { wch: 25 }, // Email
      { wch: 20 }, // Department
      { wch: 10 }, // Admin
      { wch: 10 }, // Manager
      { wch: 15 }, // Phone
      { wch: 20 }, // Job Title
      { wch: 30 }  // Notes
    ];
    
    worksheet['!cols'] = wscols;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    
    // Generate and download the file
    XLSX.writeFile(workbook, 'employee_import_template.xlsx');
  };
  
  const handleContinue = () => {
    if (willExceedLimit) {
      setStep(3);
    } else {
      handleFinalImport();
    }
  };
  
  const handleFinalImport = () => {
    // Convert the valid parsed data to the format expected by the onImport callback
    const employeesToImport = validEmployees.map(employee => ({
      name: employee.fullName,
      email: employee.email,
      department: employee.department,
      phone: employee.phone || '',
      role: employee.isAdmin ? 'admin' : employee.isManager ? 'manager' : 'employee',
      jobTitle: employee.jobTitle || '',
      notes: employee.notes || '',
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      salaryType: 'hourly',
      salaryRate: 15.00,
      requireClockInOut: true
    }));
    
    // Log the import to the database
    const importLog = {
      id: Date.now().toString(),
      uploadedBy: 'current-user',
      companyId: currentCompany?.id || '',
      totalRows: parsedData.length,
      validRows: validEmployees.length,
      skippedRows: invalidEmployees.length,
      createdAt: new Date()
    };
    
    console.log('Import log:', importLog);
    
    // Call the onImport callback with the processed data
    onImport(employeesToImport);
    
    // Close the modal
    onClose();
  };
  
  const resetForm = () => {
    setFile(null);
    setParsedData([]);
    setStep(1);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Import Employees from List</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: File Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Excel File</h3>
                  <p className="text-sm text-gray-500">Upload an Excel file with employee information</p>
                </div>
              </div>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx"
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Drag and drop your file here</h4>
                <p className="text-gray-500 mb-4">or click to browse your files</p>
                <p className="text-sm text-gray-400">Accepts Excel (.xlsx) files only</p>
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-blue-600 mt-2">Processing file...</p>
                  </div>
                )}
                
                {uploadError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">File Format Instructions</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Your Excel file should have the following columns:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 mb-3">
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <strong>Required:</strong> Full Name, Email, Department Name
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <strong>Optional:</strong> Phone, Job Title, Notes
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <strong>Permissions:</strong> Admin (V), Manager (V)
                      </li>
                    </ul>
                    <button
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Sample Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Preview and Validation */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Preview and Validate</h3>
                  <p className="text-sm text-gray-500">Review the parsed employee data before importing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500">Total Rows</p>
                  <p className="text-2xl font-bold text-gray-900">{parsedData.length}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-700">Valid Employees</p>
                  <p className="text-2xl font-bold text-green-700">{validEmployees.length}</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-700">Skipped Rows</p>
                  <p className="text-2xl font-bold text-red-700">{invalidEmployees.length}</p>
                </div>
              </div>
              
              {/* Preview Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          Full Name
                          <div className="group relative">
                            <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                              Required field
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          Email
                          <div className="group relative">
                            <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                              Required field
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          Department
                          <div className="group relative">
                            <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                              Required field
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.map((row, index) => (
                        <tr key={index} className={row.isValid ? '' : 'bg-red-50'}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.isValid ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="w-3 h-3 mr-1" />
                                Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <X className="w-3 h-3 mr-1" />
                                Invalid
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{row.fullName || '—'}</div>
                              {!row.fullName && !row.isValid && (
                                <div className="text-xs text-red-600">Missing name</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{row.email || '—'}</div>
                              {!row.email && !row.isValid && (
                                <div className="text-xs text-red-600">Missing email</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{row.department || '—'}</div>
                              {!row.department && !row.isValid && (
                                <div className="text-xs text-red-600">Missing department</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              row.isAdmin 
                                ? 'bg-purple-100 text-purple-800' 
                                : row.isManager
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {row.isAdmin ? 'Admin' : row.isManager ? 'Manager' : 'Employee'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {row.phone || '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {row.jobTitle || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {parsedData.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No data found in the uploaded file</p>
                  </div>
                )}
              </div>
              
              {invalidEmployees.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Attention Required</h4>
                      <p className="text-sm text-yellow-700">
                        {invalidEmployees.length} row(s) will be skipped due to missing required information.
                        Please fix the issues in your Excel file and upload again if needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="sendWelcomeEmail"
                  checked={sendWelcomeEmail}
                  onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendWelcomeEmail" className="text-sm text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Send welcome email to new employees
                </label>
              </div>
            </div>
          )}
          
          {/* Step 3: Plan Validation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Subscription Plan Limit</h3>
                  <p className="text-sm text-gray-500">Adding these employees will exceed your current plan limit</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-yellow-900 mb-4">Plan Limit Exceeded</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Current employee count:</span>
                    <span className="font-medium text-yellow-900">{companyPlan.currentEmployeeCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Employees to add:</span>
                    <span className="font-medium text-yellow-900">+{validEmployees.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">New total:</span>
                    <span className="font-medium text-yellow-900">{companyPlan.currentEmployeeCount + validEmployees.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Your plan limit:</span>
                    <span className="font-medium text-yellow-900">{companyPlan.employeeLimit}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-800">Exceeding by:</span>
                    <span className="font-medium text-red-600">
                      {companyPlan.currentEmployeeCount + validEmployees.length - companyPlan.employeeLimit} employees
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-gray-900 font-medium mb-4">
                    You are about to upload {validEmployees.length} new employees, which exceeds your current subscription. You may:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-blue-700 text-xs">1</span>
                      </div>
                      <p className="text-gray-700">Upgrade your plan</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-blue-700 text-xs">2</span>
                      </div>
                      <p className="text-gray-700">Pay $1.50 per extra employee</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-blue-700 text-xs">3</span>
                      </div>
                      <p className="text-gray-700">Cancel the upload</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          {step === 1 ? (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          
          {step === 1 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Select File'}
            </button>
          )}
          
          {step === 2 && (
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={validEmployees.length === 0}
            >
              {willExceedLimit ? 'Continue' : `Import ${validEmployees.length} Employees`}
            </button>
          )}
          
          {step === 3 && (
            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel Upload
              </button>
              
              <button
                onClick={() => {/* Would navigate to upgrade page */}}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade Plan
              </button>
              
              <button
                onClick={handleFinalImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue & Pay Extra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}