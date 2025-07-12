package com.lms_app.lms_backend.dto;

import jakarta.validation.constraints.*;

public class UniversityDTO {
    private Long id;
    
    @NotBlank(message = "University name is required")
    @Size(min = 2, max = 255, message = "University name must be between 2 and 255 characters")
    private String uniName;
    
    @NotBlank(message = "Establishment year is required")
    @Pattern(regexp = "\\d{4}", message = "Establishment year must be a 4-digit year")
    private String estYear;
    
    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 500, message = "Address must be between 10 and 500 characters")
    private String address;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status must be ACTIVE or INACTIVE")
    private String status;
    
    @NotBlank(message = "Admin name is required")
    @Size(min = 2, max = 255, message = "Admin name must be between 2 and 255 characters")
    private String adminName;
    
    @Min(value = 0, message = "Number of students cannot be negative")
    private int students;
    
    	@Min(value = 0, message = "Number of courses cannot be negative")
	private int courses;
	
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
	public int getStudents() {
		return students;
	}
	public void setStudents(int students) {
		this.students = students;
	}
	public int getCourses() {
		return courses;
	}
	public void setCourses(int courses) {
		this.courses = courses;
	}

    // Getters and Setters
    
}