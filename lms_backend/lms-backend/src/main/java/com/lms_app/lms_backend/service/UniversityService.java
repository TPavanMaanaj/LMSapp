package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.UniversityDTO;
import java.util.List;

public interface UniversityService {
    List<UniversityDTO> getAllUniversities();
    UniversityDTO getUniversityById(Long id);
    UniversityDTO createUniversity(UniversityDTO universityDTO);
    UniversityDTO updateUniversity(Long id, UniversityDTO universityDTO);
    void deleteUniversity(Long id);
}
