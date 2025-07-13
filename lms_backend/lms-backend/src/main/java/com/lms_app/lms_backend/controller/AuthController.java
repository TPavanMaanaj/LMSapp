package com.lms_app.lms_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lms_app.lms_backend.entity.Students;
import com.lms_app.lms_backend.entity.Admin;
import com.lms_app.lms_backend.repository.StudentRepository;
import com.lms_app.lms_backend.repository.AdminRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if it's super admin
        if ("superadmin@lms.com".equals(loginRequest.getEmail()) && "password".equals(loginRequest.getPassword())) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", "1");
            user.put("email", "superadmin@lms.com");
            user.put("name", "Super Administrator");
            user.put("role", "super_admin");
            user.put("createdAt", "2024-01-01T00:00:00Z");
            
            response.put("success", true);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }
        
        // Check if it's a student
        Optional<Students> student = studentRepository.findByEmail(loginRequest.getEmail());
        if (student.isPresent() && "password".equals(loginRequest.getPassword())) {
            Students s = student.get();
            Map<String, Object> user = new HashMap<>();
            user.put("id", s.getId().toString());
            user.put("email", s.getEmail());
            user.put("name", s.getFullName());
            user.put("role", "student");
            user.put("universityId", s.getUniversity() != null ? s.getUniversity().getId().toString() : null);
            user.put("studentId", s.getStudentId());
            user.put("createdAt", "2024-01-01T00:00:00Z");
            
            response.put("success", true);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }
        
        // Check if it's an admin
        Optional<Admin> admin = adminRepository.findByEmail(loginRequest.getEmail());
        if (admin.isPresent() && "password".equals(loginRequest.getPassword())) {
            Admin a = admin.get();
            Map<String, Object> user = new HashMap<>();
            user.put("id", a.getId().toString());
            user.put("email", a.getEmail());
            user.put("name", a.getAdminName());
            user.put("role", "university_admin");
            user.put("createdAt", "2024-01-01T00:00:00Z");
            
            response.put("success", true);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }
        
        // Invalid credentials
        response.put("success", false);
        response.put("message", "Invalid email or password");
        return ResponseEntity.badRequest().body(response);
    }
    
    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
}