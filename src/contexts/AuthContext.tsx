import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginSuperAdminWith2FA: (userCode: string, generatedCode: string) => Promise<boolean>;
  addUniversity: (universityData: Omit<University, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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

interface AuthProviderProps {
  children: ReactNode;
}

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
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          universityId: userData.universityId,
          studentId: userData.studentId,
          createdAt: new Date().toISOString()
        };
        
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', response.data.token);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const loginSuperAdminWith2FA = async (userCode: string, generatedCode: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate 2FA code
      if (userCode === generatedCode) {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: 'superadmin@lms.com',
          password: 'password'
        });
        
        if (response.data.success) {
          const userData = response.data.user;
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            createdAt: new Date().toISOString()
          };
          
          setUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('superAdmin2FA', userCode);
          setIsLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.error('2FA login failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const addUniversity = async (universityData: Omit<University, 'id' | 'createdAt'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/universities`, universityData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to add university:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('superAdmin2FA');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSuperAdminWith2FA, addUniversity, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};