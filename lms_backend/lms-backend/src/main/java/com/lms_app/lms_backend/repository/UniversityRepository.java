package com.lms_app.lms_backend.repository;

import com.lms_app.lms_backend.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByAdminName(String adminName);
    Optional<University> findByUniName(String uniName);
}

