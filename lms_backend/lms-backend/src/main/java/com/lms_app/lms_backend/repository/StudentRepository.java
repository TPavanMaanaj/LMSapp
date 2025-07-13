package com.lms_app.lms_backend.repository;

import com.lms_app.lms_backend.entity.Students;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Students, Long> {
    boolean existsByEmail(String email);
    Optional<Students> findByEmail(String email);
}