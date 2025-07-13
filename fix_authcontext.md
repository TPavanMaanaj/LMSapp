# Fix AuthContext TypeScript Error

## Error: Cannot find name 'AuthProviderProps'

### **Quick Fix for src/contexts/AuthContext.tsx**

Replace your current AuthContext.tsx with this corrected version:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
// Remove the mock data import when switching to real API
// import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginSuperAdminWith2FA: (userCode: string, generatedCode: string) => Promise<boolean>;
  addUniversity: (universityData: Omit<University, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// ADD THIS MISSING INTERFACE
interface AuthProviderProps {
  children: ReactNode;
}

interface University {
  id: string;
  name: string;
  address: string;
  adminId: string;
  adminName: string;
  establishedYear: number;
  totalStudents: number;
  totalCourses: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // TEMPORARY: Keep using mock data until backend is ready
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic (replace this with real API call)
    const mockUsers = [
      {
        id: '1',
        email: 'superadmin@lms.com',
        name: 'Super Administrator',
        role: 'super_admin',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        email: 'admin@iitd.ac.in',
        name: 'Dr. Rajesh Kumar',
        role: 'university_admin',
        universityId: '1',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        email: 'student@iitd.ac.in',
        name: 'Aarav Gupta',
        role: 'student',
        universityId: '1',
        studentId: 'IITD2024001',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;

    // FUTURE: Replace above mock logic with this real API call
    /*
    try {
      const response = await axios.post('http://localhost:8082/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
    setIsLoading(false);
    return false;
    */
  };

  const loginSuperAdminWith2FA = async (userCode: string, generatedCode: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate 2FA code
    if (userCode === generatedCode) {
      const superAdminUser: User = {
        id: '1',
        email: 'superadmin@lms.com',
        name: 'Super Administrator',
        role: 'super_admin',
        createdAt: new Date().toISOString()
      };
      
      setUser(superAdminUser);
      localStorage.setItem('currentUser', JSON.stringify(superAdminUser));
      localStorage.setItem('superAdmin2FA', userCode);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const addUniversity = async (universityData: Omit<University, 'id' | 'createdAt'>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would make an API call to create the university
    // For now, we'll just simulate success
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('superAdmin2FA');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSuperAdminWith2FA, addUniversity, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## **What was fixed:**

1. ✅ **Added missing `AuthProviderProps` interface**
2. ✅ **Kept your existing functionality intact**
3. ✅ **Added comments for future API integration**
4. ✅ **Maintained mock data temporarily until backend is ready**

## **Next Steps:**

1. **Copy the corrected code above** to your `src/contexts/AuthContext.tsx`
2. **The TypeScript error will be resolved**
3. **Your app will continue working with mock data**
4. **When backend is ready, uncomment the real API call section**

This fix maintains your current functionality while resolving the TypeScript error!