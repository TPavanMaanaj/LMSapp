package com.lms_app.lms_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "university")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uni_name", nullable = false)
    private String uniName;

    @Column(name = "est_year")
    private String estYear;

    @Column(name = "address")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "admin_name")
    private String adminName;

    @Column(name = "students")
    private Integer students;

    @Column(name = "courses")
    private Integer courses;

    public enum Status {
        ACTIVE, INACTIVE
    }

    // Default constructor
    public University() {}

    // Constructor with parameters
    public University(String uniName, String estYear, String address, Status status, String adminName, Integer students, Integer courses) {
        this.uniName = uniName;
        this.estYear = estYear;
        this.address = address;
        this.status = status;
        this.adminName = adminName;
        this.students = students;
        this.courses = courses;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUniName() {
        return uniName;
    }

    public void setUniName(String uniName) {
        this.uniName = uniName;
    }

    public String getEstYear() {
        return estYear;
    }

    public void setEstYear(String estYear) {
        this.estYear = estYear;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public Integer getStudents() {
        return students;
    }

    public void setStudents(Integer students) {
        this.students = students;
    }

    public Integer getCourses() {
        return courses;
    }

    public void setCourses(Integer courses) {
        this.courses = courses;
    }
}