# Frontend Connection Issues - Troubleshooting Guide

## Problem Summary
Your frontend is **not connecting to the backend** and **displaying database data** because of several interconnected issues:

### 🔍 **Root Cause Analysis**

1. **Frontend Uses Mock Data Instead of Real API**
   - Your `AuthContext.tsx` uses `mockUsers` from `data/mockData.ts`
   - No actual API calls are being made to the backend
   - All data is hardcoded in the frontend

2. **Database Not Running**
   - MySQL service is not properly started
   - Backend cannot connect to database
   - Spring Boot application fails to start

3. **Backend Not Started**
   - Spring Boot application is not running on port 8082
   - API endpoints are not accessible

## 🛠️ **Step-by-Step Solution**

### **Step 1: Fix Database Setup**

#### Install and Configure MySQL
```bash
# MySQL is already installed, but needs proper setup
sudo mkdir -p /var/lib/mysql
sudo chown mysql:mysql /var/lib/mysql
sudo mysql_install_db --user=mysql --datadir=/var/lib/mysql
sudo mysqld_safe --user=mysql &
```

#### Create Database
```bash
# Wait for MySQL to start, then create database
sleep 5
mysql -u root -e "CREATE DATABASE IF NOT EXISTS university_admin_db;"
mysql -u root university_admin_db < database_setup.sql
```

### **Step 2: Start Backend Application**
```bash
cd lms_backend/lms-backend
./mvnw spring-boot:run
```

### **Step 3: Update Frontend to Use Real API**

#### Fix AuthContext.tsx
Replace the mock authentication with real API calls:

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

// Remove mockUsers import and usage
// import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
      // Make real API call instead of using mock data
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Update Dashboard Components
Replace mock data usage with real API calls in dashboard components:

```typescript
// Example for SuperAdminDashboard.tsx
import { getAllStudents } from '../services/Studentservice';
import { getAllAdmins } from '../services/Adminservice';
import { getAllUniversities } from '../services/Universityservice';
import { getAllCourses } from '../services/Courseservice';

const SuperAdminDashboard: React.FC = () => {
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, adminsRes, universitiesRes, coursesRes] = await Promise.all([
          getAllStudents(),
          getAllAdmins(),
          getAllUniversities(),
          getAllCourses()
        ]);

        setStudents(studentsRes.data);
        setAdmins(adminsRes.data);
        setUniversities(universitiesRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Rest of component...
};
```

### **Step 4: Add Missing API Endpoints**

#### Create Authentication Controller
```java
// lms_backend/lms-backend/src/main/java/com/lms_app/lms_backend/controller/AuthController.java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Implement authentication logic
        // Check credentials against database
        // Return user data and token
    }
}
```

#### Create University Controller
```java
// lms_backend/lms-backend/src/main/java/com/lms_app/lms_backend/controller/UniversityController.java
@RestController
@RequestMapping("/api/universities")
@CrossOrigin(origins = "http://localhost:3000")
public class UniversityController {
    
    @GetMapping
    public List<University> getAllUniversities() {
        // Return all universities
    }
    
    @PostMapping
    public University createUniversity(@RequestBody University university) {
        // Create new university
    }
}
```

### **Step 5: Fix CORS Configuration**

#### Add Global CORS Configuration
```java
// lms_backend/lms-backend/src/main/java/com/lms_app/lms_backend/config/CorsConfig.java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### **Step 6: Test Connection**

#### Test Backend API
```bash
# Test if backend is running
curl -X GET http://localhost:8082/api/students

# Test database connection
curl -X GET http://localhost:8082/api/universities
```

#### Test Frontend Connection
```bash
# Start frontend
npm run dev

# Check browser console for errors
# Verify network requests in DevTools
```

## 🚨 **Common Issues and Solutions**

### **Issue 1: "Failed to connect to localhost port 8082"**
**Solution**: Backend is not running
```bash
cd lms_backend/lms-backend
./mvnw spring-boot:run
```

### **Issue 2: "CORS policy" errors**
**Solution**: Add CORS configuration to all controllers
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### **Issue 3: Database connection errors**
**Solution**: Ensure MySQL is running and database exists
```bash
sudo mysqld_safe --user=mysql &
mysql -u root -e "CREATE DATABASE IF NOT EXISTS university_admin_db;"
```

### **Issue 4: "Network Error" in frontend**
**Solution**: Check API URLs and axios configuration
```typescript
const API_BASE_URL = 'http://localhost:8082/api';
```

## 🔄 **Quick Start Commands**

```bash
# 1. Start MySQL
sudo mysqld_safe --user=mysql &

# 2. Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS university_admin_db;"
mysql -u root university_admin_db < database_setup.sql

# 3. Start backend
cd lms_backend/lms-backend
./mvnw spring-boot:run &

# 4. Start frontend (in new terminal)
npm run dev
```

## 📊 **Expected Results**

After implementing these fixes:
- ✅ Backend runs on http://localhost:8082
- ✅ Frontend connects to real API endpoints
- ✅ Database data is displayed in the frontend
- ✅ CRUD operations work properly
- ✅ Authentication works with real user data

## 🎯 **Key Takeaways**

1. **Always ensure database is running** before starting the backend
2. **Replace mock data with real API calls** in the frontend
3. **Configure CORS properly** for frontend-backend communication
4. **Test each component individually** before testing the full stack
5. **Check network requests** in browser DevTools for debugging

Your frontend will now display real data from the database instead of mock data!