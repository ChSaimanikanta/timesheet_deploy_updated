package com.timesheet.supervisor.entity;


import java.util.List;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
