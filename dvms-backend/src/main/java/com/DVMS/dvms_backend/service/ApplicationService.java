package com.DVMS.dvms_backend.service;


import com.DVMS.dvms_backend.entity.Application;
import com.DVMS.dvms_backend.entity.Scheme;
import com.DVMS.dvms_backend.repository.ApplicationRepository;
import com.DVMS.dvms_backend.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final SchemeRepository schemeRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              SchemeRepository schemeRepository) {
        this.applicationRepository = applicationRepository;
        this.schemeRepository = schemeRepository;
    }

    public Application applyForScheme(String email, Long schemeId) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        Application application = new Application();
        application.setUserEmail(email);
        application.setScheme(scheme);
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public List<Application> getUserApplications(String email) {
        return applicationRepository.findByUserEmail(email);
    }
}
