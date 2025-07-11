package com.create.project.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.create.project.entity.Employee;

@FeignClient(name = "employee-service")
public interface EmployeeClient {
	
	 @GetMapping("/api/employee/{employeeId}")
	    Employee getEmployeeById(@PathVariable("employeeId") String employeeId);
	 
	
	
	    @PutMapping("/api/employee/{employeeId}")
	    void updateEmployee(@PathVariable("employeeId") String employeeId, @RequestBody Employee employee);

	    @DeleteMapping("/api/employee/{employeeId}")
	    void deleteEmployee(@PathVariable("employeeId") String employeeId);
	    
	    
	    @DeleteMapping("/api/employee/emp/{employeeId}")
	    void deleteEmployeeProj(@PathVariable("employeeId") String employeeId);
}
