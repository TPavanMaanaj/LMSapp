package com.lms_app.lms_backend.repository;

import com.lms_app.lms_backend.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    // JpaRepository provides basic CRUD operations
    // Additional custom queries can be added here if needed
}

