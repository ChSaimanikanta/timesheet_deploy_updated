package com.timesheet.admin.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timesheet.admin.entity.Project;



@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

}
