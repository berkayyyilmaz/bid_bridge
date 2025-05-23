package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.QuoteDTO;
import com.bidbridge.backend.entity.Quote;
import com.bidbridge.backend.mapper.QuoteMapper;
import com.bidbridge.backend.repository.QuoteRepository;
import com.bidbridge.backend.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteMapper quoteMapper;

    @Autowired
    public QuoteServiceImpl(QuoteRepository quoteRepository, QuoteMapper quoteMapper) {
        this.quoteRepository = quoteRepository;
        this.quoteMapper = quoteMapper;
    }

    @Override
    public QuoteDTO findById(UUID id) {
        return quoteRepository.findById(id)
                .map(quoteMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
    }

    @Override
    public List<QuoteDTO> findAll() {
        return quoteMapper.toDTOList(quoteRepository.findAll());
    }

    @Override
    public QuoteDTO create(QuoteDTO dto) {
        Quote quote = quoteMapper.toEntity(dto);
        Quote savedQuote = quoteRepository.save(quote);
        return quoteMapper.toDTO(savedQuote);
    }

    @Override
    public QuoteDTO update(QuoteDTO dto) {
        if (dto.getId() == null) {
            throw new RuntimeException("Quote ID cannot be null for update operation");
        }
        
        Quote existingQuote = quoteRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + dto.getId()));
        
        Quote quote = quoteMapper.toEntity(dto);
        Quote updatedQuote = quoteRepository.save(quote);
        return quoteMapper.toDTO(updatedQuote);
    }

    @Override
    public void delete(UUID id) {
        quoteRepository.deleteById(id);
    }

    @Override
    public List<QuoteDTO> findByJobId(UUID jobId) {
        return quoteMapper.toDTOList(quoteRepository.findByJobId(jobId));
    }

    @Override
    public List<QuoteDTO> findByOfferingCompanyId(UUID companyId) {
        return quoteMapper.toDTOList(quoteRepository.findByOfferingCompanyId(companyId));
    }

    @Override
    public List<QuoteDTO> findByJobIdAndStatus(UUID jobId, String status) {
        return quoteMapper.toDTOList(quoteRepository.findByJobIdAndStatus(jobId, status));
    }

    @Override
    public QuoteDTO updateStatus(UUID id, String status) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + id));
        
        quote.setStatus(status);
        Quote updatedQuote = quoteRepository.save(quote);
        return quoteMapper.toDTO(updatedQuote);
    }
} 