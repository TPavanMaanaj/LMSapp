package com.lms_app.lms_backend.dto;

import jakarta.validation.constraints.*;

public class CourseDTO {
    private Long id;
    
    @NotBlank(message = "Course name is required")
    @Size(min = 2, max = 255, message = "Course name must be between 2 and 255 characters")
    private String courseName;
    
    @Size(max = 20, message = "Course code cannot exceed 20 characters")
    private String courseCode;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 10, message = "Credits cannot exceed 10")
    private int credits;
    
    @NotBlank(message = "Instructor name is required")
    @Size(min = 2, max = 255, message = "Instructor name must be between 2 and 255 characters")
    private String instructor;
    
    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status must be ACTIVE or INACTIVE")
    private String status;
    
    @NotNull(message = "University ID is required")
    private Long universityId;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCourseCode() {
		return courseCode;
	}
	public void setCourseCode(String courseCode) {
		this.courseCode = courseCode;
	}
	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getCredits() {
		return credits;
	}
	public void setCredits(int credits) {
		this.credits = credits;
	}
	public Long getUniversityId() {
		return universityId;
	}
	public void setUniversityId(Long universityId) {
		this.universityId = universityId;
	}

	public String getInstructor() {
		return instructor;
	}

	public void setInstructor(String instructor) {
		this.instructor = instructor;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}