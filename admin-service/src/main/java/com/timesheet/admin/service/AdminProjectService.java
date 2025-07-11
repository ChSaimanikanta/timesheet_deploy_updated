package com.timesheet.admin.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.timesheet.admin.client.EmployeeServiceClient;
import com.timesheet.admin.client.ProjectClient;
import com.timesheet.admin.client.SuperAdminServiceClient;
import com.timesheet.admin.client.SupervisorClient;
import com.timesheet.admin.entity.AdminEntity;
import com.timesheet.admin.entity.EmployeeResponse;
import com.timesheet.admin.entity.Project;
import com.timesheet.admin.entity.ProjectResponse;
import com.timesheet.admin.entity.SupervisorResponse;
import com.timesheet.admin.exceptions.AdminNotFoundException;
import com.timesheet.admin.exceptions.EmployeeNotFoundException;
import com.timesheet.admin.exceptions.InvalidRequestException;
import com.timesheet.admin.exceptions.ProjectNotFoundException;
import com.timesheet.admin.exceptions.ResourceNotFoundException;
import com.timesheet.admin.repo.ProjectRepository;

import feign.FeignException;

@Service
public class AdminProjectService {

	@Autowired
	private  ProjectRepository projectRepository;
	 @Autowired
	    private EmployeeServiceClient employeeClient;

	    @Autowired
	    private SupervisorClient supervisorClient;

	    @Autowired
	    private ProjectClient projectClient;

	    @Autowired
	    private  SuperAdminServiceClient superAdminServiceClient;
	    
	    public ProjectResponse createProjectWithAdminCheck(Project project, String adminId) {
	        Set<String> uniqueErrors = new LinkedHashSet<>();

	        // Check if the admin has permission to create projects
	        try {
	            if (!hasPermission(adminId, "CREATE_PROJECT")) {
	                uniqueErrors.add("Admin with ID: " + adminId + " does not have permission.");
	            }
	        } catch (AdminNotFoundException e) {
	            uniqueErrors.add("Admin not found with ID: " + adminId);
	        } catch (Exception e) {
	            uniqueErrors.add("An unexpected error occurred while checking admin permissions: " + e.getMessage());
	        }

	        // Validate employee IDs
	        for (String empId : project.getEmployeeTeamMembers()) {
	            try {
	                validateEmployeeId(empId);
	            } catch (EmployeeNotFoundException e) {
	                uniqueErrors.add("Employee not found with ID: " + empId);
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, empId, "Employee"));
	            }
	        }

	        // Validate supervisor IDs
	        for (String supId : project.getSupervisorTeamMembers()) {
	            try {
	                validateSupervisorId(supId);
	            } catch (EmployeeNotFoundException e) {
	                uniqueErrors.add("Employee not found for supervisor ID: " + supId);
	            } catch (ProjectNotFoundException e) {
	                uniqueErrors.add("Supervisor not found with ID: " + supId);
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, supId, "Supervisor"));
	            }
	        }

	        // Attempt to create the project and capture any propagated errors
	        if (uniqueErrors.isEmpty()) {
	            try {
	                return projectClient.createProject(project);
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, "", "Unexpected"));
	            } catch (ResponseStatusException e) {
	                uniqueErrors.add(e.getReason());
	            } catch (Exception e) {
	                uniqueErrors.add("An unexpected error occurred while creating the project: " + e.getMessage());
	            }
	        }

	        if (!uniqueErrors.isEmpty()) {
	            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
	        }

	        return null;
	    }
	    
	    public ProjectResponse getProjectById(String projectId) {
	        Set<String> uniqueErrors = new LinkedHashSet<>();

	        // Attempt to get the project and capture any propagated errors
	        try {
	            return projectClient.getProjectById(projectId);
	        } catch (ResponseStatusException e) {
	            uniqueErrors.add(e.getReason());
	        } catch (FeignException e) {
	            uniqueErrors.add(extractRelevantErrorMessage(e, projectId, "Project"));
	        } catch (Exception e) {
	            uniqueErrors.add("An unexpected error occurred while fetching the project: " + e.getMessage());
	        }

	        if (!uniqueErrors.isEmpty()) {
	            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.join(" and ", uniqueErrors));
	        }

	        return null;
	    }

	    public ProjectResponse updateProject(String projectId, Project updatedProject, String adminId) {
	        Set<String> uniqueErrors = new LinkedHashSet<>();

	        // Validate if the project exists
	        try {
	            ProjectResponse existingProject = projectClient.getProjectById(projectId);
	        } catch (FeignException e) {
	            uniqueErrors.add("Project not found with ID: " + projectId);
	        }

	        // Check if the admin has permission to edit projects
	        try {
	            if (!hasPermission(adminId, "EDIT_PROJECT")) {
	                uniqueErrors.add("Admin with ID: " + adminId + " does not have permission.");
	            }
	        } catch (AdminNotFoundException e) {
	            uniqueErrors.add("Admin not found with ID: " + adminId);
	        } catch (FeignException e) {
	            uniqueErrors.add(extractRelevantErrorMessage(e, adminId, "Admin"));
	        }

	        // Validate employee IDs
	        for (String empId : updatedProject.getEmployeeTeamMembers()) {
	            try {
	                validateEmployeeId(empId);
	            } catch (EmployeeNotFoundException e) {
	                uniqueErrors.add("Employee not found with ID: " + empId);
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, empId, "Employee"));
	            }
	        }

	        // Validate supervisor IDs
	        for (String supId : updatedProject.getSupervisorTeamMembers()) {
	            try {
	                validateSupervisorId(supId);
	            } catch (EmployeeNotFoundException e) {
	                uniqueErrors.add("Employee not found for supervisor ID: " + supId);
	            } catch (ProjectNotFoundException e) {
	                uniqueErrors.add("Supervisor not found with ID: " + supId);
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, supId, "Supervisor"));
	            }
	        }

	        // Attempt to update the project and capture any propagated errors
	        if (uniqueErrors.isEmpty()) {
	            try {
	                ProjectResponse projectResponse = projectClient.updateProject(projectId, updatedProject);
	                return projectResponse;
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, projectId, "Project"));
	            } catch (ResponseStatusException e) {
	                uniqueErrors.add("Project not found with ID: " + projectId);
	            } catch (Exception e) {
	                uniqueErrors.add("An unexpected error occurred while updating the project: " + e.getMessage());
	            }
	        }

	        if (!uniqueErrors.isEmpty()) {
	            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
	        }

	        return null;
	    }

	    public void deleteProject(String projectId, String adminId) {
	        Set<String> uniqueErrors = new LinkedHashSet<>();

	        // Validate if the project exists
	        try {
	            ProjectResponse existingProject = projectClient.getProjectById(projectId);
	        } catch (FeignException e) {
	            uniqueErrors.add("Project not found with ID: " + projectId);
	        }

	        // Check if the admin has permission to delete projects
	        try {
	            if (!hasPermission(adminId, "DELETE_PROJECT")) {
	                uniqueErrors.add("Admin with ID: " + adminId + " does not have permission.");
	            }
	        } catch (AdminNotFoundException e) {
	            uniqueErrors.add("Admin not found with ID: " + adminId);
	        } catch (FeignException e) {
	            uniqueErrors.add(extractRelevantErrorMessage(e, adminId, "Admin"));
	        }

	        // Attempt to delete the project and capture any propagated errors
	        if (uniqueErrors.isEmpty()) {
	            try {
	                projectClient.deleteProject(projectId);
	            } catch (ResponseStatusException e) {
	                uniqueErrors.add("Project not found with ID: " + projectId);
	            } catch (FeignException e) {
	                uniqueErrors.add(extractRelevantErrorMessage(e, projectId, "Project"));
	            }
	        }

	        if (!uniqueErrors.isEmpty()) {
	            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
	        }
	    }
	    
	    public List<ProjectResponse> getAllProjects() {
	        return projectClient.getAllProjects();
	    }

	    public List<EmployeeResponse> getAllEmployees() {
	        List<EmployeeResponse> employees = employeeClient.getAllEmployees();
	        return employees.stream().map(this::populateEmployeeDetails).collect(Collectors.toList());
	    }

	    private EmployeeResponse populateEmployeeDetails(EmployeeResponse employee) {
	        // Fetch projects involving the employee
	        List<ProjectResponse> projects = projectClient.getAllProjects();
	        List<String> projectIds = projects.stream()
	                .filter(project -> project.getEmployeeTeamMembers().stream()
	                        .anyMatch(member -> member.getEmployeeId().equals(employee.getEmployeeId())))
	                .map(ProjectResponse::getProjectId)
	                .collect(Collectors.toList());
	        employee.setProjects(projectIds);

	        // Fetch supervisors for the employee
	        List<String> supervisorIds = projects.stream()
	                .filter(project -> project.getEmployeeTeamMembers().stream()
	                        .anyMatch(member -> member.getEmployeeId().equals(employee.getEmployeeId())))
	                .flatMap(project -> project.getSupervisorTeamMembers().stream()
	                        .map(SupervisorResponse::getSupervisorId))
	                .distinct()
	                .collect(Collectors.toList());
	        employee.setSupervisors(supervisorIds);

	        return employee;
	    }



	    public List<SupervisorResponse> getAllSupervisors() {
	        List<SupervisorResponse> supervisors = supervisorClient.getAllSupervisors();
	        return supervisors.stream().map(this::populateSupervisorDetails).collect(Collectors.toList());
	    }

	    private SupervisorResponse populateSupervisorDetails(SupervisorResponse supervisor) {
	        List<ProjectResponse> projects = projectClient.getAllProjects();
	        List<String> projectIds = projects.stream()
	                .filter(project -> project.getSupervisorTeamMembers().stream()
	                        .anyMatch(member -> member.getSupervisorId().equals(supervisor.getSupervisorId())))
	                .map(ProjectResponse::getProjectId)
	                .collect(Collectors.toList());
	        supervisor.setProjects(projectIds);

	        return supervisor;
	    }
	    
	    
	    
	    
	    public EmployeeResponse getEmployeeById(String employeeId) {
	        EmployeeResponse employee = employeeClient.getEmployeeById(employeeId);
	        return populateEmployeeDetails(employee);
	    }
	    
	    
	    public SupervisorResponse getSupervisorById(String supervisorId) {
	        SupervisorResponse supervisor = supervisorClient.getSupervisorById(supervisorId);
	        return populateSupervisorDetails(supervisor);
	    }
	    
	    private boolean hasPermission(String adminId, String action) {
	        try {
	            AdminEntity admin = superAdminServiceClient.getPermissions(adminId);
	            switch (action) {
	                case "CREATE_PROJECT":
	                    return admin.isCanCreateProject();
	                case "EDIT_PROJECT":
	                    return admin.isCanEditProject();
	                case "DELETE_PROJECT":
	                    return admin.isCanDeleteProject();
	                default:
	                    throw new IllegalArgumentException("Unknown action: " + action);
	            }
	        } catch (FeignException e) {
	            throw new AdminNotFoundException("Admin not found with ID: " + adminId);
	        }
	    }

	    private void validateEmployeeId(String empId) {
	        if (employeeClient.getEmployeeById(empId) == null) {
	            throw new EmployeeNotFoundException("Employee not found with ID: " + empId);
	        }
	    }

	    public void validateSupervisorId(String supId) {
	        try {
	            employeeClient.getEmployeeById(supId);
	            // it's an employee, valid for conversion—don't treat as invalid
	        } catch (FeignException.NotFound notEmp) {
	            // Try supervisor next
	            try {
	                supervisorClient.getSupervisorById(supId);
	            } catch (FeignException.NotFound notSup) {
	                throw new ProjectNotFoundException("Supervisor not found with ID: " + supId);
	            }
	        }
	    }

	    private String extractRelevantErrorMessage(FeignException e, String id, String entityType) {
	        try {
	            String message = e.contentUTF8();
	            
	            if (message.contains("Supervisor not found with ID")) {
	                return message;
	            } else if (message.contains("Employee not found with ID")) {
	                return message;
	            } else if (message.contains("Admin not found with ID")) {
	                return message;
	            } else if (message.contains("Project title already exists")) {
	                return message;
	            } else if (message.contains("Project not found with ID")) {
	                return message;
	            } else {
	                return message.isBlank()
	                    ? "Unexpected error for " + entityType + " with ID: " + id
	                    : message;
	            }
	        } catch (Exception ex) {
	            return "Unexpected error: " + ex.getMessage();
	        }
	    }

}
