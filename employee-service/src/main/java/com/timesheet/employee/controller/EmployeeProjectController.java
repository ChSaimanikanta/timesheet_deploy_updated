package com.timesheet.employee.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.timesheet.employee.entity.Employee;
import com.timesheet.employee.service.EmployeeProjectService;

import jakarta.validation.Valid;


@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/employee")
public class EmployeeProjectController {

    @Autowired
    private EmployeeProjectService employeeService;

    @PostMapping("/saveemployee")
    public ResponseEntity<Employee> createEmployee(
            @Valid @RequestBody Employee employee, 
            @RequestParam String adminId) {
        Employee createdEmployee = employeeService.createEmployee(employee, adminId);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED); // 201 Created for successful creation
    }

    @GetMapping("/getemployees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return new ResponseEntity<>(employees, HttpStatus.OK); // 200 OK for retrieving all employees
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String employeeId) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        return new ResponseEntity<>(employee, HttpStatus.OK); // 200 OK for retrieving by ID
    }

    @GetMapping("/by-fname/{firstName}")
    public ResponseEntity<List<Employee>> getUsersByFname(@PathVariable("firstName") String firstName) {
        List<Employee> employees = employeeService.findByFirstName(firstName);
        if (employees.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found if no employees are found
        }
        return new ResponseEntity<>(employees, HttpStatus.OK); // 200 OK if employees are found
    }

    @GetMapping("/validate")
    public ResponseEntity<Employee> validateEmployeeCredentials(
            @RequestParam String emailId,
            @RequestParam String password) {
        Employee employee = employeeService.validateEmployeeCredentials(emailId, password);
        if (employee != null) {
            return new ResponseEntity<>(employee, HttpStatus.OK); // 200 OK for valid credentials
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // 401 Unauthorized for invalid credentials
        }
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable String employeeId,
            @RequestParam String adminId,
            @Valid @RequestBody Employee updatedEmployeeRequest) {
        try {
            Employee updatedEmployee = employeeService.updateEmployeeId(
                    employeeId,
                    updatedEmployeeRequest.getEmployeeId(),
                    updatedEmployeeRequest,
                    adminId
            );
            return ResponseEntity.ok(updatedEmployee);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unexpected error occurred"));
        }
    }




    @DeleteMapping("/{employeeId}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable String employeeId,
            @RequestParam String adminId) {
        employeeService.deleteEmployee(employeeId, adminId);
        return new ResponseEntity<>("Employee deleted successfully.", HttpStatus.OK); // 200 OK for deletion
    }

    @DeleteMapping("/emp/{employeeId}")
    public ResponseEntity<String> deleteEmployeeProj(@PathVariable String employeeId) {
        employeeService.deleteEmployeeProj(employeeId);
        return new ResponseEntity<>("Employee project deleted successfully.", HttpStatus.OK); // 200 OK for deletion
    }

    @PostMapping(path = "/import-excel")
    public void importExcelToDatabase(
        @RequestPart(required = true) MultipartFile files) {
    	employeeService.importExcelToDatabase(files);

    }
	
}
