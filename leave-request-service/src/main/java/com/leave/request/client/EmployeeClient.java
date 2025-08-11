package com.leave.request.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.leave.request.entity.Employee;


@FeignClient(name = "employee-service")
public interface EmployeeClient {

    @GetMapping("/api/employee/{employeeId}")
    Employee getEmployeeById(@PathVariable("employeeId") String employeeId);
}
