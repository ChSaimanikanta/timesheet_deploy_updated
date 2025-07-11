package com.timesheet.employee.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.employee.entity.ArchiveEmployee;

public interface ArchiveEmployeeRepository extends JpaRepository<ArchiveEmployee, String> {
    // Additional query methods (if needed)
}

