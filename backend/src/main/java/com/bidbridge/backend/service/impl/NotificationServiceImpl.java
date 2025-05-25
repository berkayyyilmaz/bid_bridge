package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.NotificationDTO;
import com.bidbridge.backend.entity.Notification;
import com.bidbridge.backend.mapper.NotificationMapper;
import com.bidbridge.backend.repository.NotificationRepository;
import com.bidbridge.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public NotificationDTO findById(UUID id) {
        return notificationRepository.findById(id)
                .map(notificationMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
    }

    @Override
    public List<NotificationDTO> findAll() {
        return notificationMapper.toDTOList(notificationRepository.findAll());
    }

    @Override
    public NotificationDTO create(NotificationDTO dto) {
        Notification notification = notificationMapper.toEntity(dto);
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(savedNotification);
    }

    @Override
    public NotificationDTO update(NotificationDTO dto) {
        if (dto.getId() == null) {
            throw new RuntimeException("Notification ID cannot be null for update operation");
        }
        
        Notification existingNotification = notificationRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + dto.getId()));
        
        Notification notification = notificationMapper.toEntity(dto);
        Notification updatedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(updatedNotification);
    }

    @Override
    public void delete(UUID id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public List<NotificationDTO> findByProfileId(UUID profileId) {
        return notificationMapper.toDTOList(notificationRepository.findByProfileId(profileId));
    }

    @Override
    public List<NotificationDTO> findByProfileIdAndIsRead(UUID profileId, boolean isRead) {
        return notificationMapper.toDTOList(notificationRepository.findByProfileIdAndIsRead(profileId, isRead));
    }
} 