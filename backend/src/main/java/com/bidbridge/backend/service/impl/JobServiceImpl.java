package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.JobDTO;
import com.bidbridge.backend.entity.Job;
import com.bidbridge.backend.mapper.JobMapper;
import com.bidbridge.backend.repository.JobRepository;
import com.bidbridge.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository, JobMapper jobMapper) {
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
    }

    @Override
    public JobDTO findById(UUID id) {
        return jobRepository.findById(id)
                .map(jobMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    @Override
    public List<JobDTO> findAll() {
        return jobMapper.toDTOList(jobRepository.findAll());
    }

    @Override
    public JobDTO create(JobDTO dto) {
        Job job = jobMapper.toEntity(dto);
        Job savedJob = jobRepository.save(job);
        return jobMapper.toDTO(savedJob);
    }

    @Override
    public JobDTO update(JobDTO dto) {
        if (dto.getId() == null) {
            throw new RuntimeException("Job ID cannot be null for update operation");
        }
        
        Job existingJob = jobRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + dto.getId()));
        
        Job job = jobMapper.toEntity(dto);
        Job updatedJob = jobRepository.save(job);
        return jobMapper.toDTO(updatedJob);
    }

    @Override
    public void delete(UUID id) {
        jobRepository.deleteById(id);
    }

    @Override
    public List<JobDTO> findByOwnerCompanyId(UUID companyId) {
        return jobMapper.toDTOList(jobRepository.findByOwnerCompanyId(companyId));
    }

    @Override
    public List<JobDTO> findByTitleContaining(String keyword) {
        return jobMapper.toDTOList(jobRepository.findByTitleContaining(keyword));
    }
} 