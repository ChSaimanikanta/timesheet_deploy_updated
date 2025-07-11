package com.timesheet.admin.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {

	private String projectId;
    private String projectTitle;
    private String projectDescription;
    private List<EmployeeResponse> employeeTeamMembers;
    private List<SupervisorResponse> supervisorTeamMembers;
	
	
}
