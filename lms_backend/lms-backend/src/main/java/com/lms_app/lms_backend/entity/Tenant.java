package com.lms_app.lms_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String subdomain;

    @Column(nullable = false)
    private String domain;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Enumerated(EnumType.STRING)
    private Plan plan = Plan.BASIC;

    @Column(name = "storage_limit")
    private Long storageLimit; // in bytes

    @Column(name = "storage_used")
    private Long storageUsed = 0L;

    @Column(name = "max_universities")
    private Integer maxUniversities = 1;

    @Column(name = "max_students")
    private Integer maxStudents = 1000;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_activity")
    private LocalDateTime lastActivity = LocalDateTime.now();

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Feature> features;

    public enum Status {
        ACTIVE, INACTIVE, SUSPENDED
    }

    public enum Plan {
        BASIC, PREMIUM, ENTERPRISE
    }

    public enum Feature {
        MULTI_UNIVERSITY,
        ADVANCED_ANALYTICS,
        API_ACCESS,
        CUSTOM_BRANDING,
        EMAIL_SUPPORT,
        PHONE_SUPPORT,
        SINGLE_SIGN_ON,
        BULK_OPERATIONS
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubdomain() {
        return subdomain;
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public Long getStorageLimit() {
        return storageLimit;
    }

    public void setStorageLimit(Long storageLimit) {
        this.storageLimit = storageLimit;
    }

    public Long getStorageUsed() {
        return storageUsed;
    }

    public void setStorageUsed(Long storageUsed) {
        this.storageUsed = storageUsed;
    }

    public Integer getMaxUniversities() {
        return maxUniversities;
    }

    public void setMaxUniversities(Integer maxUniversities) {
        this.maxUniversities = maxUniversities;
    }

    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}