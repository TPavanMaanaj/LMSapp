# LMS Application Setup Instructions

## Overview
This application provides comprehensive functionality for managing universities, students, and courses with role-based dashboard access. The system includes:

- **Super Admin**: Can add and manage universities, admins, courses, and students
- **University Admin**: Can add and manage courses and students for their university
- **Student**: Can view their courses and materials

## Features Already Implemented

### ✅ Role-Based Dashboard Access
- **Super Admin Dashboard**: Full system management capabilities
- **University Admin Dashboard**: University-specific management
- **Student Dashboard**: Course and material access

### ✅ Add Functionality
- **Add Universities**: Super admin can add new universities with admin assignment
- **Add Students**: Super admin and university admin can add students
- **Add Courses**: Super admin and university admin can add courses
- **Add Admins**: Super admin can add university administrators

### ✅ Technical Features
- Spring Boot backend with JPA and MySQL
- React frontend with TypeScript
- Role-based authentication
- Form validation and error handling
- CRUD operations for all entities
- Responsive UI with modal forms

## Prerequisites

1. **Java 17 or higher**
2. **Node.js 16 or higher**
3. **MySQL 8.0 or higher**
4. **Maven 3.6 or higher**

## Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE university_admin_db;
   
   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
   GRANT ALL PRIVILEGES ON university_admin_db.* TO 'admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Database Configuration:**
   The application is configured to use:
   - Host: localhost:3306
   - Database: university_admin_db
   - Username: admin
   - Password: admin123

## Running the Application

### Backend (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd lms_backend/lms-backend
   ```

2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   or
   ```bash
   mvn spring-boot:run
   ```

3. The backend will start on port 8082

### Frontend (React)
1. Navigate to the root directory:
   ```bash
   cd /workspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. The frontend will start on port 3000

## Default Login Credentials

### Super Admin (2FA Required)
- Email: superadmin@lms.com
- Password: password
- 2FA Code: Generate code in the login screen

### University Admin
- Email: admin@iitd.ac.in
- Password: password
- University: IIT Delhi

### Student
- Email: student@iitd.ac.in
- Password: password
- University: IIT Delhi

## API Endpoints

The backend exposes the following REST endpoints:

### Universities
- `GET /api/universities` - Get all universities
- `POST /api/universities` - Create new university
- `GET /api/universities/{id}` - Get university by ID
- `PUT /api/universities/{id}` - Update university
- `DELETE /api/universities/{id}` - Delete university

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Admins
- `GET /api/admins` - Get all admins
- `POST /api/admins` - Create new admin
- `GET /api/admins/{id}` - Get admin by ID
- `PUT /api/admins/{id}` - Update admin
- `DELETE /api/admins/{id}` - Delete admin

## Usage Guide

### Super Admin Functions
1. **Add University**: Click "Add University" button in Universities tab
2. **Add Student**: Click "Add Student" button in Students tab
3. **Add Course**: Click "Add Course" button in Courses tab
4. **Add Admin**: Click "Add Admin" button in Admins tab

### University Admin Functions
1. **Add Course**: Click "Add Course" button (limited to their university)
2. **Add Student**: Click "Add Student" button (limited to their university)

### Student Functions
1. **View Courses**: Access enrolled courses
2. **View Materials**: Access course materials and assignments

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Verify database credentials
   - Check if database exists

2. **Port Already in Use**
   - Backend: Change port in `application.properties`
   - Frontend: Change port in `vite.config.ts`

3. **CORS Issues**
   - Ensure frontend runs on localhost:3000
   - Check CORS configuration in controllers

### Logs
- Backend logs: Check console output from Spring Boot
- Frontend logs: Check browser console for errors

## Technology Stack

- **Backend**: Spring Boot 3.5.3, Spring Data JPA, MySQL 8
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Authentication**: Context-based authentication with role management
- **Database**: MySQL with JPA entities and repositories

## Next Steps

The application is fully functional with all required features implemented. You can:
1. Run the application following the setup instructions
2. Test the role-based access control
3. Add sample data using the provided forms
4. Extend functionality as needed

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Ensure database is properly configured
4. Check console logs for specific error messages