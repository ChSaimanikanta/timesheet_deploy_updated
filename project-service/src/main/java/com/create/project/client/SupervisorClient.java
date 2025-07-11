package com.create.project.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.create.project.entity.Supervisor;

@FeignClient(name = "supervisor-service")
public interface SupervisorClient {
	 
	 @PostMapping("/api/supervisors") 
	    Supervisor createSupervisor(@RequestBody Supervisor supervisor);
	 
	 
	 @GetMapping("/api/supervisors/{supervisorId}")
	    Supervisor getSupervisorById(@PathVariable("supervisorId") String supervisorId);

}
