import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Save, 
  X, 
  HelpCircle, 
  ArrowRight,
  Check,
  AlertTriangle,
  Download,
  Users,
  Palette,
  Info,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock tag data with colors
interface TagData {
  id: string;
  name: string;
  color: string;
  employeeCount: number;
  lastUsed: string | null;
  createdAt: string;
}

const initialTags: TagData[] = [
  { id: '1', name: 'Team 1', color: '#3B82F6', employeeCount: 5, lastUsed: '2024-01-15', createdAt: '2023-10-01' },
  { id: '2', name: 'Team 2', color: '#10B981', employeeCount: 3, lastUsed: '2024-01-18', createdAt: '2023-10-01' },
  { id: '3', name: 'Team 3', color: '#F59E0B', employeeCount: 4, lastUsed: '2024-01-10', createdAt: '2023-10-01' },
  { id: '4', name: 'Cashier', color: '#EF4444', employeeCount: 8, lastUsed: '2024-01-20', createdAt: '2023-09-15' },
  { id: '5', name: 'Team Lead', color: '#8B5CF6', employeeCount: 2, lastUsed: '2024-01-19', createdAt: '2023-09-15' },
  { id: '6', name: 'Trainer', color: '#06B6D4', employeeCount: 3, lastUsed: '2024-01-05', createdAt: '2023-09-15' },
  { id: '7', name: 'Inventory', color: '#84CC16', employeeCount: 2, lastUsed: '2024-01-12', createdAt: '2023-11-10' },
  { id: '8', name: 'Cook', color: '#F97316', employeeCount: 4, lastUsed: '2024-01-17', createdAt: '2023-11-20' },
  { id: '9', name: 'Server', color: '#EC4899', employeeCount: 0, lastUsed: null, createdAt: '2023-12-05' },
  { id: '10', name: 'Host', color: '#6366F1', employeeCount: 0, lastUsed: null, createdAt: '2023-12-05' }
];

const tagColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export default function TagsSettings() {
  const [tags, setTags] = useState<TagData[]>(initialTags);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(true);
  
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  
  const isAdmin = hasPermission('manage_employees') || hasPermission('view_all');
  
  // Filter and sort tags
  const filteredAndSortedTags = tags
    .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'count':
          comparison = a.employeeCount - b.employeeCount;
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  
  // Create a new tag
  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }
    
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      setError('A tag with this name already exists');
      return;
    }
    
    const newTag: TagData = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: newTagColor,
      employeeCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTags([...tags, newTag]);
    setNewTagName('');
    setNewTagColor(tagColors[0]);
    setShowCreateModal(false);
    setError('');
  };
  
  // Edit tag
  const handleEditTag = () => {
    if (!selectedTag) return;
    
    if (!newTagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }
    
    if (tags.some(tag => 
      tag.id !== selectedTag.id && 
      tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    )) {
      setError('A tag with this name already exists');
      return;
    }
    
    setTags(tags.map(tag => 
      tag.id === selectedTag.id 
        ? { ...tag, name: newTagName.trim(), color: newTagColor } 
        : tag
    ));
    
    setNewTagName('');
    setNewTagColor(tagColors[0]);
    setSelectedTag(null);
    setShowEditModal(false);
    setError('');
  };
  
  // Delete tag
  const handleDeleteTag = () => {
    if (!selectedTag) return;
    
    setTags(tags.filter(tag => tag.id !== selectedTag.id));
    setSelectedTag(null);
    setShowDeleteModal(false);
  };
  
  // Open edit modal
  const openEditModal = (tag: TagData) => {
    setSelectedTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setShowEditModal(true);
    setError('');
  };
  
  // Open delete modal
  const openDeleteModal = (tag: TagData) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };
  
  // Handle sort
  const handleSort = (column: 'name' | 'count' | 'created') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  // Export tags
  const handleExport = () => {
    const csvContent = [
      ['Tag Name', 'Color', 'Employee Count', 'Last Used', 'Created'],
      ...tags.map(tag => [
        tag.name,
        tag.color,
        tag.employeeCount.toString(),
        tag.lastUsed || 'Never',
        tag.createdAt
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee-tags.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Access Restricted</h3>
          <p className="text-gray-500">You don't have permission to manage tags</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Tags</h1>
                <p className="text-gray-600 mt-2">Organize and manage role tags used across your organization</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Tag
                </button>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [column, order] = e.target.value.split('-');
                      setSortBy(column as 'name' | 'count' | 'created');
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="count-desc">Most Used</option>
                    <option value="count-asc">Least Used</option>
                    <option value="created-desc">Newest</option>
                    <option value="created-asc">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Tag Name
                          {sortBy === 'name' && (
                            <div className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                              ↑
                            </div>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Color
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('count')}
                      >
                        <div className="flex items-center gap-2">
                          Employees
                          {sortBy === 'count' && (
                            <div className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                              ↑
                            </div>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Last Used
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedTags.map((tag, index) => (
                      <tr key={tag.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="font-medium text-gray-900">{tag.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-lg border border-gray-200 shadow-sm"
                              style={{ backgroundColor: tag.color }}
                            />
                            <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {tag.color}
                            </code>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{tag.employeeCount}</span>
                            {tag.employeeCount === 0 && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Unused
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">
                            {tag.lastUsed ? new Date(tag.lastUsed).toLocaleDateString() : 'Never'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(tag)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Tag"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(tag)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Tag"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredAndSortedTags.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Create your first tag to get started'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Tag
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Help Sidebar */}
          {showHelp && (
            <div className="w-80 hidden lg:block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    How Tags Work
                  </h3>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">What are Employee Tags?</h4>
                    <p>Tags help you organize employees by role, skill, or team assignment. They're essential for efficient shift scheduling.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Quick employee filtering during scheduling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Ensure right skills for each shift</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Organize teams and departments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Track employee specializations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Best Practices:</h4>
                    <ul className="space-y-1">
                      <li>• Use clear, descriptive names</li>
                      <li>• Assign distinct colors for easy recognition</li>
                      <li>• Keep tag names short and consistent</li>
                      <li>• Review and clean up unused tags regularly</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Tag Statistics:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Tags:</span>
                        <span className="font-medium">{tags.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Tags:</span>
                        <span className="font-medium">{tags.filter(t => t.employeeCount > 0).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Assignments:</span>
                        <span className="font-medium">{tags.reduce((sum, t) => sum + t.employeeCount, 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href="/support"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Documentation
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Tag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Tag</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTagName('');
                    setNewTagColor(tagColors[0]);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter tag name"
                    autoFocus
                  />
                  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tagColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          newTagColor === color ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: newTagColor }}
                    />
                    <span className="text-sm text-gray-600">Preview: {newTagName || 'Tag Name'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTagName('');
                    setNewTagColor(tagColors[0]);
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {showEditModal && selectedTag && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Tag</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setNewTagName('');
                    setNewTagColor(tagColors[0]);
                    setSelectedTag(null);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter tag name"
                  />
                  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tagColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          newTagColor === color ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">
                        This will update the tag across the entire system
                      </p>
                      <p className="text-sm text-yellow-700">
                        The tag will be updated for all {selectedTag.employeeCount} employees and any associated schedules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setNewTagName('');
                    setNewTagColor(tagColors[0]);
                    setSelectedTag(null);
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tag Modal */}
      {showDeleteModal && selectedTag && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Delete Tag</h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTag(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">
                        Are you sure you want to delete this tag?
                      </p>
                      <p className="text-sm text-red-700">
                        The tag <span className="font-medium">"{selectedTag.name}"</span> will be removed from {selectedTag.employeeCount} employees and any associated schedules.
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedTag.employeeCount > 0 && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      This tag is currently assigned to {selectedTag.employeeCount} employees.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Consider editing this tag instead of deleting it to maintain employee role assignments.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTag(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTag}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}