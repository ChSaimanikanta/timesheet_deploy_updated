package com.leave.request.entity;

import java.util.List;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {

	@Column(updatable = false, nullable = false)
	private String projectId;
    private String projectTitle;
    private String projectDescription;
    private List<EmployeeResponse> employeeTeamMembers;
    private List<SupervisorResponse> supervisorTeamMembers;
	
	
}
