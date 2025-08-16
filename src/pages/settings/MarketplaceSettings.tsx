import React, { useState } from 'react';
import { 
  Grid, 
  Search, 
  Filter, 
  ExternalLink, 
  Lock, 
  Check, 
  X, 
  AlertTriangle, 
  Info,
  Settings,
  RefreshCw,
  Calendar,
  MessageSquare,
  Zap,
  Database
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'connected' | 'disconnected' | 'premium';
  isPopular: boolean;
  lastSync?: string;
}

export default function MarketplaceSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showIntegrationDetails, setShowIntegrationDetails] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const isAdmin = hasPermission('manage_employees') || hasPermission('view_all');
  
  // Mock integrations data
  const integrations: Integration[] = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync shifts with Google Calendar for better visibility and scheduling',
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      category: 'calendar', 
      status: 'connected',
      isPopular: true,
      lastSync: '2 hours ago',
      explanation: {
        en: 'Automatically sync your ShiftGY schedules with Google Calendar. When shifts are created, updated, or deleted in ShiftGY, these changes will be reflected in your Google Calendar. This integration helps employees keep track of their work schedule alongside their personal calendar events.',
        he: 'סנכרן אוטומטית את לוחות הזמנים של ShiftGY עם יומן Google. כאשר משמרות נוצרות, מעודכנות או נמחקות ב-ShiftGY, שינויים אלה ישתקפו ביומן Google שלך. אינטגרציה זו עוזרת לעובדים לעקוב אחר לוח הזמנים של העבודה שלהם לצד אירועי היומן האישי שלהם.'
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send shift notifications and alerts to Slack channels',
      icon: <MessageSquare className="w-6 h-6 text-green-600" />,
      category: 'communication',
      status: 'disconnected',
      isPopular: true,
      explanation: {
        en: 'Connect ShiftGY with Slack to send automated notifications about schedule changes, shift reminders, and time-off approvals directly to your team\'s Slack channels. This integration improves communication and ensures everyone stays informed about important updates.',
        he: 'חבר את ShiftGY עם Slack כדי לשלוח התראות אוטומטיות על שינויים בלוח הזמנים, תזכורות משמרת ואישורי חופשה ישירות לערוצי Slack של הצוות שלך. אינטגרציה זו משפרת את התקשורת ומבטיחה שכולם נשארים מעודכנים לגבי עדכונים חשובים.'
      }
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect ShiftGY to 3000+ apps without coding',
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      category: 'automation',
      status: 'disconnected', 
      explanation: {
        en: 'Zapier allows you to connect ShiftGY with thousands of other apps without writing any code. Create automated workflows that trigger actions in other systems when events happen in ShiftGY, such as creating tasks in project management tools when new shifts are assigned.',
        he: 'Zapier מאפשר לך לחבר את ShiftGY לאלפי אפליקציות אחרות מבלי לכתוב קוד. צור זרימות עבודה אוטומטיות שמפעילות פעולות במערכות אחרות כאשר אירועים מתרחשים ב-ShiftGY, כגון יצירת משימות בכלי ניהול פרויקטים כאשר משמרות חדשות מוקצות.'
      },
      isPopular: true
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Sync shifts with Outlook Calendar',
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      category: 'calendar', 
      explanation: {
        en: 'Integrate ShiftGY with Microsoft Outlook to automatically sync work schedules with your Outlook Calendar. This integration is perfect for organizations using Microsoft 365, allowing employees to see their shifts alongside their meetings and appointments in Outlook.',
        he: 'שלב את ShiftGY עם Microsoft Outlook כדי לסנכרן אוטומטית את לוחות הזמנים של העבודה עם יומן Outlook שלך. אינטגרציה זו מושלמת לארגונים המשתמשים ב-Microsoft 365, ומאפשרת לעובדים לראות את המשמרות שלהם לצד הפגישות והתורים שלהם ב-Outlook.'
      },
      status: 'disconnected',
      isPopular: false
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Export shift data into billing & payroll',
      icon: <Database className="w-6 h-6 text-purple-600" />, 
      explanation: {
        en: 'The QuickBooks integration allows you to export time tracking data directly to QuickBooks for payroll processing. This eliminates manual data entry, reduces errors, and streamlines your payroll process by ensuring accurate hours are reflected in employee paychecks.',
        he: 'אינטגרציית QuickBooks מאפשרת לך לייצא נתוני מעקב זמן ישירות ל-QuickBooks לעיבוד שכר. זה מבטל הזנת נתונים ידנית, מפחית שגיאות ומייעל את תהליך השכר שלך על ידי הבטחת שעות מדויקות משתקפות בתלושי השכר של העובדים.'
      },
      category: 'payroll',
      status: 'premium',
      isPopular: false
    },
    {
      id: 'gusto',
      name: 'Gusto',
      description: 'Sync attendance to payroll in real time', 
      explanation: {
        en: 'The Gusto integration synchronizes employee hours and attendance data with Gusto\'s payroll platform in real-time. This ensures that your payroll is always accurate and up-to-date, saving time and reducing errors in the payroll process.',
        he: 'אינטגרציית Gusto מסנכרנת שעות עובדים ונתוני נוכחות עם פלטפורמת השכר של Gusto בזמן אמת. זה מבטיח שהשכר שלך תמיד מדויק ומעודכן, חוסך זמן ומפחית שגיאות בתהליך השכר.'
      },
      icon: <Database className="w-6 h-6 text-purple-600" />,
      category: 'payroll',
      status: 'premium',
      isPopular: false
    },
    {
      id: 'bamboohr',
      name: 'BambooHR', 
      explanation: {
        en: 'Connect ShiftGY with BambooHR to synchronize employee data, time off requests, and organizational structure. This integration ensures that your scheduling system always has the most up-to-date employee information and approved time off.',
        he: 'חבר את ShiftGY עם BambooHR כדי לסנכרן נתוני עובדים, בקשות חופשה ומבנה ארגוני. אינטגרציה זו מבטיחה שמערכת התזמון שלך תמיד מכילה את המידע העדכני ביותר על העובדים וחופשות מאושרות.'
      },
      description: 'Sync roles, leave types, org chart',
      icon: <Database className="w-6 h-6 text-purple-600" />,
      category: 'hr',
      status: 'premium',
      isPopular: false
    },
    {
      id: 'monday', 
      explanation: {
        en: 'The Monday.com integration allows you to automatically create and assign tasks in Monday.com based on shifts in ShiftGY. This helps teams coordinate work activities that need to be completed during specific shifts, improving productivity and accountability.',
        he: 'אינטגרציית Monday.com מאפשרת לך ליצור ולהקצות משימות ב-Monday.com באופן אוטומטי בהתבסס על משמרות ב-ShiftGY. זה עוזר לצוותים לתאם פעילויות עבודה שצריך להשלים במהלך משמרות ספציפיות, משפר את הפרודוקטיביות והאחריותיות.'
      },
      name: 'Monday.com',
      description: 'Create tasks per shift in PM system',
      icon: <Database className="w-6 h-6 text-purple-600" />,
      category: 'project',
      status: 'premium',
      isPopular: false
    }
  ];

  
  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'communication', name: 'Communication' },
    { id: 'automation', name: 'Automation' },
    { id: 'payroll', name: 'Payroll' },
    { id: 'hr', name: 'HR Systems' },
    { id: 'project', name: 'Project Management' }
  ];
  
  // Filter integrations based on search and category
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Handle connect button click
  const handleConnect = (integrationId: string) => {
    // In a real app, this would initiate OAuth flow or API key setup
    alert(`Connecting to ${integrationId}...`);
  };
  
  const handleDisconnect = (integrationId: string) => {
    if (confirm('Are you sure you want to disconnect this integration? This may affect any automated workflows.')) {
      // In a real app, this would revoke tokens and update status
      alert(`Disconnected from ${integrationId}`);
    }
  };
  
  const handleShowDetails = (integrationId: string) => {
    setShowIntegrationDetails(integrationId);
  };
  
  const handleCloseDetails = () => {
    setShowIntegrationDetails(null);
  };
  
  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };
  
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };
  
  // Get the explanation text based on current language
  const getExplanationText = (integration: any) => {
    if (!integration.explanation) return '';
    return language === 'he' ? integration.explanation.he : integration.explanation.en;
  };
  
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Grid className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">You don't have permission to manage integrations</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">Connect ShiftGY with your favorite tools and services</p>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Popular Integrations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Integrations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredIntegrations
            .filter(integration => integration.isPopular)
            .map(integration => (
              <div 
                key={integration.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-xs text-gray-500">{integration.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    {integration.status === 'connected' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </span>
                    ) : integration.status === 'premium' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Lock className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                
                <div className="flex justify-between items-center">
                  {integration.status === 'connected' ? (
                    <div className="text-xs text-gray-500">
                      Last sync: {integration.lastSync}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShowDetails(integration.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    
                    {integration.status === 'connected' ? (
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Disconnect
                      </button>
                    ) : integration.status === 'premium' ? (
                      <button
                        onClick={handleUpgrade}
                        className="px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        Upgrade
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* All Integrations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Integrations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredIntegrations
            .filter(integration => !integration.isPopular)
            .map(integration => (
              <div 
                key={integration.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-xs text-gray-500">{integration.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    {integration.status === 'connected' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </span>
                    ) : integration.status === 'premium' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Lock className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                
                <div className="flex justify-between items-center">
                  {integration.status === 'connected' ? (
                    <div className="text-xs text-gray-500">
                      Last sync: {integration.lastSync}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShowDetails(integration.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    
                    {integration.status === 'connected' ? (
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Disconnect
                      </button>
                    ) : integration.status === 'premium' ? (
                      <button
                        onClick={handleUpgrade}
                        className="px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        Upgrade
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* No Results */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Integration Details Modal */}
      {showIntegrationDetails && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {(() => {
              const integration = integrations.find(i => i.id === showIntegrationDetails);
              if (!integration) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {integration.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{integration.name}</h2>
                        <p className="text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseDetails}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Integration Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Status</p>
                        <p className="text-sm text-gray-600">
                          {integration.status === 'connected' 
                            ? 'Connected and working properly' 
                            : integration.status === 'premium'
                              ? 'Premium integration (requires upgrade)'
                              : 'Not connected'}
                        </p>
                      </div>
                      <div>
                        {integration.status === 'connected' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            <Check className="w-4 h-4 mr-1" />
                            Connected
                          </span>
                        ) : integration.status === 'premium' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                            <Lock className="w-4 h-4 mr-1" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                            Disconnected
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Integration Details */}
                    <div>
                      {/* Integration Explanation */}
                      {integration.explanation && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 rtl-content">
                          <h4 className="font-medium text-blue-900 mb-2">About this Integration</h4>
                          <p className="text-blue-800">
                            {getExplanationText(integration)}
                          </p>
                        </div>
                      )}
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Details</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">Category</p>
                            <p className="text-base text-gray-900 capitalize">{integration.category}</p>
                          </div>
                          
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">Last Sync</p>
                            <p className="text-base text-gray-900">
                              {integration.lastSync || 'Never synced'}
                            </p>
                          </div>
                        </div>
                        
                        {integration.status === 'connected' && (
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700">Connection Details</p>
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                <RefreshCw className="w-4 h-4 inline mr-1" />
                                Refresh Token
                              </button>
                            </div>
                            <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-600 break-all">
                              Connected via OAuth • Token expires in 29 days
                            </div>
                          </div>
                        )}
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Permissions Required</p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500" />
                              Read calendar events
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500" />
                              Create calendar events
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500" />
                              Update calendar events
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Integration Settings */}
                    {integration.status === 'connected' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Auto-sync shifts</p>
                              <p className="text-sm text-gray-500">Automatically sync shifts to calendar</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked={true}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Sync frequency</p>
                              <p className="text-sm text-gray-500">How often to sync data</p>
                            </div>
                            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="realtime">Real-time</option>
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleCloseDetails}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      
                      {integration.status === 'connected' ? (
                        <button
                          onClick={() => handleDisconnect(integration.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : integration.status === 'premium' ? (
                        <button
                          onClick={handleUpgrade}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Upgrade to Connect
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(integration.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Upgrade Required</h3>
              </div>
              <button
                onClick={closeUpgradeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                This integration is available on our Advanced plan. Upgrade to access premium integrations and more features.
              </p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Advanced Plan Includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-purple-800">All premium integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-purple-800">Advanced reporting and analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-purple-800">Priority support</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(4)}<span className="text-sm font-normal text-gray-600">/user/month</span></p>
                <p className="text-sm text-gray-500">Billed annually</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={closeUpgradeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}