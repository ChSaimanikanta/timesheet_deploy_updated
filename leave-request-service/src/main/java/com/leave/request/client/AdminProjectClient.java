package com.leave.request.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.leave.request.entity.EmployeeResponse;
import com.leave.request.entity.SupervisorResponse;



@FeignClient(name = "admin-service")
public interface AdminProjectClient {

	@GetMapping("/api/admin/projects/employees/{employeeId}")
	EmployeeResponse getEmployeeById(@PathVariable String employeeId);
	
	@GetMapping("/api/admin/projects/supervisors/{supervisorId}")
    SupervisorResponse getSupervisorById(@PathVariable String supervisorId);
	
	
	@GetMapping("/api/admin/projects/supervisors")
	List<SupervisorResponse> getAllSupervisors();
	
}


