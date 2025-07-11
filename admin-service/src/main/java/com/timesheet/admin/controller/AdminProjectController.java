package com.timesheet.admin.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.admin.entity.EmployeeResponse;
import com.timesheet.admin.entity.Project;
import com.timesheet.admin.entity.ProjectResponse;
import com.timesheet.admin.entity.SupervisorResponse;
import com.timesheet.admin.service.AdminProjectService;




//--------------  ADMIN PROJECT CREATION --------------------------------


@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin")
public class AdminProjectController {

	
	@Autowired
    private AdminProjectService adminService;

	@PostMapping("/projects")
    public ProjectResponse createProject(
        @RequestBody Project project,
        @RequestParam("adminId") String adminId) {
        return adminService.createProjectWithAdminCheck(project, adminId);
    }
    
    @GetMapping("/projects/{projectId}")
    public ProjectResponse getProjectById(@PathVariable String projectId) {
        return adminService.getProjectById(projectId);
    }

    @PutMapping("/projects/{projectId}")
    public ProjectResponse updateProject(
        @PathVariable String projectId, 
        @RequestBody Project updatedProject,
        @RequestParam("adminId") String adminId
    ) {
        // Validate and update the project
        return adminService.updateProject(projectId, updatedProject, adminId);
    }
    
    @DeleteMapping("/projects/{projectId}")
    public void deleteProject(@PathVariable String projectId, @RequestParam String adminId) {
        adminService.deleteProject(projectId, adminId);
    }

    @GetMapping("/projects")
    public List<ProjectResponse> getAllProjects() {
        return adminService.getAllProjects();
    }

    @GetMapping("projects/employees")
    public List<EmployeeResponse> getAllEmployees() {
        return adminService.getAllEmployees();
    }

    @GetMapping("projects/supervisors")
    public List<SupervisorResponse> getAllSupervisors() {
        return adminService.getAllSupervisors();
    }
    
    
    @GetMapping("projects/employees/{employeeId}")
    public EmployeeResponse getEmployeeById(@PathVariable String employeeId) {
        return adminService.getEmployeeById(employeeId);
    }
    
    @GetMapping("projects/supervisors/{supervisorId}")
    public SupervisorResponse getSupervisorById(@PathVariable String supervisorId) {
        return adminService.getSupervisorById(supervisorId);
    }
	
	
}
