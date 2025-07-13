# Database Users Overview - LMS System

## Overview
In your LMS (Learning Management System) database, users are represented by data stored in multiple tables. The system defines different types of users with specific roles and access levels.

## User Types in the Database

### 1. Students (`students` table)
Students are the primary end-users of the learning management system.

**Database Structure:**
```sql
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    major VARCHAR(100),
    year VARCHAR(10),
    phone_number VARCHAR(20),
    university_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE SET NULL
);
```

**Key Characteristics:**
- **Primary Identifier**: `student_id` (unique student identifier like "IITD2024001")
- **Email**: Unique email address for authentication
- **Academic Info**: Major, year of study
- **University Association**: Linked to a specific university via `university_id`
- **Contact Info**: Phone number for communication

**Sample Students in Database:**
- Aarav Gupta (IITD2024001) - Computer Science Engineering, Year 2
- Kavya Reddy (IITD2024002) - Computer Science Engineering, Year 1
- Diya Singh (IITB2024001) - Electrical Engineering, Year 3
- Rohan Sharma (IITB2024002) - Computer Science Engineering, Year 2

### 2. Admins (`admin` table)
Admins are university administrators who manage their respective institutions.

**Database Structure:**
```sql
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    uni_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'ADMIN',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    email VARCHAR(255) UNIQUE,
    students INT DEFAULT 0,
    phnnum BIGINT,
    department INT,
    admin_status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Key Characteristics:**
- **Role**: Primarily 'ADMIN' role with university-specific permissions
- **University Association**: Linked to specific university via `uni_name`
- **Status Management**: Both `status` and `admin_status` for access control
- **Management Scope**: Number of students under their administration
- **Contact Info**: Email and phone number for communication

**Sample Admins in Database:**
- Dr. Rajesh Kumar - IIT Delhi Admin (admin@iitd.ac.in)
- Dr. Priya Sharma - IIT Bombay Admin (admin@iitb.ac.in)
- Dr. Arjun Patel - IISc Admin (admin@iisc.ac.in)

### 3. Implicit Super Admin
Based on the README documentation, there's a Super Admin user type with system-wide access.

**Characteristics:**
- **Email**: superadmin@lms.com
- **Scope**: Full system management across all universities
- **Permissions**: Can manage all entities (universities, students, courses, admins)

## User Authentication & Access Control

### Login Credentials (Default)
| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | superadmin@lms.com | password | System-wide |
| University Admin | admin@iitd.ac.in | password | University-specific |
| Student | student@iitd.ac.in | password | Course-specific |

### Role-Based Access Control
1. **Super Admin**: 
   - Manage all universities
   - Manage all students, courses, and admins
   - Full system oversight

2. **University Admin**:
   - Manage only their university's students
   - Manage only their university's courses
   - Cannot access other universities' data

3. **Student**:
   - View enrolled courses
   - Access course materials
   - View grades and progress

## User Identification Methods

### Primary Keys
- **Students**: `student_id` (e.g., "IITD2024001")
- **Admins**: `email` (e.g., "admin@iitd.ac.in")
- **Super Admin**: `email` (e.g., "superadmin@lms.com")

### Unique Constraints
- Student emails must be unique across the system
- Admin emails must be unique across the system
- Student IDs must be unique across the system

## Data Relationships

### Students ↔ Universities
- Each student belongs to exactly one university
- Universities can have multiple students
- Foreign key relationship via `university_id`

### Admins ↔ Universities
- Each admin is associated with one university
- Universities can have multiple admins
- Relationship maintained via `uni_name` field

### Users ↔ Courses
- Students can enroll in multiple courses
- Courses belong to specific universities
- Access control ensures students only see courses from their university

## User Management Operations

### Available API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| POST | /api/students | Create new student |
| GET | /api/admins | Get all admins |
| POST | /api/admins | Create new admin |

### Common User Operations
1. **Create User**: Add new student or admin to database
2. **Authenticate User**: Verify credentials and determine access level
3. **Authorize Access**: Check permissions based on user role
4. **Update Profile**: Modify user information
5. **Manage Status**: Activate/deactivate user accounts

## Summary

**Users in your database are defined as:**
- **Students**: Academic users enrolled in universities, identified by unique student IDs and emails
- **University Admins**: Administrative users managing specific universities
- **Super Admin**: System-wide administrative user with full access

The system implements a hierarchical access control model where users can only access data relevant to their role and institutional affiliation. All users are stored in dedicated database tables with appropriate relationships to maintain data integrity and support the learning management system's functionality.