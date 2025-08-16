import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'shift_manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  permissions: string[];
  companyId?: string; // Added for multi-company support
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  country?: string;
  mainContactName: string;
  createdAt: Date;
  plan: 'free' | 'basic' | 'pro' | 'enterprise' | 'custom';
  features: string[];
  trialEndDate?: Date;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  companies: Company[]; // For super admin
  currentCompany: Company | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithSSO: (provider: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  switchCompany: (companyId: string) => void;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock company data
const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'ShiftGY Demo Company',
    industry: 'Retail',
    country: 'United States',
    mainContactName: 'Sarah Johnson',
    createdAt: new Date('2023-12-01'),
    plan: 'pro',
    features: ['presence', 'breaks', 'tasks', 'surveys'],
    trialEndDate: new Date('2024-02-15'),
    isActive: true
  },
  {
    id: 'company-2',
    name: 'Retail Corp',
    industry: 'Retail',
    country: 'Canada',
    mainContactName: 'Michael Chen',
    createdAt: new Date('2024-01-05'),
    plan: 'basic',
    features: ['presence'],
    trialEndDate: new Date('2024-02-05'),
    isActive: true
  },
  {
    id: 'company-3',
    name: 'Healthcare Services',
    industry: 'Healthcare',
    country: 'United Kingdom',
    mainContactName: 'Emily Davis',
    createdAt: new Date('2023-11-15'),
    plan: 'enterprise',
    features: ['presence', 'breaks', 'tasks', 'surveys', 'advanced_reports'],
    isActive: true
  }
];

// Mock user data for demonstration
const mockUsers: Record<string, User> = {
  'super@shiftgy.com': {
    id: 'super-1',
    name: 'Super Admin',
    email: 'super@shiftgy.com',
    role: 'super_admin',
    department: 'Platform Administration',
    permissions: ['*'], // Wildcard permission for super admin
    companyId: null // Super admin doesn't belong to a specific company
  },
  'admin@shiftgy.com': {
    id: '1',
    name: 'Sarah Johnson',
    email: 'admin@shiftgy.com',
    role: 'admin',
    department: 'Management',
    permissions: ['view_all', 'manage_employees', 'manage_schedules', 'view_reports', 'manage_departments'],
    companyId: 'company-1'
  },
  'manager@shiftgy.com': {
    id: '2',
    name: 'Michael Chen',
    email: 'manager@shiftgy.com',
    role: 'manager',
    department: 'Operations',
    permissions: ['view_department', 'manage_schedules', 'view_reports'],
    companyId: 'company-1'
  },
  'employee@shiftgy.com': {
    id: '3',
    name: 'Emily Davis',
    email: 'employee@shiftgy.com',
    role: 'employee',
    department: 'Sales',
    permissions: ['view_own_schedule', 'request_time_off'],
    companyId: 'company-1'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({
              ...userData,
              id: firebaseUser.uid
            });
            
            // If user is super admin, don't set current company
            if (userData.role !== 'super_admin' && userData.companyId) {
              // Try to get company data from Firestore
              try {
                const companyDoc = await getDoc(doc(db, 'companies', userData.companyId));
                if (companyDoc.exists()) {
                  const companyData = companyDoc.data() as Company;
                  setCurrentCompany({
                    ...companyData,
                    id: companyDoc.id
                  });
                } else {
                  // Fallback to mock company data
                  const company = mockCompanies.find(c => c.id === userData.companyId);
                  if (company) {
                    setCurrentCompany(company);
                  }
                }
              } catch (error) {
                console.warn('Error fetching company data:', error);
                // Fallback to mock company data
                const company = mockCompanies.find(c => c.id === userData.companyId);
                if (company) {
                  setCurrentCompany(company);
                }
              }
            }
          } else {
            // User document doesn't exist in Firestore
            // Check if this is a newly created user (within last 10 seconds)
            const userCreationTime = new Date(firebaseUser.metadata.creationTime || '').getTime();
            const now = Date.now();
            const isNewUser = (now - userCreationTime) < 10000; // 10 seconds
            
            if (isNewUser) {
              // For new users, wait for the onboarding process to create the user document
              console.log('New user detected, waiting for onboarding to complete...');
              // Don't sign out, let the onboarding process handle user creation
            } else {
              console.error('User document not found in Firestore');
              // Check if this is a demo user before signing out
              const demoUser = mockUsers[firebaseUser.email || ''];
              if (demoUser) {
                setUser(demoUser);
                if (demoUser.companyId) {
                  const company = mockCompanies.find(c => c.id === demoUser.companyId);
                  if (company) {
                    setCurrentCompany(company);
                  }
                }
              } else {
                await signOut(auth);
                setUser(null);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to demo mode if Firestore is unavailable
          const demoUser = mockUsers[firebaseUser.email || ''];
          if (demoUser) {
            setUser(demoUser);
            if (demoUser.companyId) {
              const company = mockCompanies.find(c => c.id === demoUser.companyId);
              if (company) {
                setCurrentCompany(company);
              }
            }
          }
        }
      } else {
        setUser(null);
        setCurrentCompany(null);
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check if this is a demo user first
      const mockUser = mockUsers[email];
      if (mockUser && password === 'password') {
        // For demo users, set the user directly without Firebase
        setUser(mockUser);
        
        // Set current company for non-super admin users
        if (mockUser.role !== 'super_admin' && mockUser.companyId) {
          const company = mockCompanies.find(c => c.id === mockUser.companyId);
          if (company) {
            setCurrentCompany(company);
          }
        }
        
        setLoading(false);
        return;
      }
      
      // If not a demo user, try Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // User data will be set by the auth state listener
        return userCredential.user;
      } catch (firebaseError) {
        // If Firebase auth fails, throw the original error
        throw firebaseError;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create a new user document in Firestore
        const newUser: User = {
          id: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email || '',
          role: 'employee', // Default role for new users
          department: 'General',
          permissions: ['view_own_schedule', 'request_time_off'],
          avatar: result.user.photoURL || undefined
        };
        
        await setDoc(doc(db, 'users', result.user.uid), newUser);
      }
      
      // User data will be set by the auth state listener
      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMicrosoft = async () => {
    setLoading(true);
    try {
      const provider = new OAuthProvider('microsoft.com');
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create a new user document in Firestore
        const newUser: User = {
          id: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email || '',
          role: 'employee', // Default role for new users
          department: 'General',
          permissions: ['view_own_schedule', 'request_time_off'],
          avatar: result.user.photoURL || undefined
        };
        
        await setDoc(doc(db, 'users', result.user.uid), newUser);
      }
      
      // User data will be set by the auth state listener
      return result.user;
    } catch (error) {
      console.error('Microsoft login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithSSO = async (provider: string) => {
    setLoading(true);
    try {
      // Use the appropriate provider based on the parameter
      if (provider === 'google') {
        return loginWithGoogle();
      } else if (provider === 'microsoft') {
        return loginWithMicrosoft();
      } else if (provider === 'okta') {
        // For Okta, we would need to implement a custom solution
        // This is a placeholder for now
        throw new Error('Okta SSO not implemented yet');
      } else {
        throw new Error('Unsupported SSO provider');
      }
    } catch (error) {
      console.error('SSO login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Check if current user is a demo user
      if (user && mockUsers[user.email]) {
        // For demo users, clear state directly
        setUser(null);
        setCurrentCompany(null);
      } else {
        // For Firebase users, sign out through Firebase
        await signOut(auth);
        // User and company state will be cleared by the auth state listener
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin' || user.permissions.includes('*')) {
      return true;
    }
    
    return user.permissions.includes(permission);
  };

  const switchCompany = (companyId: string) => {
    if (!user || user.role !== 'super_admin') return;
    
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
    }
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      companies,
      currentCompany,
      login,
      loginWithGoogle,
      loginWithMicrosoft,
      loginWithSSO,
      logout,
      hasPermission,
      switchCompany,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}