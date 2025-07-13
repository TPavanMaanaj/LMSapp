package com.lms_app.lms_backend.dto;

public class UniversityDTO {
    private Long id;
    private String uniName;
    private String estYear;
    private String address;
    private String status;
    private String adminName;
    private Integer students;
    private Integer courses;

    // Default constructor
    public UniversityDTO() {}

    // Constructor with parameters
    public UniversityDTO(Long id, String uniName, String estYear, String address, String status, String adminName, Integer students, Integer courses) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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