package com.timesheetcreation.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.timesheetcreation.entity.Project;

@FeignClient(name = "project-service")
public interface ProjectClient {
	
	
	 @GetMapping("/api/projects/{projectId}/supervisors/{employeeId}")
	    List<String> getSupervisorsByProjectAndEmployee(
	            @PathVariable("projectId") String projectId,
	            @PathVariable("employeeId") String employeeId);
	
	 
	 @GetMapping("/api/projects/supervisor/{supervisorId}")
	    List<Project> getProjectsBySupervisorId(@PathVariable("supervisorId") String supervisorId);
	 

}
