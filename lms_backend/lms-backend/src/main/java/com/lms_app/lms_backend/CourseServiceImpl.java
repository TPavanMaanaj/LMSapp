package com.lms_app.lms_backend;

import com.lms_app.lms_backend.dto.CourseDTO;
import com.lms_app.lms_backend.entity.Course;
import com.lms_app.lms_backend.entity.University;
import com.lms_app.lms_backend.exception.ResourceNotFoundException;
import com.lms_app.lms_backend.repository.CourseRepository;
import com.lms_app.lms_backend.repository.UniversityRepository;
import com.lms_app.lms_backend.service.CourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UniversityRepository universityRepository;

    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setInstructor(course.getInstructor());
        dto.setStatus(course.getStatus() != null ? course.getStatus().toString() : "ACTIVE");
        dto.setUniversityId(course.getUniversity().getId());
        return dto;
    }

    private Course convertToEntity(CourseDTO dto) {
        Course course = new Course();
        course.setCourseName(dto.getCourseName());
        course.setCourseCode(dto.getCourseCode());
        course.setDescription(dto.getDescription());
        course.setCredits(dto.getCredits());
        course.setInstructor(dto.getInstructor());
        course.setStatus(dto.getStatus() != null ? Course.Status.valueOf(dto.getStatus()) : Course.Status.ACTIVE);
        University university = universityRepository.findById(dto.getUniversityId())
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        course.setUniversity(university);
        return course;
    }

    @Override
    public CourseDTO createCourse(CourseDTO dto) {
        Course course = convertToEntity(dto);
        return convertToDTO(courseRepository.save(course));
    }

    @Override
    public CourseDTO getCourseById(Long id) {
        return convertToDTO(courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found")));
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        existing.setCourseName(dto.getCourseName());
        existing.setCourseCode(dto.getCourseCode());
        existing.setDescription(dto.getDescription());
        existing.setCredits(dto.getCredits());
        existing.setInstructor(dto.getInstructor());
        existing.setStatus(dto.getStatus() != null ? Course.Status.valueOf(dto.getStatus()) : Course.Status.ACTIVE);
        return convertToDTO(courseRepository.save(existing));
    }

    @Override
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        courseRepository.delete(course);
    }
}