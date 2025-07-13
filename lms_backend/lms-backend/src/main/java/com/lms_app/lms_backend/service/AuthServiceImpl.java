package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.LoginResponse;
import com.lms_app.lms_backend.entity.Admin;
import com.lms_app.lms_backend.entity.Students;
import com.lms_app.lms_backend.repository.AdminRepository;
import com.lms_app.lms_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public LoginResponse authenticate(String email, String password) {
        LoginResponse response = new LoginResponse();
        
        // For demo purposes, we'll use simple password validation
        if (!"password".equals(password)) {
            response.setSuccess(false);
            response.setMessage("Invalid credentials");
            return response;
        }

        // Check if super admin
        if ("superadmin@lms.com".equals(email)) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", "1");
            user.put("email", email);
            user.put("name", "Super Administrator");
            user.put("role", "super_admin");
            
            response.setSuccess(true);
            response.setUser(user);
            response.setToken("super_admin_token_" + System.currentTimeMillis());
            return response;
        }

        // Check admin table
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            Map<String, Object> user = new HashMap<>();
            user.put("id", admin.getId().toString());
            user.put("email", admin.getEmail());
            user.put("name", admin.getAdminName());
            user.put("role", "university_admin");
            user.put("universityName", admin.getUniName());
            
            // Find university ID by admin name
            // This is a simplified approach - in production you'd have a proper foreign key
            user.put("universityId", "1"); // Default for demo, should be dynamic
            
            response.setSuccess(true);
            response.setUser(user);
            response.setToken("admin_token_" + System.currentTimeMillis());
            return response;
        }

        // Check student table
        Optional<Students> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            Students student = studentOpt.get();
            Map<String, Object> user = new HashMap<>();
            user.put("id", student.getId().toString());
            user.put("email", student.getEmail());
            user.put("name", student.getFullName());
            user.put("role", "student");
            user.put("studentId", student.getStudentId());
            user.put("universityId", student.getUniversity() != null ? student.getUniversity().getId().toString() : "1");
            user.put("major", student.getMajor());
            user.put("year", student.getYear());
            
            response.setSuccess(true);
            response.setUser(user);
            response.setToken("student_token_" + System.currentTimeMillis());
            return response;
        }

        response.setSuccess(false);
        response.setMessage("User not found");
        return response;
    }

    @Override
    public Map<String, Object> getCurrentUser(String token) {
        // Simple token validation for demo
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token format");
        }
        
        String actualToken = token.substring(7);
        if (actualToken.startsWith("super_admin_token")) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", "1");
            user.put("email", "superadmin@lms.com");
            user.put("name", "Super Administrator");
            user.put("role", "super_admin");
            return user;
        }
        
        throw new RuntimeException("Invalid token");
    }

    @Override
    public boolean validateToken(String token) {
        try {
            getCurrentUser(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}