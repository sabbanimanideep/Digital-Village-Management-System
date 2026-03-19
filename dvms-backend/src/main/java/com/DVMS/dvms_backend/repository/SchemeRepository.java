package com.DVMS.dvms_backend.repository;



import com.DVMS.dvms_backend.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
}
