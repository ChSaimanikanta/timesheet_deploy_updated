package com.timesheet.superadmin.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.superadmin.entity.ArchiveAdmin;

public interface ArchiveAdminRepository extends JpaRepository<ArchiveAdmin, String> {
    // Additional query methods (if needed) can be defined here
}
