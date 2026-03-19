package com.DVMS.dvms_backend.controller;



import com.DVMS.dvms_backend.entity.Scheme;
import com.DVMS.dvms_backend.service.SchemeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@CrossOrigin("*")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public List<Scheme> getAllSchemes() {
        return schemeService.getAllSchemes();
    }

    @PostMapping
    public Scheme addScheme(@RequestBody Scheme scheme) {
        return schemeService.addScheme(scheme);
    }
}
