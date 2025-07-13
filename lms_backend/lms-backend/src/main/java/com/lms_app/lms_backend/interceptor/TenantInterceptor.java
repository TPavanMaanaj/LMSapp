package com.lms_app.lms_backend.interceptor;

import com.lms_app.lms_backend.config.TenantConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Autowired
    private TenantConfig.TenantContext tenantContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String host = request.getHeader("Host");
        String tenantId = extractTenantFromHost(host);
        
        if (tenantId != null) {
            tenantContext.setTenantId(tenantId);
            tenantContext.setSubdomain(tenantId);
            tenantContext.setTenantName(tenantId + " LMS");
        } else {
            // Default tenant for direct access
            tenantContext.setTenantId("default");
            tenantContext.setSubdomain("default");
            tenantContext.setTenantName("Default LMS");
        }
        
        return true;
    }

    private String extractTenantFromHost(String host) {
        if (host == null) return null;
        
        // Extract subdomain from host
        // Example: iit.lms.com -> iit
        String[] parts = host.split("\\.");
        if (parts.length >= 3 && !parts[0].equals("www")) {
            return parts[0];
        }
        
        return null;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // Clear tenant context after request
        tenantContext.setTenantId(null);
        tenantContext.setSubdomain(null);
        tenantContext.setTenantName(null);
    }
}