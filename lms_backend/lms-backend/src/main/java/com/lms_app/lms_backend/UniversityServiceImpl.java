package com.lms_app.lms_backend;

import com.lms_app.lms_backend.dto.UniversityDTO;
import com.lms_app.lms_backend.entity.University;
import com.lms_app.lms_backend.repository.UniversityRepository;
import com.lms_app.lms_backend.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UniversityServiceImpl implements UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    @Override
    public List<UniversityDTO> getAllUniversities() {
        return universityRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UniversityDTO getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
        return convertToDTO(university);
    }

    @Override
    public UniversityDTO createUniversity(UniversityDTO universityDTO) {
        University university = convertToEntity(universityDTO);
        University savedUniversity = universityRepository.save(university);
        return convertToDTO(savedUniversity);
    }

    @Override
    public UniversityDTO updateUniversity(Long id, UniversityDTO universityDTO) {
        University existingUniversity = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));

        existingUniversity.setUniName(universityDTO.getUniName());
        existingUniversity.setEstYear(universityDTO.getEstYear());
        existingUniversity.setAddress(universityDTO.getAddress());
        existingUniversity.setStatus(University.Status.valueOf(universityDTO.getStatus()));
        existingUniversity.setAdminName(universityDTO.getAdminName());
        existingUniversity.setStudents(universityDTO.getStudents());
        existingUniversity.setCourses(universityDTO.getCourses());

        University updatedUniversity = universityRepository.save(existingUniversity);
        return convertToDTO(updatedUniversity);
    }

    @Override
    public void deleteUniversity(Long id) {
        if (!universityRepository.existsById(id)) {
            throw new RuntimeException("University not found with id: " + id);
        }
        universityRepository.deleteById(id);
    }

    private UniversityDTO convertToDTO(University university) {
        return new UniversityDTO(
                university.getId(),
                university.getUniName(),
                university.getEstYear(),
                university.getAddress(),
                university.getStatus().toString(),
                university.getAdminName(),
                university.getStudents(),
                university.getCourses()
        );
    }

    private University convertToEntity(UniversityDTO universityDTO) {
        University university = new University();
        university.setUniName(universityDTO.getUniName());
        university.setEstYear(universityDTO.getEstYear());
        university.setAddress(universityDTO.getAddress());
        university.setStatus(University.Status.valueOf(universityDTO.getStatus()));
        university.setAdminName(universityDTO.getAdminName());
        university.setStudents(universityDTO.getStudents());
        university.setCourses(universityDTO.getCourses());
        return university;
    }
}