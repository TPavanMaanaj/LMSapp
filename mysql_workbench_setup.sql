-- =============================================
-- LMS Database Setup for MySQL Workbench
-- =============================================
-- Execute this script in MySQL Workbench
-- Make sure you're connected as root user
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS university_admin_db;
USE university_admin_db;

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS university;

-- Create University table
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

-- Create Students table
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

-- Create Course table
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

-- Create Admin table
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

-- Create indexes for better performance
CREATE INDEX idx_students_university_id ON students(university_id);
CREATE INDEX idx_course_university_id ON course(university_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_admin_email ON admin(email);

-- Insert sample data
INSERT INTO university (uni_name, est_year, address, status, admin_name, students, courses) VALUES
('Indian Institute of Technology Delhi', '1961', 'Hauz Khas, New Delhi, Delhi 110016', 'ACTIVE', 'Dr. Rajesh Kumar', 8500, 180),
('Indian Institute of Technology Bombay', '1958', 'Powai, Mumbai, Maharashtra 400076', 'ACTIVE', 'Dr. Priya Sharma', 10200, 220),
('Indian Institute of Science', '1909', 'CV Raman Avenue, Bengaluru, Karnataka 560012', 'ACTIVE', 'Dr. Arjun Patel', 3500, 95);

INSERT INTO admin (admin_name, uni_name, role, status, email, students, phnnum, department, admin_status) VALUES
('Dr. Rajesh Kumar', 'Indian Institute of Technology Delhi', 'ADMIN', 'ACTIVE', 'admin@iitd.ac.in', 8500, 9876543210, 1, 'ACTIVE'),
('Dr. Priya Sharma', 'Indian Institute of Technology Bombay', 'ADMIN', 'ACTIVE', 'admin@iitb.ac.in', 10200, 9876543211, 2, 'ACTIVE'),
('Dr. Arjun Patel', 'Indian Institute of Science', 'ADMIN', 'ACTIVE', 'admin@iisc.ac.in', 3500, 9876543212, 3, 'ACTIVE');

INSERT INTO course (course_name, course_code, description, credits, instructor, university_id, status) VALUES
('Data Structures and Algorithms', 'CS201', 'Comprehensive study of data structures and algorithmic techniques', 4, 'Dr. Vikram Agarwal', 1, 'ACTIVE'),
('Advanced Engineering Mathematics', 'MATH301', 'Advanced mathematical concepts for engineering applications', 3, 'Dr. Sunita Joshi', 1, 'ACTIVE'),
('Machine Learning and AI', 'CS405', 'Introduction to machine learning algorithms and artificial intelligence', 4, 'Dr. Anand Krishnan', 2, 'ACTIVE');

INSERT INTO students (student_id, full_name, email, major, year, phone_number, university_id) VALUES
('IITD2024001', 'Aarav Gupta', 'aarav@iitd.ac.in', 'Computer Science and Engineering', '2', '9876543201', 1),
('IITD2024002', 'Kavya Reddy', 'kavya@iitd.ac.in', 'Computer Science and Engineering', '1', '9876543202', 1),
('IITB2024001', 'Diya Singh', 'diya@iitb.ac.in', 'Electrical Engineering', '3', '9876543204', 2),
('IISC2024001', 'Aryan Mehta', 'aryan@iisc.ac.in', 'Physics', '1', '9876543207', 3);

-- Verification
SELECT 'Database setup completed successfully!' as Status;
SELECT 'Tables created:' as Info;
SHOW TABLES;
SELECT 'Sample data inserted:' as Info;
SELECT COUNT(*) as University_Count FROM university;
SELECT COUNT(*) as Student_Count FROM students;
SELECT COUNT(*) as Course_Count FROM course;
SELECT COUNT(*) as Admin_Count FROM admin;