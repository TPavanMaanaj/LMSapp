package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.LoginResponse;
import java.util.Map;

public interface AuthService {
    LoginResponse authenticate(String email, String password);
    Map<String, Object> getCurrentUser(String token);
    boolean validateToken(String token);
}