package com.lms_app.lms_backend.controller;

import com.lms_app.lms_backend.dto.CourseDTO;
import com.lms_app.lms_backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public CourseDTO createCourse(@Valid @RequestBody CourseDTO dto) {
        return courseService.createCourse(dto);
    }

    @GetMapping("/{id}")
    public CourseDTO getCourse(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PutMapping("/{id}")
    public CourseDTO updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO dto) {
        return courseService.updateCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
