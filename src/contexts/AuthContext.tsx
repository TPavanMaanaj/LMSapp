import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginSuperAdminWith2FA: (userCode: string, generatedCode: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        
        // Create user object matching our User interface
        const user: User = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          role: userData.role,
          universityId: userData.universityId?.toString(),
          studentId: userData.studentId,
          createdAt: new Date().toISOString()
        };
        
        console.log('Setting user:', user);
        
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', response.data.token || 'demo_token');
        
        setIsLoading(false);
        return true;
      } else {
        console.error('Login failed: Invalid response structure', response.data);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          alert('Cannot connect to server. Please ensure the backend is running on http://localhost:8082');
        } else if (error.response?.status === 400) {
          console.log('Invalid credentials provided');
        } else {
          console.error('Server error:', error.response?.data);
        }
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const loginSuperAdminWith2FA = async (userCode: string, generatedCode: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate 2FA code first
      if (userCode !== generatedCode) {
        console.log('2FA codes do not match');
        setIsLoading(false);
        return false;
      }

      console.log('2FA validation successful, logging in super admin');
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'superadmin@lms.com',
        password: 'password'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('Super admin login response:', response.data);
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        
        const user: User = {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: new Date().toISOString()
        };
        
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', response.data.token || 'super_admin_token');
        localStorage.setItem('superAdmin2FA', userCode);
        
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Super admin 2FA login failed:', error);
      
      if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
        alert('Cannot connect to server. Please ensure the backend is running on http://localhost:8082');
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('superAdmin2FA');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSuperAdminWith2FA, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};