package com.create.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.create.project.entity.EmployeeResponse;
import com.create.project.entity.Project;
import com.create.project.entity.ProjectResponse;
import com.create.project.entity.SupervisorResponse;
import com.create.project.service.ProjectService;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;
    
    
    
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody Project project) {
        ProjectResponse response = projectService.createProject(project);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable String projectId) {
        try {
            ProjectResponse response = projectService.getProjectById(projectId);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unexpected error: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> responses = projectService.getAllProjects();
        return ResponseEntity.ok(responses);
    }



    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable String projectId, @RequestBody Project updatedProject) {
        ProjectResponse response = projectService.updateProject(projectId, updatedProject);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
    

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable String employeeId) {
        EmployeeResponse response = projectService.getEmployeeById(employeeId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/supervisors/{supervisorId}")
    public ResponseEntity<SupervisorResponse> getSupervisorById(@PathVariable String supervisorId) {
        SupervisorResponse response = projectService.getSupervisorById(supervisorId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/projects/supervisor-for-employee")
    public ResponseEntity<Boolean> isSupervisorForEmployee(@RequestParam("supervisorId") String supervisorId, @RequestParam("empId") String empId) {
        boolean isSupervisor = projectService.isSupervisorForEmployee(supervisorId, empId);
        return ResponseEntity.ok(isSupervisor);
    }
    
    // For getting the supervisors of the project
    
    @GetMapping("/{projectId}/supervisors")
    public ResponseEntity<List<String>> getSupervisorsForProject(@PathVariable String projectId) {
        List<String> supervisors = projectService.getSupervisorsForProject(projectId);
        return ResponseEntity.ok(supervisors);
    }
    
    
    
//    FOr getting the project id using employee id
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByEmployeeId(@PathVariable String employeeId) {
        List<ProjectResponse> projectResponses = projectService.getProjectsByEmployeeId(employeeId);
        return ResponseEntity.ok(projectResponses);
    }
    
    
    
//    For getting supervisor id using project id and emplooyee id
    
    
    @GetMapping("/{projectId}/supervisors/{employeeId}")
    public ResponseEntity<List<String>> getSupervisorsByProjectAndEmployee(@PathVariable String projectId, @PathVariable String employeeId) {
        List<String> supervisorIds = projectService.findSupervisorsByProjectAndEmployee(projectId, employeeId);
        return ResponseEntity.ok(supervisorIds);
    }
    
    
    
 // Endpoint to get projects by supervisorId
    @GetMapping("/supervisor/{supervisorId}")
    public ResponseEntity<List<Project>> getProjectsBySupervisorId(@PathVariable String supervisorId) {
        List<Project> projects = projectService.getProjectsBySupervisorId(supervisorId);
        if (projects.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(projects);
    }

//  get the list of supervisors associated with a given employee ID
    
    
 @GetMapping("/supervisors/by-employee/{employeeId}")
 public ResponseEntity<List<SupervisorResponse>> getSupervisorsByEmployeeId(@PathVariable String employeeId) {
     try {
         List<SupervisorResponse> supervisors = projectService.getSupervisorsByEmployeeId(employeeId);
         return ResponseEntity.ok(supervisors);
     } catch (RuntimeException e) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
     }
 }
 
 
}
