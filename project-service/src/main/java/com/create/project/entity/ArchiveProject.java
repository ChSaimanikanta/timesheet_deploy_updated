package com.create.project.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "archive_project")
public class ArchiveProject {

	@Id
    @Column(updatable = false, nullable = false)
    private String projectId;
    private String projectTitle;
    private String projectDescription;

    @ElementCollection
//    @CollectionTable(name = "project_employee_team_members", joinColumns = @JoinColumn(name = "project_project_id"))
//    @Column(name = "employee_team_members")
    private List<String> employeeTeamMembers = new ArrayList<>();

    @ElementCollection
//    @CollectionTable(name = "project_supervisor_team_members", joinColumns = @JoinColumn(name = "project_project_id"))
//    @Column(name = "supervisor_team_members")
    private List<String> supervisorTeamMembers = new ArrayList<>();

}
