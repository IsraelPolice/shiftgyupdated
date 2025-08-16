import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Tag, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Home,
  HelpCircle,
  Star,
  Clock,
  Shield,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

const content = {
  he: {
    title: "איך מוסיפים עובד חדש",
    subtitle: "מדריך מפורט להוספת עובדים במערכת ShiftGy",
    breadcrumb: ["דשבורד", "תמיכה", "הוספת עובד"],
    overview: {
      title: "סקירה כללית",
      description: "הוספת עובדים חדשים היא הבסיס לניהול יעיל של סידורי עבודה. מדריך זה יעזור לך להוסיף עובדים בצורה נכונה ויעילה.",
      importance: "חשוב: הגדרה נכונה של מחלקה ותגים קריטית לתפקוד המערכת"
    },
    steps: {
      step1: {
        title: "שלב 1: ניווט לדף הוספת עובד",
        description: "לחץ על כפתור 'הוסף עובד' בפינה הימנית העליונה של דף העובדים",
        action: "לחץ על 'הוסף עובד'"
      },
      step2: {
        title: "שלב 2: מילוי פרטים אישיים",
        description: "הזן את הפרטים הבסיסיים של העובד החדש",
        action: "מלא את השדות הנדרשים"
      },
      step3: {
        title: "שלב 3: הגדרת מידע עבודה וקריטי",
        description: "הגדר מחלקה, תגים ופרטי עבודה נוספים",
        action: "הגדר מחלקה ותגים"
      }
    },
    fields: {
      name: {
        title: "שם מלא",
        description: "שם העובד כפי שיופיע בכל המערכת",
        tips: ["וודא שהשם מדויק", "ישמש לזיהוי בסידורי עבודה", "יופיע בדוחות ובהתראות"]
      },
      email: {
        title: "כתובת אימייל",
        description: "כתובת האימייל של העובד להתחברות ולהתראות",
        tips: ["חייב להיות ייחודי במערכת", "ישמש להתחברות", "יקבל התראות אוטומטיות"]
      },
      phone: {
        title: "מספר טלפון",
        description: "מספר הטלפון של העובד לתקשורת ולהתראות SMS",
        tips: ["כלול קידומת מדינה", "ישמש להתראות SMS", "חשוב לתקשורת חירום"]
      },
      department: {
        title: "מחלקה",
        description: "המחלקה בה עובד העובד - שדה קריטי!",
        tips: ["עובד ללא מחלקה לא יופיע בסידורי עבודה", "חובה לשיבוץ במשמרות", "משפיע על הרשאות וגישה"]
      },
      tags: {
        title: "תגים",
        description: "תגים לזיהוי כישורים, תפקידים ויכולות",
        tips: ["מאפשר שיבוץ חכם", "מסנן עובדים לפי כישורים", "חיוני לאוטומציה"]
      },
      role: {
        title: "תפקיד",
        description: "התפקיד והרשאות העובד במערכת",
        tips: ["קובע רמת גישה", "משפיע על תפריטים", "ניתן לשנות בעתיד"]
      }
    },
    critical: {
      department: {
        title: "מחלקה - שדה קריטי!",
        warning: "עובד ללא מחלקה לא יופיע בסידורי עבודה ולא ניתן יהיה לשבצו במשמרות",
        solution: "וודא שבחרת מחלקה מהרשימה או צור מחלקה חדשה בהגדרות החברה"
      },
      tags: {
        title: "תגים - חיוני לשיבוץ חכם",
        description: "תגים מאפשרים למערכת לבצע שיבוץ אוטומטי ולסנן עובדים לפי כישורים",
        examples: ["נהג", "מנהל משמרת", "שירות לקוחות", "מלאי", "ניסיון"]
      }
    },
    bestPractices: {
      title: "שיטות עבודה מומלצות",
      items: [
        "הוסף תגים רלוונטיים לכל עובד",
        "וודא שכתובת האימייל נכונה",
        "בחר מחלקה מתאימה",
        "הגדר תפקיד נכון",
        "בדוק פרטי קשר"
      ]
    },
    faq: {
      title: "שאלות נפוצות",
      items: [
        {
          question: "מה קורה אם לא אגדיר מחלקה לעובד?",
          answer: "העובד לא יופיע בסידורי עבודה ולא ניתן יהיה לשבצו במשמרות. זהו שדה חובה לתפקוד תקין של המערכת."
        },
        {
          question: "איך אני יכול לערוך פרטי עובד אחרי ההוספה?",
          answer: "לחץ על שם העובד ברשימת העובדים ובחר 'ערוך'. ניתן לשנות את כל הפרטים למעט כתובת האימייל."
        },
        {
          question: "מה ההבדל בין תפקיד למחלקה?",
          answer: "מחלקה מגדירה את היחידה הארגונית (מכירות, תפעול), תפקיד מגדיר הרשאות במערכת (עובד, מנהל, אדמין)."
        }
      ]
    },
    relatedArticles: {
      title: "מאמרים קשורים",
      items: [
        "איך יוצרים מחלקה חדשה",
        "ניהול תגים ותוויות",
        "הגדרת הרשאות משתמשים",
        "ייבוא עובדים מקובץ Excel"
      ]
    }
  },
  en: {
    title: "How to Add an Employee",
    subtitle: "Complete guide for adding employees in ShiftGy",
    breadcrumb: ["Dashboard", "Support", "Add Employee"],
    overview: {
      title: "Overview",
      description: "Adding new employees is the foundation of effective workforce management. This guide will help you add employees correctly and efficiently.",
      importance: "Important: Proper department and tags setup is critical for system functionality"
    },
    steps: {
      step1: {
        title: "Step 1: Navigate to Add Employee",
        description: "Click the 'Add Employee' button in the top-right corner of the Employees page",
        action: "Click 'Add Employee'"
      },
      step2: {
        title: "Step 2: Fill Personal Information",
        description: "Enter the basic details of the new employee",
        action: "Complete required fields"
      },
      step3: {
        title: "Step 3: Set Work Information & Critical Fields",
        description: "Configure department, tags, and additional work details",
        action: "Set department and tags"
      }
    },
    fields: {
      name: {
        title: "Full Name",
        description: "Employee name as it appears throughout the system",
        tips: ["Ensure accuracy", "Used in schedules and reports", "Appears in notifications"]
      },
      email: {
        title: "Email Address",
        description: "Employee's email for login and notifications",
        tips: ["Must be unique in system", "Used for login", "Receives automatic notifications"]
      },
      phone: {
        title: "Phone Number",
        description: "Employee's phone number for communication and SMS alerts",
        tips: ["Include country code", "Used for SMS alerts", "Important for emergency contact"]
      },
      department: {
        title: "Department",
        description: "The department where the employee works - critical field!",
        tips: ["Employee without department won't appear in schedules", "Required for shift assignment", "Affects permissions and access"]
      },
      tags: {
        title: "Tags",
        description: "Tags to identify skills, roles, and capabilities",
        tips: ["Enables smart scheduling", "Filters employees by skills", "Essential for automation"]
      },
      role: {
        title: "Role",
        description: "Employee's role and permissions in the system",
        tips: ["Determines access level", "Affects menu visibility", "Can be changed later"]
      }
    },
    critical: {
      department: {
        title: "Department - Critical Field!",
        warning: "Employee without department won't appear in schedules and cannot be assigned to shifts",
        solution: "Make sure to select a department from the list or create a new department in company settings"
      },
      tags: {
        title: "Tags - Essential for Smart Scheduling",
        description: "Tags enable the system to perform automatic scheduling and filter employees by skills",
        examples: ["Driver", "Shift Manager", "Customer Service", "Inventory", "Experienced"]
      }
    },
    bestPractices: {
      title: "Best Practices",
      items: [
        "Add relevant tags for each employee",
        "Verify email address is correct",
        "Select appropriate department",
        "Set correct role",
        "Check contact details"
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What happens if I don't assign a department?",
          answer: "The employee won't appear in schedules and cannot be assigned to shifts. This is a required field for proper system functionality."
        },
        {
          question: "How can I edit employee details after adding them?",
          answer: "Click on the employee's name in the employee list and select 'Edit'. You can change all details except the email address."
        },
        {
          question: "What's the difference between role and department?",
          answer: "Department defines the organizational unit (Sales, Operations), while role defines system permissions (Employee, Manager, Admin)."
        }
      ]
    },
    relatedArticles: {
      title: "Related Articles",
      items: [
        "How to Create a New Department",
        "Managing Tags and Labels",
        "Setting User Permissions",
        "Importing Employees from Excel"
      ]
    }
  }
};

const fieldExplanations = [
  {
    field: "name",
    importance: "critical",
    icon: User,
    color: "red"
  },
  {
    field: "email", 
    importance: "critical",
    icon: Mail,
    color: "red"
  },
  {
    field: "phone",
    importance: "recommended",
    icon: Phone,
    color: "orange"
  },
  {
    field: "department",
    importance: "critical",
    icon: Building2,
    color: "red"
  },
  {
    field: "tags",
    importance: "important",
    icon: Tag,
    color: "orange"
  },
  {
    field: "role",
    importance: "recommended",
    icon: Shield,
    color: "blue"
  }
];

const InteractiveFormPreview = ({ language }) => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    tags: [],
    role: 'employee'
  });

  const handleFieldClick = (field) => {
    setActiveField(activeField === field ? null : field);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        {language === 'he' ? 'תצוגה מקדימה אינטראקטיבית' : 'Interactive Form Preview'}
      </h3>
      
      <div className="space-y-4">
        {fieldExplanations.map((field) => {
          const IconComponent = field.icon;
          const isActive = activeField === field.field;
          const fieldContent = content[language].fields[field.field];
          
          return (
            <div key={field.field} className="relative">
              <div
                onClick={() => handleFieldClick(field.field)}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  field.importance === 'critical' ? 'border-l-4 border-l-red-500' :
                  field.importance === 'important' ? 'border-l-4 border-l-orange-500' :
                  'border-l-4 border-l-blue-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-5 h-5 ${
                    field.color === 'red' ? 'text-red-600' :
                    field.color === 'orange' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <label className="font-medium text-gray-900">
                      {fieldContent.title}
                      {field.importance === 'critical' && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={fieldContent.description}
                      value={formData[field.field]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.field]: e.target.value
                      }))}
                    />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                    isActive ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-blue-800 mb-3">{fieldContent.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900">
                      {language === 'he' ? 'טיפים חשובים:' : 'Important Tips:'}
                    </h4>
                    <ul className="space-y-1">
                      {fieldContent.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TagExample = ({ tag, description, language }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        <span className="font-mono text-sm font-medium text-gray-900">{tag}</span>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <button 
        onClick={handleCopy}
        className="text-blue-600 hover:text-blue-800 transition-colors"
        title={language === 'he' ? 'העתק' : 'Copy'}
      >
        {copied ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

const FAQItem = ({ question, answer, language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-3"
        >
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

export default function HowToAddEmployee() {
  const { language, setLanguage } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState([]);
  const currentContent = content[language];

  const toggleStep = (stepIndex) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const progressPercentage = (completedSteps.length / 3) * 100;

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'he' ? 'rtl' : 'ltr'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">ShiftGY</span>
            </div>
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'en' ? '🇭🇪 עברית' : '🇺🇸 English'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          {currentContent.breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              <span className={index === currentContent.breadcrumb.length - 1 ? 'text-gray-900 font-medium' : ''}>
                {item}
              </span>
              {index < currentContent.breadcrumb.length - 1 && (
                <ChevronRight className="w-4 h-4" />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentContent.title}</h1>
          <p className="text-lg text-gray-600">{currentContent.subtitle}</p>
          
          {/* Progress Indicator */}
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {language === 'he' ? 'התקדמות המדריך' : 'Tutorial Progress'}
              </span>
              <span className="text-sm text-gray-500">
                {completedSteps.length}/3 {language === 'he' ? 'שלבים הושלמו' : 'steps completed'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentContent.overview.title}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{currentContent.overview.description}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">{currentContent.overview.importance}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Tutorial */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {language === 'he' ? 'מדריך שלב אחר שלב' : 'Step-by-Step Tutorial'}
              </h2>
              
              <div className="space-y-6">
                {Object.entries(currentContent.steps).map(([key, step], index) => {
                  const isCompleted = completedSteps.includes(index);
                  
                  return (
                    <div key={key} className="relative">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleStep(index)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            isCompleted 
                              ? 'bg-green-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </button>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-700 mb-3">{step.description}</p>
                          
                          {/* Visual Placeholder */}
                          <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300 mb-4">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                {index === 0 && <ArrowRight className="w-8 h-8 text-blue-600" />}
                                {index === 1 && <User className="w-8 h-8 text-blue-600" />}
                                {index === 2 && <Building2 className="w-8 h-8 text-blue-600" />}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {language === 'he' ? 'תמונת המחשה - צילום מסך' : 'Illustration - Screenshot'}
                              </p>
                              <p className="text-blue-600 font-medium mt-2">{step.action}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < 2 && (
                        <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-300"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Form Preview */}
            <InteractiveFormPreview language={language} />

            {/* Critical Emphasis Sections */}
            <div className="space-y-6">
              {/* Department Section */}
              <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded-r-lg">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-red-800 font-bold text-lg">
                    {currentContent.critical.department.title}
                  </h3>
                </div>
                <p className="text-red-700 mb-4 leading-relaxed">
                  {currentContent.critical.department.warning}
                </p>
                <div className="bg-red-100 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">
                    {language === 'he' ? 'פתרון:' : 'Solution:'}
                  </h4>
                  <p className="text-red-700 text-sm">
                    {currentContent.critical.department.solution}
                  </p>
                </div>
              </div>

              {/* Tags Section */}
              <div className="border-l-4 border-orange-500 bg-orange-50 p-6 rounded-r-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="h-6 w-6 text-orange-600" />
                  <h3 className="text-orange-800 font-bold text-lg">
                    {currentContent.critical.tags.title}
                  </h3>
                </div>
                <p className="text-orange-700 mb-4 leading-relaxed">
                  {currentContent.critical.tags.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800">
                    {language === 'he' ? 'דוגמאות לתגים יעילים:' : 'Examples of Effective Tags:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentContent.critical.tags.examples.map((tag, index) => (
                      <TagExample 
                        key={index}
                        tag={tag}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentContent.bestPractices.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContent.bestPractices.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{currentContent.faq.title}</h2>
              </div>
              
              <div className="space-y-3">
                {currentContent.faq.items.map((item, index) => (
                  <FAQItem 
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    language={language}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {language === 'he' ? 'ניווט מהיר' : 'Quick Navigation'}
              </h3>
              <nav className="space-y-2">
                <a href="#overview" className="block text-blue-600 hover:text-blue-800 text-sm">
                  {language === 'he' ? 'סקירה כללית' : 'Overview'}
                </a>
                <a href="#tutorial" className="block text-blue-600 hover:text-blue-800 text-sm">
                  {language === 'he' ? 'מדריך שלב אחר שלב' : 'Step-by-Step Tutorial'}
                </a>
                <a href="#fields" className="block text-blue-600 hover:text-blue-800 text-sm">
                  {language === 'he' ? 'הסבר שדות' : 'Field Explanations'}
                </a>
                <a href="#critical" className="block text-blue-600 hover:text-blue-800 text-sm">
                  {language === 'he' ? 'שדות קריטיים' : 'Critical Fields'}
                </a>
                <a href="#faq" className="block text-blue-600 hover:text-blue-800 text-sm">
                  {language === 'he' ? 'שאלות נפוצות' : 'FAQ'}
                </a>
              </nav>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">{currentContent.relatedArticles.title}</h3>
              <div className="space-y-3">
                {currentContent.relatedArticles.items.map((article, index) => (
                  <a 
                    key={index}
                    href="#"
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{article}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Help Widget */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">
                  {language === 'he' ? 'צריך עזרה?' : 'Need Help?'}
                </h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                {language === 'he' 
                  ? 'הצוות שלנו כאן לעזור לך עם כל שאלה'
                  : 'Our team is here to help you with any questions'
                }
              </p>
              <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                {language === 'he' ? 'צור קשר עם התמיכה' : 'Contact Support'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}