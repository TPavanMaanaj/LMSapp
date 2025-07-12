# MySQL Workbench Database Setup Guide

## Prerequisites
- MySQL Workbench installed
- MySQL Server running
- Root user access (no password required)

## Setup Instructions

### Step 1: Connect to MySQL
1. Open MySQL Workbench
2. Create a new connection or use existing connection
3. Use the following connection details:
   - **Connection Name**: LMS Database
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: root
   - **Password**: (leave empty)

### Step 2: Execute Database Setup Script
1. Open the file `mysql_workbench_setup.sql` in MySQL Workbench
2. Execute the entire script by clicking the "Execute" button (⚡) or pressing Ctrl+Shift+Enter
3. The script will:
   - Create the `university_admin_db` database
   - Create all necessary tables (university, students, course, admin)
   - Insert sample data
   - Show verification results

### Step 3: Verify Setup
After execution, you should see:
- ✅ Database created successfully
- ✅ Tables created: university, students, course, admin
- ✅ Sample data inserted
- ✅ Verification counts displayed

## Table Structure

### 1. University Table
- `id` (Primary Key)
- `uni_name` (University Name)
- `est_year` (Established Year)
- `address` (Address)
- `status` (ACTIVE/INACTIVE)
- `admin_name` (Admin Name)
- `students` (Student Count)
- `courses` (Course Count)

### 2. Students Table
- `id` (Primary Key)
- `student_id` (Unique Student ID)
- `full_name` (Full Name)
- `email` (Email Address)
- `major` (Major/Field of Study)
- `year` (Academic Year)
- `phone_number` (Phone Number)
- `university_id` (Foreign Key to University)

### 3. Course Table
- `id` (Primary Key)
- `course_name` (Course Name)
- `course_code` (Course Code)
- `description` (Course Description)
- `credits` (Credit Hours)
- `instructor` (Instructor Name)
- `university_id` (Foreign Key to University)
- `status` (ACTIVE/INACTIVE)

### 4. Admin Table
- `id` (Primary Key)
- `admin_name` (Admin Name)
- `uni_name` (University Name)
- `role` (Role)
- `status` (ACTIVE/INACTIVE)
- `email` (Email Address)
- `students` (Student Count)
- `phnnum` (Phone Number)
- `department` (Department ID)
- `admin_status` (Admin Status)

## Sample Data Included

The script includes sample data for:
- **3 Universities**: IIT Delhi, IIT Bombay, IISc Bangalore
- **3 Admins**: One for each university
- **3 Courses**: Various subjects across universities
- **4 Students**: Distributed across universities

## Next Steps

After database setup:
1. Start the Spring Boot backend: `./start-backend.sh`
2. Start the React frontend: `./start-frontend.sh`
3. Access the application at: http://localhost:3000

## Troubleshooting

### Common Issues:
1. **Connection Error**: Make sure MySQL server is running
2. **Permission Denied**: Ensure you're connected as root user
3. **Table Already Exists**: The script includes DROP TABLE statements to handle this

### Verification Queries:
```sql
-- Check if database exists
SHOW DATABASES LIKE 'university_admin_db';

-- Check tables
USE university_admin_db;
SHOW TABLES;

-- Check sample data
SELECT COUNT(*) FROM university;
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM course;
SELECT COUNT(*) FROM admin;
```

## Configuration Notes

The Spring Boot application is configured to connect using:
- **Database**: university_admin_db
- **Username**: root
- **Password**: (empty)
- **Port**: 3306

Make sure these settings match your MySQL configuration.