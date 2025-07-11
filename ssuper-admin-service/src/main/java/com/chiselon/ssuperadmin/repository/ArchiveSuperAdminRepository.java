package com.chiselon.ssuperadmin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.chiselon.ssuperadmin.model.ArchiveSuperAdmin;

public interface ArchiveSuperAdminRepository extends JpaRepository<ArchiveSuperAdmin, String> {
    // Additional query methods (if needed) can be defined here
}
