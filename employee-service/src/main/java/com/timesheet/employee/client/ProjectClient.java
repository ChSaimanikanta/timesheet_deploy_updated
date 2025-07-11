package com.timesheet.employee.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "admin-service")
public interface ProjectClient {
	
	  @GetMapping("/api/admin/projects/{id}")
	    Project getProjectById(@PathVariable("id") String projectId);
	  
//	  @GetMapping("/api/admin/projects/{projectId}")
//	    ProjectResponse getProjectById(@PathVariable("projectId") String projectId);

}

