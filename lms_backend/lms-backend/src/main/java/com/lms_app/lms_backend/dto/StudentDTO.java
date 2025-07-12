package com.lms_app.lms_backend.dto;

import jakarta.validation.constraints.*;

public class StudentDTO {
    private Long id;
    
    @NotBlank(message = "Student ID is required")
    @Size(min = 5, max = 50, message = "Student ID must be between 5 and 50 characters")
    private String studentId;
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Major is required")
    @Size(min = 2, max = 100, message = "Major must be between 2 and 100 characters")
    private String major;
    
    @NotBlank(message = "Year is required")
    @Pattern(regexp = "[1-4]", message = "Year must be between 1 and 4")
    private String year;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number should be valid (10-15 digits)")
    private String phoneNumber;
    
    	@NotNull(message = "University ID is required")
	private Long universityId;
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getStudentId() {
		return studentId;
	}
	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMajor() {
		return major;
	}
	public void setMajor(String major) {
		this.major = major;
	}
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public Long getUniversityId() {
		return universityId;
	}
	public void setUniversityId(Long universityId) {
		this.universityId = universityId;
	}

    // Getters and Setters
    
}
