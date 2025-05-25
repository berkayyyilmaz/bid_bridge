package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.ProfileDTO;
import com.bidbridge.backend.entity.Profile;
import com.bidbridge.backend.mapper.ProfileMapper;
import com.bidbridge.backend.repository.ProfileRepository;
import com.bidbridge.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    @Autowired
    public ProfileServiceImpl(ProfileRepository profileRepository, ProfileMapper profileMapper) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    @Override
    public ProfileDTO findById(UUID id) {
        return profileRepository.findById(id)
                .map(profileMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + id));
    }

    @Override
    public List<ProfileDTO> findAll() {
        return profileMapper.toDTOList(profileRepository.findAll());
    }

    @Override
    public ProfileDTO create(ProfileDTO dto) {
        if (dto.getId() == null) {
            throw new RuntimeException("Profile ID cannot be null. It must match the Supabase auth profile ID.");
        }
        
        if (profileRepository.existsById(dto.getId())) {
            throw new RuntimeException("Profile already exists with id: " + dto.getId());
        }
        
        Profile profile = profileMapper.toEntity(dto);
        Profile savedProfile = profileRepository.save(profile);
        return profileMapper.toDTO(savedProfile);
    }

    @Override
    public ProfileDTO update(ProfileDTO dto) {
        if (dto.getId() == null) {
            throw new RuntimeException("Profile ID cannot be null for update operation");
        }
        
        Profile existingProfile = profileRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + dto.getId()));
        
        Profile profile = profileMapper.toEntity(dto);
        Profile updatedProfile = profileRepository.save(profile);
        return profileMapper.toDTO(updatedProfile);
    }

    @Override
    public void delete(UUID id) {
        profileRepository.deleteById(id);
    }

    @Override
    public List<ProfileDTO> findByCompanyId(UUID companyId) {
        return profileMapper.toDTOList(profileRepository.findByCompanyId(companyId));
    }

    @Override
    public List<ProfileDTO> findByRole(String role) {
        return profileMapper.toDTOList(profileRepository.findByRole(role));
    }
} 