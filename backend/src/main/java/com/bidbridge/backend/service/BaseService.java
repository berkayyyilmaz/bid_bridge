package com.bidbridge.backend.service;

import java.util.List;
import java.util.UUID;

public interface BaseService<T, ID> {
    T findById(ID id);
    List<T> findAll();
    T create(T dto);
    T update(T dto);
    void delete(ID id);
} 