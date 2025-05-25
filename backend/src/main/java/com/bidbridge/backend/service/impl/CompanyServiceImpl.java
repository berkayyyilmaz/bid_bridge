package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.CompanyDTO;
import com.bidbridge.backend.entity.Company;
import com.bidbridge.backend.entity.Profile;
import com.bidbridge.backend.mapper.CompanyMapper;
import com.bidbridge.backend.repository.CompanyRepository;
import com.bidbridge.backend.repository.ProfileRepository;
import com.bidbridge.backend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final ProfileRepository profileRepository;

    @Autowired
    public CompanyServiceImpl(CompanyRepository companyRepository, CompanyMapper companyMapper, ProfileRepository profileRepository) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
        this.profileRepository = profileRepository;
    }

    @Override
    public CompanyDTO findById(UUID id) {
        return companyRepository.findById(id)
                .map(companyMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    @Override
    public List<CompanyDTO> findAll() {
        return companyMapper.toDTOList(companyRepository.findAll());
    }

    @Override
    public CompanyDTO create(CompanyDTO dto) {
        Company company = companyMapper.toEntity(dto);
        Company savedCompany = companyRepository.save(company);
        return companyMapper.toDTO(savedCompany);
    }

    @Override
    public CompanyDTO update(CompanyDTO dto) {
        if (dto.getId() == null) {
            throw new RuntimeException("Company ID cannot be null for update operation");
        }
        
        Company existingCompany = companyRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + dto.getId()));
        
        Company company = companyMapper.toEntity(dto);
        Company updatedCompany = companyRepository.save(company);
        return companyMapper.toDTO(updatedCompany);
    }

    @Override
    public void delete(UUID id) {
        companyRepository.deleteById(id);
    }

    @Override
    public CompanyDTO findByName(String name) {
        Company company = companyRepository.findByName(name);
        return company != null ? companyMapper.toDTO(company) : null;
    }

    @Override
    public CompanyDTO findByProfileId(UUID profileId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Profile not found with id: " + profileId));
        
        if (profile.getCompany() == null) {
            throw new RuntimeException("Profile doesn't have a company");
        }
        
        return companyMapper.toDTO(profile.getCompany());
    }
} 