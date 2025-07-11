package com.timesheet.admin.entity;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;

import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Project {
	@Id
    private String projectId;
    private String projectTitle;
    private String projectDescription;

    @ElementCollection
    private List<String> employeeTeamMembers;

    @ElementCollection
    private List<String> supervisorTeamMembers;


}
