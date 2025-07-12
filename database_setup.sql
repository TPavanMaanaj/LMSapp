-- =============================================
-- LMS Database Setup Script
-- =============================================
-- Execute this script in MySQL Workbench
-- Username: root (no password)
-- =============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS university_admin_db;
USE university_admin_db;

-- Make sure we're using the root user (no additional user creation needed)
-- Spring Boot will connect as root with no password

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS university;

-- =============================================
-- 1. CREATE UNIVERSITY TABLE
-- =============================================
CREATE TABLE university (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uni_name VARCHAR(255) NOT NULL,
    est_year VARCHAR(10),
    address TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    admin_name VARCHAR(255),
    students INT DEFAULT 0,
    courses INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- 2. CREATE STUDENTS TABLE
-- =============================================
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

-- =============================================
-- 3. CREATE COURSE TABLE (Updated to match frontend)
-- =============================================
CREATE TABLE course (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(20),
    description TEXT,
    credits INT DEFAULT 3,
    instructor VARCHAR(255),
    university_id BIGINT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE SET NULL
);

-- =============================================
-- 4. CREATE ADMIN TABLE
-- =============================================
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

-- =============================================
-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_students_university_id ON students(university_id);
CREATE INDEX idx_course_university_id ON course(university_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_admin_email ON admin(email);
CREATE INDEX idx_university_status ON university(status);
CREATE INDEX idx_course_status ON course(status);

-- =============================================
-- 6. INSERT SAMPLE DATA
-- =============================================

-- Insert sample universities
INSERT INTO university (uni_name, est_year, address, status, admin_name, students, courses) VALUES
('Indian Institute of Technology Delhi', '1961', 'Hauz Khas, New Delhi, Delhi 110016', 'ACTIVE', 'Dr. Rajesh Kumar', 8500, 180),
('Indian Institute of Technology Bombay', '1958', 'Powai, Mumbai, Maharashtra 400076', 'ACTIVE', 'Dr. Priya Sharma', 10200, 220),
('Indian Institute of Science', '1909', 'CV Raman Avenue, Bengaluru, Karnataka 560012', 'ACTIVE', 'Dr. Arjun Patel', 3500, 95),
('Indian Institute of Technology Madras', '1959', 'Sardar Patel Road, Chennai, Tamil Nadu 600036', 'ACTIVE', 'Dr. Kavitha Nair', 9800, 200),
('Indian Institute of Technology Kanpur', '1959', 'Kalyanpur, Kanpur, Uttar Pradesh 208016', 'ACTIVE', 'Dr. Suresh Reddy', 7200, 165);

-- Insert sample admins
INSERT INTO admin (admin_name, uni_name, role, status, email, students, phnnum, department, admin_status) VALUES
('Dr. Rajesh Kumar', 'Indian Institute of Technology Delhi', 'ADMIN', 'ACTIVE', 'admin@iitd.ac.in', 8500, 9876543210, 1, 'ACTIVE'),
('Dr. Priya Sharma', 'Indian Institute of Technology Bombay', 'ADMIN', 'ACTIVE', 'admin@iitb.ac.in', 10200, 9876543211, 2, 'ACTIVE'),
('Dr. Arjun Patel', 'Indian Institute of Science', 'ADMIN', 'ACTIVE', 'admin@iisc.ac.in', 3500, 9876543212, 3, 'ACTIVE'),
('Dr. Kavitha Nair', 'Indian Institute of Technology Madras', 'ADMIN', 'ACTIVE', 'admin@iitm.ac.in', 9800, 9876543213, 4, 'ACTIVE'),
('Dr. Suresh Reddy', 'Indian Institute of Technology Kanpur', 'ADMIN', 'ACTIVE', 'admin@iitk.ac.in', 7200, 9876543214, 5, 'ACTIVE');

-- Insert sample courses
INSERT INTO course (course_name, course_code, description, credits, instructor, university_id, status) VALUES
('Data Structures and Algorithms', 'CS201', 'Comprehensive study of data structures and algorithmic techniques', 4, 'Dr. Vikram Agarwal', 1, 'ACTIVE'),
('Advanced Engineering Mathematics', 'MATH301', 'Advanced mathematical concepts for engineering applications', 3, 'Dr. Sunita Joshi', 1, 'ACTIVE'),
('Machine Learning and AI', 'CS405', 'Introduction to machine learning algorithms and artificial intelligence', 4, 'Dr. Anand Krishnan', 2, 'ACTIVE'),
('Digital Signal Processing', 'EE302', 'Digital signal processing techniques and applications', 3, 'Dr. Meera Iyer', 2, 'ACTIVE'),
('Quantum Physics', 'PHY301', 'Fundamentals of quantum mechanics and applications', 4, 'Dr. Ramesh Chandra', 3, 'ACTIVE'),
('Computer Networks', 'CS301', 'Network protocols and distributed systems', 3, 'Dr. Amit Sharma', 1, 'ACTIVE'),
('Database Management Systems', 'CS302', 'Database design and management concepts', 4, 'Dr. Neha Gupta', 2, 'ACTIVE'),
('Operating Systems', 'CS303', 'Operating system concepts and implementation', 3, 'Dr. Rajesh Verma', 3, 'ACTIVE');

-- Insert sample students
INSERT INTO students (student_id, full_name, email, major, year, phone_number, university_id) VALUES
('IITD2024001', 'Aarav Gupta', 'aarav@iitd.ac.in', 'Computer Science and Engineering', '2', '9876543201', 1),
('IITD2024002', 'Kavya Reddy', 'kavya@iitd.ac.in', 'Computer Science and Engineering', '1', '9876543202', 1),
('IITD2024003', 'Arjun Mehta', 'arjun.mehta@iitd.ac.in', 'Electrical Engineering', '3', '9876543203', 1),
('IITB2024001', 'Diya Singh', 'diya@iitb.ac.in', 'Electrical Engineering', '3', '9876543204', 2),
('IITB2024002', 'Rohan Sharma', 'rohan@iitb.ac.in', 'Computer Science and Engineering', '2', '9876543205', 2),
('IITB2024003', 'Priya Patel', 'priya@iitb.ac.in', 'Mechanical Engineering', '1', '9876543206', 2),
('IISC2024001', 'Aryan Mehta', 'aryan@iisc.ac.in', 'Physics', '1', '9876543207', 3),
('IISC2024002', 'Sneha Iyer', 'sneha@iisc.ac.in', 'Chemistry', '2', '9876543208', 3),
('IITM2024001', 'Karthik Raj', 'karthik@iitm.ac.in', 'Aerospace Engineering', '4', '9876543209', 4),
('IITK2024001', 'Ananya Sharma', 'ananya@iitk.ac.in', 'Civil Engineering', '3', '9876543210', 5);

-- =============================================
-- 7. VERIFICATION QUERIES
-- =============================================

-- Check if tables were created successfully
SELECT 'Universities' as Table_Name, COUNT(*) as Row_Count FROM university
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Courses', COUNT(*) FROM course
UNION ALL
SELECT 'Admins', COUNT(*) FROM admin;

-- Show table structures
DESCRIBE university;
DESCRIBE students;
DESCRIBE course;
DESCRIBE admin;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Database setup completed successfully!' as Status;
SELECT 'You can now run the Spring Boot application' as Next_Step;