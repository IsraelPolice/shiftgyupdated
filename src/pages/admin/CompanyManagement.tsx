import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Mail, 
  Building2,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useAuth, Company } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  const { companies, currentCompany, switchCompany, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not super admin
  useEffect(() => {
    if (!isSuperAdmin()) {
      navigate('/');
    }
  }, [isSuperAdmin, navigate]);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'active' && company.isActive) ||
                         (selectedStatus === 'inactive' && !company.isActive);
    
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const industries = [...new Set(companies.map(company => company.industry))];

  const toggleCompanyExpansion = (companyId: string) => {
    setExpandedCompanyId(expandedCompanyId === companyId ? null : companyId);
  };

  const handleSwitchCompany = (companyId: string) => {
    switchCompany(companyId);
    navigate('/');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getFeaturesList = (features: string[]) => {
    const featureNames: Record<string, string> = {
      'presence': 'Presence Tracking',
      'breaks': 'Break Management',
      'tasks': 'Task Management',
      'surveys': 'Employee Surveys',
      'advanced_reports': 'Advanced Reports'
    };
    
    return features.map(f => featureNames[f] || f).join(', ');
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'basic': return 'bg-blue-100 text-blue-700';
      case 'pro': return 'bg-purple-100 text-purple-700';
      case 'enterprise': return 'bg-green-100 text-green-700';
      case 'custom': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
          <p className="text-gray-600 mt-1">Manage all companies on the ShiftGY platform</p>
        </div>
        
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => navigate('/admin/companies/new')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Company Header */}
            <div 
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => toggleCompanyExpansion(company.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                    <Building2 className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {company.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(company.plan)}`}>
                        {company.plan.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>ID: {company.id}</span>
                      <span>•</span>
                      <span>{company.industry}</span>
                      {company.country && (
                        <>
                          <span>•</span>
                          <span>{company.country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchCompany(company.id);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Switch To
                  </button>
                  
                  {expandedCompanyId === company.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Expanded Company Details */}
            {expandedCompanyId === company.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Company Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      Company Details
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Company ID:</span>
                        <p className="font-medium text-gray-900">{company.id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Main Contact:</span>
                        <p className="font-medium text-gray-900">{company.mainContactName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Created:</span>
                        <p className="font-medium text-gray-900">{formatDate(company.createdAt)}</p>
                      </div>
                      {company.country && (
                        <div>
                          <span className="text-sm text-gray-500">Country:</span>
                          <p className="font-medium text-gray-900">{company.country}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Subscription Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Subscription Details
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Plan:</span>
                        <p className="font-medium text-gray-900">{company.plan.toUpperCase()}</p>
                      </div>
                      {company.trialEndDate && (
                        <div>
                          <span className="text-sm text-gray-500">Trial Ends:</span>
                          <p className="font-medium text-gray-900">{formatDate(company.trialEndDate)}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">Features:</span>
                        <p className="font-medium text-gray-900">{getFeaturesList(company.features)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p className="font-medium flex items-center gap-1">
                          {company.isActive ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-700">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-700">Inactive</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Actions</h4>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate(`/admin/companies/${company.id}/edit`)}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Company
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/companies/${company.id}/users`)}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        Manage Users
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/companies/${company.id}/subscription`)}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Manage Subscription
                      </button>
                      
                      <button
                        onClick={() => handleSwitchCompany(company.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Switch to Company
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}