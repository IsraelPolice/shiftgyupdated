import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Book, 
  Key, 
  Globe,
  Check,
  Download
} from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  headers?: Record<string, string>;
  parameters?: Record<string, any>;
  body?: Record<string, any>;
  response: Record<string, any>;
  errorResponse: Record<string, any>;
  category: string;
}

const apiEndpoints: ApiEndpoint[] = [
  // Authentication
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user and return JWT token',
    category: 'Authentication',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      email: 'admin@shiftgy.com',
      password: 'password'
    },
    response: {
      success: true,
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '1',
          email: 'admin@shiftgy.com',
          name: 'Sarah Johnson',
          role: 'admin',
          department: 'Management',
          permissions: ['view_all', 'manage_employees']
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'Invalid credentials'
    }
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register new user account',
    category: 'Authentication',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      email: 'user@company.com',
      password: 'securepassword',
      name: 'John Doe',
      role: 'employee',
      department: 'Sales'
    },
    response: {
      success: true,
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '2',
          email: 'user@company.com',
          name: 'John Doe',
          role: 'employee',
          department: 'Sales'
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'User already exists'
    }
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get current user profile',
    category: 'Authentication',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    response: {
      success: true,
      data: {
        user: {
          id: '1',
          email: 'admin@shiftgy.com',
          name: 'Sarah Johnson',
          role: 'admin',
          department: 'Management'
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'Invalid token'
    }
  },
  // Employees
  {
    method: 'GET',
    path: '/api/employees',
    description: 'Get all employees with optional filtering',
    category: 'Employees',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    parameters: {
      department: 'Sales (optional)',
      status: 'active (optional)',
      search: 'john (optional)'
    },
    response: {
      success: true,
      data: {
        employees: [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            role: 'Manager',
            department: 'Sales',
            status: 'active'
          }
        ],
        total: 1
      }
    },
    errorResponse: {
      success: false,
      message: 'Access denied'
    }
  },
  {
    method: 'GET',
    path: '/api/employees/:id',
    description: 'Get employee by ID',
    category: 'Employees',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    parameters: {
      id: 'Employee ID (path parameter)'
    },
    response: {
      success: true,
      data: {
        employee: {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          phone: '+1 (555) 123-4567',
          role: 'Manager',
          department: 'Sales',
          location: 'Store #1',
          status: 'active',
          hireDate: '2022-03-15',
          salaryType: 'yearly',
          salaryRate: 65000
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'Employee not found'
    }
  },
  {
    method: 'POST',
    path: '/api/employees',
    description: 'Create new employee (Admin/Manager only)',
    category: 'Employees',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      name: 'John Doe',
      email: 'john@company.com',
      phone: '+1 (555) 987-6543',
      role: 'Sales Associate',
      department: 'Sales',
      location: 'Store #2',
      hireDate: '2024-01-20',
      salaryType: 'hourly',
      salaryRate: 18.50,
      requireClockInOut: true
    },
    response: {
      success: true,
      data: {
        employee: {
          id: '3',
          name: 'John Doe',
          email: 'john@company.com',
          role: 'Sales Associate',
          department: 'Sales',
          status: 'active'
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'Employee with this email already exists'
    }
  },
  // Presence/Clock In-Out
  {
    method: 'GET',
    path: '/api/presence',
    description: 'Get presence logs with optional filtering',
    category: 'Presence',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    parameters: {
      employeeId: '1 (optional)',
      date: '2024-01-20 (optional)',
      status: 'active|completed (optional)'
    },
    response: {
      success: true,
      data: {
        logs: [
          {
            id: '1',
            employeeId: '1',
            clockInTime: '2024-01-20T09:00:00Z',
            clockOutTime: '2024-01-20T17:00:00Z',
            totalMinutes: 480,
            method: 'manual',
            location: 'Store #1'
          }
        ],
        total: 1
      }
    },
    errorResponse: {
      success: false,
      message: 'Access denied'
    }
  },
  {
    method: 'POST',
    path: '/api/presence/clock-in',
    description: 'Clock in employee',
    category: 'Presence',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      employeeId: '1',
      method: 'manual',
      location: 'Store #1'
    },
    response: {
      success: true,
      data: {
        log: {
          id: '2',
          employeeId: '1',
          clockInTime: '2024-01-20T09:00:00Z',
          method: 'manual',
          location: 'Store #1'
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'Employee is already clocked in'
    }
  },
  {
    method: 'POST',
    path: '/api/presence/clock-out',
    description: 'Clock out employee',
    category: 'Presence',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: {
      employeeId: '1'
    },
    response: {
      success: true,
      data: {
        log: {
          id: '2',
          employeeId: '1',
          clockInTime: '2024-01-20T09:00:00Z',
          clockOutTime: '2024-01-20T17:00:00Z',
          totalMinutes: 480,
          method: 'manual',
          location: 'Store #1'
        }
      }
    },
    errorResponse: {
      success: false,
      message: 'No active clock-in found for employee'
    }
  }
];

const categories = [...new Set(apiEndpoints.map(endpoint => endpoint.category))];

export default function ApiDocumentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || endpoint.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleEndpoint = (endpointKey: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(endpointKey)) {
      newExpanded.delete(endpointKey);
    } else {
      newExpanded.add(endpointKey);
    }
    setExpandedEndpoints(newExpanded);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(`${type}-${Date.now()}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateCurlExample = (endpoint: ApiEndpoint) => {
    let curl = `curl -X ${endpoint.method} "${window.location.origin}${endpoint.path}"`;
    
    if (endpoint.headers) {
      Object.entries(endpoint.headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }
    
    if (endpoint.body) {
      curl += ` \\\n  -d '${JSON.stringify(endpoint.body, null, 2)}'`;
    }
    
    return curl;
  };

  const generateJavaScriptExample = (endpoint: ApiEndpoint) => {
    const options: any = {
      method: endpoint.method,
      headers: endpoint.headers || {}
    };
    
    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }
    
    return `fetch('${window.location.origin}${endpoint.path}', ${JSON.stringify(options, null, 2)})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
  };

  const methodColors = {
    GET: 'bg-green-100 text-green-700 border-green-200',
    POST: 'bg-blue-100 text-blue-700 border-blue-200',
    PUT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">API Documentation</h2>
            <p className="text-sm text-gray-500">Complete REST API reference for ShiftGY platform</p>
          </div>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>

      {/* API Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Base URL</p>
              <p className="text-sm text-blue-700 font-mono">{window.location.origin}/api</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Authentication</p>
              <p className="text-sm text-blue-700">Bearer Token (JWT)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Format</p>
              <p className="text-sm text-blue-700">JSON</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        {filteredEndpoints.map((endpoint, index) => {
          const endpointKey = `${endpoint.method}-${endpoint.path}`;
          const isExpanded = expandedEndpoints.has(endpointKey);
          
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleEndpoint(endpointKey)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${methodColors[endpoint.method]}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                    <span className="text-sm text-gray-600">{endpoint.description}</span>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Request</h4>
                      
                      {endpoint.headers && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Headers</h5>
                          <div className="bg-white rounded-lg p-3 border">
                            <pre className="text-xs text-gray-800 font-mono">
                              {JSON.stringify(endpoint.headers, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {endpoint.parameters && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Parameters</h5>
                          <div className="bg-white rounded-lg p-3 border">
                            <pre className="text-xs text-gray-800 font-mono">
                              {JSON.stringify(endpoint.parameters, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {endpoint.body && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Request Body</h5>
                          <div className="bg-white rounded-lg p-3 border">
                            <pre className="text-xs text-gray-800 font-mono">
                              {JSON.stringify(endpoint.body, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Response Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Response</h4>
                      
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2">Success Response (200)</h5>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <pre className="text-xs text-gray-800 font-mono">
                            {JSON.stringify(endpoint.response, null, 2)}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-red-700 mb-2">Error Response</h5>
                        <div className="bg-white rounded-lg p-3 border border-red-200">
                          <pre className="text-xs text-gray-800 font-mono">
                            {JSON.stringify(endpoint.errorResponse, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Examples */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Code Examples</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* cURL Example */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-700">cURL</h5>
                          <button
                            onClick={() => copyToClipboard(generateCurlExample(endpoint), 'curl')}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            {copiedCode?.startsWith('curl') ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy
                          </button>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                          <pre className="text-xs text-green-400 font-mono">
                            {generateCurlExample(endpoint)}
                          </pre>
                        </div>
                      </div>

                      {/* JavaScript Example */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-700">JavaScript (Fetch)</h5>
                          <button
                            onClick={() => copyToClipboard(generateJavaScriptExample(endpoint), 'js')}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            {copiedCode?.startsWith('js') ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy
                          </button>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                          <pre className="text-xs text-blue-400 font-mono">
                            {generateJavaScriptExample(endpoint)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredEndpoints.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No endpoints found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}