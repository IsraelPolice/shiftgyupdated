import React from 'react';
import { 
  Grid, 
  Code, 
  Zap, 
  Database, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Lock,
  Check
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ApiCategoryProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  isPremium?: boolean;
}

const ApiCategory: React.FC<ApiCategoryProps> = ({ title, description, icon, benefits, isPremium = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {isPremium && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-700">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ApiMarketplaceExplanation() {
  const { t } = useLanguage();
  
  const apiCategories = [
    {
      title: "Employee Management APIs",
      description: "Programmatically manage employee data and permissions",
      icon: <Database className="w-6 h-6 text-blue-600" />,
      benefits: [
        "Create, update, and manage employee profiles via API",
        "Bulk import employees from external systems",
        "Synchronize employee data with HR systems",
        "Manage role-based permissions programmatically"
      ]
    },
    {
      title: "Scheduling APIs",
      description: "Automate shift creation and management",
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      benefits: [
        "Create and publish schedules programmatically",
        "Implement custom scheduling algorithms",
        "Integrate with external calendar systems",
        "Automate shift assignments based on custom rules"
      ]
    },
    {
      title: "Presence & Time Tracking",
      description: "Access clock in/out data and attendance records",
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      benefits: [
        "Retrieve real-time presence data",
        "Export time tracking for payroll integration",
        "Create custom attendance reports",
        "Implement geofencing and location verification"
      ],
      isPremium: true
    },
    {
      title: "Reporting & Analytics",
      description: "Extract and analyze workforce data",
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      benefits: [
        "Generate custom reports via API",
        "Schedule automated report delivery",
        "Access historical performance data",
        "Create custom dashboards with your visualization tools"
      ],
      isPremium: true
    },
    {
      title: "Notification APIs",
      description: "Send custom notifications to employees",
      icon: <MessageSquare className="w-6 h-6 text-red-600" />,
      benefits: [
        "Send custom push notifications",
        "Create automated notification workflows",
        "Implement custom notification templates",
        "Track notification delivery and open rates"
      ]
    },
    {
      title: "Webhook Integrations",
      description: "React to events in real-time with webhooks",
      icon: <Code className="w-6 h-6 text-indigo-600" />,
      benefits: [
        "Receive real-time event notifications",
        "Trigger custom workflows in external systems",
        "Implement custom business logic based on events",
        "Connect with thousands of services via Zapier"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Grid className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">API Marketplace</h2>
          <p className="text-gray-600">Extend ShiftGY functionality with our powerful API integrations</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Build Custom Solutions with ShiftGY APIs</h3>
        <p className="text-blue-800 mb-4">
          Our comprehensive API suite allows you to extend ShiftGY's functionality, integrate with your existing systems, and build custom solutions tailored to your organization's unique needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/60 p-3 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">RESTful API</div>
            <p className="text-blue-700">Modern REST API with JSON responses</p>
          </div>
          <div className="bg-white/60 p-3 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">OAuth 2.0</div>
            <p className="text-blue-700">Secure authentication and authorization</p>
          </div>
          <div className="bg-white/60 p-3 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">Webhooks</div>
            <p className="text-blue-700">Real-time event notifications</p>
          </div>
        </div>
      </div>

      {/* API Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apiCategories.map((category, index) => (
          <ApiCategory
            key={index}
            title={category.title}
            description={category.description}
            icon={category.icon}
            benefits={category.benefits}
            isPremium={category.isPremium}
          />
        ))}
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started with ShiftGY API</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-medium">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Register for API Access</h4>
              <p className="text-sm text-gray-600">
                Visit your account settings to register for API access and generate your API keys.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-medium">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Read the Documentation</h4>
              <p className="text-sm text-gray-600">
                Our comprehensive documentation includes guides, examples, and API reference.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-medium">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Start Building</h4>
              <p className="text-sm text-gray-600">
                Use our SDKs for popular languages or make direct API calls to start building your integration.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Code className="w-4 h-4 mr-2" />
            View API Documentation
          </button>
        </div>
      </div>
    </div>
  );
}