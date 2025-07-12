# LMS Application - University Management System

A comprehensive Learning Management System with role-based access control for managing universities, students, and courses.

## 🚀 Quick Start

### Option 1: Automated Setup
Run the setup script to automatically configure the database and dependencies:
```bash
./setup.sh
```

### Option 2: Manual Setup
See `SETUP_INSTRUCTIONS.md` for detailed manual setup instructions.

## 🏃‍♂️ Running the Application

### Start Backend
```bash
./start-backend.sh
```

### Start Frontend
```bash
./start-frontend.sh
```

Or manually:
```bash
# Backend
cd lms_backend/lms-backend && ./mvnw spring-boot:run

# Frontend
npm run dev
```

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@lms.com | password |
| University Admin | admin@iitd.ac.in | password |
| Student | student@iitd.ac.in | password |

## 📋 Features

### ✅ Role-Based Dashboard Access
- **Super Admin**: Full system management
- **University Admin**: University-specific management
- **Student**: Course and material access

### ✅ Entity Management
- **Universities**: Create, view, edit, delete
- **Students**: Create, view, edit, delete
- **Courses**: Create, view, edit, delete
- **Admins**: Create, view, edit, delete

### ✅ Access Control
- Super Admin: All entities
- University Admin: Only their university's students and courses
- Student: Only their enrolled courses

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.5.3, JPA, MySQL
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Database**: MySQL 8.0
- **Authentication**: Context-based role management

## 📝 Usage

### Super Admin Functions
1. Login with super admin credentials
2. Navigate to different tabs (Universities, Students, Courses, Admins)
3. Click "Add" buttons to create new entities
4. Use search and filter options to manage data

### University Admin Functions
1. Login with university admin credentials
2. Navigate to Courses or Students tabs
3. Add courses and students for your university
4. Manage existing records

### Student Functions
1. Login with student credentials
2. View enrolled courses
3. Access course materials
4. Check grades and progress

## 🔧 Configuration

### Database Configuration
Edit `lms_backend/lms-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/university_admin_db
spring.datasource.username=admin
spring.datasource.password=admin123
server.port=8082
```

### Frontend Configuration
The frontend is configured to connect to `http://localhost:8082/api/`

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/universities | Get all universities |
| POST | /api/universities | Create university |
| GET | /api/students | Get all students |
| POST | /api/students | Create student |
| GET | /api/courses | Get all courses |
| POST | /api/courses | Create course |
| GET | /api/admins | Get all admins |
| POST | /api/admins | Create admin |

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure MySQL is running and credentials are correct
2. **Port Conflicts**: Change ports in configuration files if needed
3. **CORS Issues**: Ensure frontend runs on localhost:3000

### Logs
- Backend: Check Spring Boot console output
- Frontend: Check browser developer console

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs for error messages
3. Verify prerequisites are installed
4. Check database connection and configuration

## 🎯 Next Steps

The application is fully functional with all requested features implemented. You can:
- Run the application and test the role-based access
- Add sample data using the provided forms
- Extend functionality as needed
- Deploy to production environments