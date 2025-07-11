package com.create.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.create.project.entity.ArchiveProject;

public interface ArchiveProjectRepository extends JpaRepository<ArchiveProject, String> {
    // Additional query methods (if needed)
}
