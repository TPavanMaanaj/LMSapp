-- =============================================
-- Enhanced LMS Database Setup for Multi-Tenant SaaS
-- =============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS university_admin_db;
USE university_admin_db;

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS course_materials;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS university;
DROP TABLE IF EXISTS tenants;

-- =============================================
-- 1. CREATE TENANTS TABLE (Multi-tenant support)
-- =============================================
CREATE TABLE tenants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    subdomain VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    plan ENUM('BASIC', 'PREMIUM', 'ENTERPRISE') DEFAULT 'BASIC',
    storage_limit BIGINT DEFAULT 21474836480, -- 20GB in bytes
    storage_used BIGINT DEFAULT 0,
    max_universities INT DEFAULT 1,
    max_students INT DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. CREATE UNIVERSITY TABLE (Enhanced)
-- =============================================
CREATE TABLE university (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT,
    uni_name VARCHAR(255) NOT NULL,
    est_year VARCHAR(10),
    address TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    admin_name VARCHAR(255),
    students INT DEFAULT 0,
    courses INT DEFAULT 0,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- =============================================
-- 3. CREATE ADMIN TABLE (Enhanced)
-- =============================================
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT,
    admin_name VARCHAR(255) NOT NULL,
    uni_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'ADMIN',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    students INT DEFAULT 0,
    phnnum BIGINT,
    department INT,
    admin_status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- =============================================
-- 4. CREATE COURSE TABLE (Enhanced)
-- =============================================
CREATE TABLE course (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(20),
    description TEXT,
    credits INT DEFAULT 3,
    instructor VARCHAR(255),
    university_id BIGINT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    capacity INT DEFAULT 50,
    enrolled_count INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE SET NULL
);

-- =============================================
-- 5. CREATE STUDENTS TABLE (Enhanced)
-- =============================================
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    major VARCHAR(100),
    year VARCHAR(10),
    phone_number VARCHAR(20),
    university_id BIGINT,
    date_of_birth DATE,
    address TEXT,
    profile_picture_url VARCHAR(500),
    gpa DECIMAL(3,2),
    status ENUM('ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED') DEFAULT 'ACTIVE',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE SET NULL
);

-- =============================================
-- 6. CREATE ENROLLMENTS TABLE
-- =============================================
CREATE TABLE enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT,
    student_id BIGINT,
    course_id BIGINT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ENROLLED', 'COMPLETED', 'DROPPED') DEFAULT 'PENDING',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    progress INT DEFAULT 0, -- 0-100
    grade VARCHAR(5),
    final_score DECIMAL(5,2),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- =============================================
-- 7. CREATE COURSE MATERIALS TABLE
-- =============================================
CREATE TABLE course_materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT,
    course_id BIGINT,
    title VARCHAR(255) NOT NULL,
    type ENUM('DOCUMENT', 'VIDEO', 'LINK', 'ASSIGNMENT', 'PRESENTATION', 'AUDIO') NOT NULL,
    url VARCHAR(1000) NOT NULL,
    description TEXT,
    file_size BIGINT, -- in bytes
    duration VARCHAR(20), -- for videos/audio
    is_public BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- =============================================
-- 8. CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);

CREATE INDEX idx_university_tenant ON university(tenant_id);
CREATE INDEX idx_university_status ON university(status);
CREATE INDEX idx_university_admin_name ON university(admin_name);

CREATE INDEX idx_admin_tenant ON admin(tenant_id);
CREATE INDEX idx_admin_email ON admin(email);
CREATE INDEX idx_admin_status ON admin(status);

CREATE INDEX idx_course_tenant ON course(tenant_id);
CREATE INDEX idx_course_university ON course(university_id);
CREATE INDEX idx_course_status ON course(status);
CREATE INDEX idx_course_instructor ON course(instructor);

CREATE INDEX idx_students_tenant ON students(tenant_id);
CREATE INDEX idx_students_university ON students(university_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);

CREATE INDEX idx_enrollments_tenant ON enrollments(tenant_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

CREATE INDEX idx_materials_tenant ON course_materials(tenant_id);
CREATE INDEX idx_materials_course ON course_materials(course_id);
CREATE INDEX idx_materials_type ON course_materials(type);

-- =============================================
-- 9. INSERT SAMPLE TENANTS
-- =============================================
INSERT INTO tenants (name, subdomain, domain, status, plan, storage_limit, max_universities, max_students) VALUES
('Indian Institute of Technology System', 'iit', 'iit-system.edu', 'ACTIVE', 'ENTERPRISE', 107374182400, 25, 150000), -- 100GB
('State University Network', 'stateuni', 'stateuni.edu', 'ACTIVE', 'PREMIUM', 53687091200, 10, 50000), -- 50GB
('Community College Alliance', 'ccalliance', 'ccalliance.edu', 'ACTIVE', 'BASIC', 21474836480, 5, 20000); -- 20GB

-- =============================================
-- 10. INSERT SAMPLE DATA WITH TENANT ASSOCIATIONS
-- =============================================

-- Insert sample universities
INSERT INTO university (tenant_id, uni_name, est_year, address, status, admin_name, students, courses, email, phone) VALUES
(1, 'Indian Institute of Technology Delhi', '1961', 'Hauz Khas, New Delhi, Delhi 110016', 'ACTIVE', 'Dr. Rajesh Kumar', 8500, 180, 'info@iitd.ac.in', '+91-11-2659-1000'),
(1, 'Indian Institute of Technology Bombay', '1958', 'Powai, Mumbai, Maharashtra 400076', 'ACTIVE', 'Dr. Priya Sharma', 10200, 220, 'info@iitb.ac.in', '+91-22-2572-2545'),
(1, 'Indian Institute of Science', '1909', 'CV Raman Avenue, Bengaluru, Karnataka 560012', 'ACTIVE', 'Dr. Arjun Patel', 3500, 95, 'info@iisc.ac.in', '+91-80-2293-2001'),
(2, 'State University of Technology', '1975', 'Tech Campus, State City, ST 12345', 'ACTIVE', 'Dr. Sarah Johnson', 15000, 150, 'info@sut.edu', '+1-555-123-4567'),
(3, 'Community College Central', '1985', 'Main Street, Community City, CC 67890', 'ACTIVE', 'Dr. Michael Brown', 5000, 75, 'info@ccc.edu', '+1-555-987-6543');

-- Insert sample admins
INSERT INTO admin (tenant_id, admin_name, uni_name, role, status, email, students, phnnum, department, admin_status) VALUES
(1, 'Dr. Rajesh Kumar', 'Indian Institute of Technology Delhi', 'ADMIN', 'ACTIVE', 'admin@iitd.ac.in', 8500, 9876543210, 1, 'ACTIVE'),
(1, 'Dr. Priya Sharma', 'Indian Institute of Technology Bombay', 'ADMIN', 'ACTIVE', 'admin@iitb.ac.in', 10200, 9876543211, 2, 'ACTIVE'),
(1, 'Dr. Arjun Patel', 'Indian Institute of Science', 'ADMIN', 'ACTIVE', 'admin@iisc.ac.in', 3500, 9876543212, 3, 'ACTIVE'),
(2, 'Dr. Sarah Johnson', 'State University of Technology', 'ADMIN', 'ACTIVE', 'admin@sut.edu', 15000, 5551234567, 1, 'ACTIVE'),
(3, 'Dr. Michael Brown', 'Community College Central', 'ADMIN', 'ACTIVE', 'admin@ccc.edu', 5000, 5559876543, 1, 'ACTIVE');

-- Insert sample courses
INSERT INTO course (tenant_id, course_name, course_code, description, credits, instructor, university_id, status, capacity, start_date, end_date) VALUES
(1, 'Data Structures and Algorithms', 'CS201', 'Comprehensive study of data structures and algorithmic techniques', 4, 'Dr. Vikram Agarwal', 1, 'ACTIVE', 120, '2024-01-15', '2024-05-15'),
(1, 'Advanced Engineering Mathematics', 'MATH301', 'Advanced mathematical concepts for engineering applications', 3, 'Dr. Sunita Joshi', 1, 'ACTIVE', 80, '2024-01-15', '2024-05-15'),
(1, 'Machine Learning and AI', 'CS405', 'Introduction to machine learning algorithms and artificial intelligence', 4, 'Dr. Anand Krishnan', 2, 'ACTIVE', 150, '2024-01-15', '2024-05-15'),
(1, 'Digital Signal Processing', 'EE302', 'Digital signal processing techniques and applications', 3, 'Dr. Meera Iyer', 2, 'ACTIVE', 90, '2024-01-15', '2024-05-15'),
(1, 'Quantum Physics', 'PHY301', 'Fundamentals of quantum mechanics and applications', 4, 'Dr. Ramesh Chandra', 3, 'ACTIVE', 60, '2024-01-15', '2024-05-15'),
(2, 'Introduction to Programming', 'CS101', 'Basic programming concepts and problem solving', 3, 'Prof. Jane Smith', 4, 'ACTIVE', 200, '2024-01-15', '2024-05-15'),
(3, 'Business Communications', 'BUS101', 'Effective communication in business environments', 3, 'Prof. Robert Davis', 5, 'ACTIVE', 100, '2024-01-15', '2024-05-15');

-- Insert sample students
INSERT INTO students (tenant_id, student_id, full_name, email, major, year, phone_number, university_id, status) VALUES
(1, 'IITD2024001', 'Aarav Gupta', 'aarav@iitd.ac.in', 'Computer Science and Engineering', '2', '9876543201', 1, 'ACTIVE'),
(1, 'IITD2024002', 'Kavya Reddy', 'kavya@iitd.ac.in', 'Computer Science and Engineering', '1', '9876543202', 1, 'ACTIVE'),
(1, 'IITD2024003', 'Arjun Mehta', 'arjun.mehta@iitd.ac.in', 'Electrical Engineering', '3', '9876543203', 1, 'ACTIVE'),
(1, 'IITB2024001', 'Diya Singh', 'diya@iitb.ac.in', 'Electrical Engineering', '3', '9876543204', 2, 'ACTIVE'),
(1, 'IITB2024002', 'Rohan Sharma', 'rohan@iitb.ac.in', 'Computer Science and Engineering', '2', '9876543205', 2, 'ACTIVE'),
(1, 'IISC2024001', 'Aryan Mehta', 'aryan@iisc.ac.in', 'Physics', '1', '9876543207', 3, 'ACTIVE'),
(2, 'SUT2024001', 'Emily Johnson', 'emily@sut.edu', 'Computer Science', '2', '5551234568', 4, 'ACTIVE'),
(3, 'CCC2024001', 'David Wilson', 'david@ccc.edu', 'Business Administration', '1', '5559876544', 5, 'ACTIVE');

-- Insert sample enrollments
INSERT INTO enrollments (tenant_id, student_id, course_id, status, progress, grade) VALUES
(1, 1, 1, 'ENROLLED', 75, 'A'),
(1, 1, 2, 'ENROLLED', 60, 'B+'),
(1, 2, 1, 'ENROLLED', 85, 'A-'),
(1, 4, 3, 'ENROLLED', 70, 'B+'),
(1, 4, 4, 'ENROLLED', 90, 'A'),
(1, 6, 5, 'ENROLLED', 95, 'A+'),
(2, 7, 6, 'ENROLLED', 80, 'A-'),
(3, 8, 7, 'ENROLLED', 65, 'B');

-- Insert sample course materials
INSERT INTO course_materials (tenant_id, course_id, title, type, url, description, file_size) VALUES
(1, 1, 'Course Introduction', 'DOCUMENT', '/materials/cs201/intro.pdf', 'Course syllabus and introduction', 2621440),
(1, 1, 'Lecture 1: Arrays and Linked Lists', 'VIDEO', '/materials/cs201/lecture1.mp4', 'Introduction to basic data structures', 157286400),
(1, 1, 'Assignment 1: Array Operations', 'ASSIGNMENT', '/materials/cs201/assignment1.pdf', 'Practice problems on array operations', 1048576),
(1, 2, 'Mathematical Foundations', 'DOCUMENT', '/materials/math301/foundations.pdf', 'Review of mathematical concepts', 3145728),
(1, 3, 'ML Fundamentals', 'VIDEO', '/materials/cs405/ml-intro.mp4', 'Introduction to machine learning', 209715200),
(1, 3, 'Python for ML', 'LINK', 'https://python-ml-tutorial.com', 'External tutorial on Python for ML', NULL);

-- =============================================
-- 11. VERIFICATION QUERIES
-- =============================================
SELECT 'Multi-Tenant LMS Database Setup Complete!' as Status;

SELECT 'Tenants' as Entity, COUNT(*) as Count FROM tenants
UNION ALL
SELECT 'Universities', COUNT(*) FROM university
UNION ALL
SELECT 'Admins', COUNT(*) FROM admin
UNION ALL
SELECT 'Courses', COUNT(*) FROM course
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'Course Materials', COUNT(*) FROM course_materials;

-- Show tenant distribution
SELECT 
    t.name as Tenant,
    COUNT(DISTINCT u.id) as Universities,
    COUNT(DISTINCT s.id) as Students,
    COUNT(DISTINCT c.id) as Courses
FROM tenants t
LEFT JOIN university u ON t.id = u.tenant_id
LEFT JOIN students s ON t.id = s.tenant_id
LEFT JOIN course c ON t.id = c.tenant_id
GROUP BY t.id, t.name;