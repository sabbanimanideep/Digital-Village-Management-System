package com.DVMS.dvms_backend.service;



import com.DVMS.dvms_backend.entity.Scheme;
import com.DVMS.dvms_backend.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }

    public Scheme addScheme(Scheme scheme) {
        return schemeRepository.save(scheme);
    }
}
