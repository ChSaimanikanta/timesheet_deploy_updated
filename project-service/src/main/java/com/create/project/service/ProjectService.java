package com.create.project.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.web.server.ResponseStatusException;

import com.create.project.client.EmployeeClient;
import com.create.project.client.SupervisorClient;
import com.create.project.entity.ArchiveProject;
import com.create.project.entity.Employee;
import com.create.project.entity.EmployeeResponse;
import com.create.project.entity.Project;
import com.create.project.entity.ProjectResponse;
import com.create.project.entity.Supervisor;
import com.create.project.entity.SupervisorResponse;
import com.create.project.exceptions.EmployeeNotFoundException;
import com.create.project.exceptions.InvalidRequestException;
import com.create.project.exceptions.ProjectNotFoundException;
import com.create.project.exceptions.ResourceNotFoundException;
import com.create.project.repo.ArchiveProjectRepository;
import com.create.project.repo.ProjectRepository;
import com.create.project.repo.SupervisorRepository;

import feign.FeignException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProjectService {

 private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
	 
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeClient employeeClient;

    @Autowired
    private SupervisorClient supervisorClient;

 
    
    @Autowired
    private SupervisorRepository supervisorRepository;
    
    @Autowired
    private ArchiveProjectRepository archiveProjectRepository;

    @Autowired
    private ModelMapper modelMapper;
    
    public ProjectResponse createProject(Project project) {
        Set<String> uniqueErrors = new LinkedHashSet<>();

        try {
            validateEmployeeIds(project.getEmployeeTeamMembers());
        } catch (EmployeeNotFoundException e) {
            uniqueErrors.add(e.getMessage());
        }

        try {
            validateSupervisorIds(project.getSupervisorTeamMembers());
        } catch (EmployeeNotFoundException | ProjectNotFoundException e) {
            uniqueErrors.add(e.getMessage());
        }

        if (!uniqueErrors.isEmpty()) {
            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
        }

        // Ensure project title is unique
        if (projectRepository.existsByProjectTitle(project.getProjectTitle())) {
            uniqueErrors.add("Project title already exists: " + project.getProjectTitle());
            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
        }

        try {
            // Generate ID if missing
            if (project.getProjectId() == null || project.getProjectId().isEmpty()) {
                project.setProjectId(generateUniqueProjectId());
            }

            String projectId = project.getProjectId();

            if (projectIdExists(projectId)) {
                uniqueErrors.add("Project already exists: " + projectId);
                throw new InvalidRequestException(String.join(" and ", uniqueErrors));
            }

            // 🔄 Remove overlapping supervisor IDs that already exist in employee list
            List<String> filteredSupervisors = project.getSupervisorTeamMembers().stream()
                .filter(supId -> !project.getEmployeeTeamMembers().contains(supId))
                .collect(Collectors.toList());
            project.setSupervisorTeamMembers(filteredSupervisors);

            // Handle members
            List<EmployeeResponse> employeeResponses = handleEmployeeTeamMembers(project);
            List<SupervisorResponse> supervisorResponses = handleSupervisorTeamMembers(project);

            // Update project with resolved supervisor IDs
            project.setSupervisorTeamMembers(
                supervisorResponses.stream()
                    .map(SupervisorResponse::getSupervisorId)
                    .collect(Collectors.toList())
            );

            // Save to repository
            projectRepository.save(project);

            return buildProjectResponse(project, employeeResponses, supervisorResponses);

        } catch (FeignException.NotFound e) {
            uniqueErrors.add("Employee not found with ID: " + extractIdFromException(e));
        } catch (Exception e) {
            uniqueErrors.add("An unexpected error occurred.");
        }

        if (!uniqueErrors.isEmpty()) {
            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
        }

        return null;
    }


    private String generateUniqueProjectId() {
        Optional<Project> latestProject = projectRepository.findTopByOrderByProjectIdDesc();
        int nextId = 1;

        if (latestProject.isPresent()) {
            String currentId = latestProject.get().getProjectId(); // e.g., "PRO012"
            String numeric = currentId.replaceAll("\\D+", "");     // Extract digits
            try {
                nextId = Integer.parseInt(numeric) + 1;
            } catch (NumberFormatException e) {
                throw new IllegalStateException("Invalid project ID format: " + currentId);
            }
        }

        return "PRO" + String.format("%03d", nextId);
    }


    private boolean projectIdExists(String projectId) {
        return projectRepository.findByProjectId(projectId).isPresent();
    }
    
//    private String generateUniqueSupervisorId() {
//        lastSupervisorId++;
//        return "SUP" + String.format("%03d", lastSupervisorId);
//    }

    private List<EmployeeResponse> handleEmployeeTeamMembers(Project project) {
        return project.getEmployeeTeamMembers().stream()
            .map(empId -> {
                try {
                    Employee employee = employeeClient.getEmployeeById(empId);
                    if (employee == null) {
                        throw new EmployeeNotFoundException("Employee not found with ID: " + empId);
                    }

                    EmployeeResponse employeeResponse = modelMapper.map(employee, EmployeeResponse.class);
                    employeeResponse.setProjects(Collections.singletonList(project.getProjectId()));

                    if (employee.getSupervisorId() != null) {
                        Supervisor supervisor = supervisorClient.getSupervisorById(employee.getSupervisorId());
                        if (supervisor != null) {
                            SupervisorResponse supervisorResponse = modelMapper.map(supervisor, SupervisorResponse.class);
                            supervisorResponse.setProjects(Collections.singletonList(project.getProjectId()));
                            employeeResponse.setSupervisor(supervisorResponse);
                        } else {
                            throw new ProjectNotFoundException("Supervisor not found with ID: " + employee.getSupervisorId());
                        }
                    }

                    return employeeResponse;
                } catch (FeignException.NotFound e) {
                    logger.warn("Employee not found with ID: {}", empId, e);
                    return null;
                }
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    private List<SupervisorResponse> handleSupervisorTeamMembers(Project project) {
        List<SupervisorResponse> supervisorResponses = new ArrayList<>();

        for (String supId : project.getSupervisorTeamMembers()) {
            logger.info("Processing supervisorTeamMember ID: {}", supId);

            try {
                // Step 1: Check if supervisor already exists
                Supervisor existingSupervisor = supervisorClient.getSupervisorById(supId);
                if (existingSupervisor != null) {
                    SupervisorResponse response = modelMapper.map(existingSupervisor, SupervisorResponse.class);
                    response.setProjects(Collections.singletonList(project.getProjectId()));
                    supervisorResponses.add(response);
                    logger.info("Using existing supervisor record for ID: {}", supId);
                    continue;
                }
            } catch (FeignException.NotFound supervisorNotFound) {
                // Proceed to promote if supervisor doesn't exist
                logger.info("ID {} not found as supervisor, checking as employee", supId);
            }

            try {
                // Step 2: Try treating as employee
                Employee employee = employeeClient.getEmployeeById(supId);

                if (employee != null) {
                    // Promote to supervisor
                    Supervisor supervisor = createSupervisorFromEmployee(supId, project.getProjectId());
                    supervisor.setSupervisorId(supId);

                    Supervisor createdSupervisor = supervisorClient.createSupervisor(supervisor);

                    SupervisorResponse supervisorResponse = modelMapper.map(createdSupervisor, SupervisorResponse.class);
                    supervisorResponse.setProjects(Collections.singletonList(project.getProjectId()));
                    supervisorResponses.add(supervisorResponse);

                    logger.info("Promoted employee {} to supervisor.", supId);

                    // Optional: delete employee record (commented for safety)
                    /*
                    try {
                        employeeClient.deleteEmployeeProj(supId);
                        logger.info("Deleted employee {} after promotion.", supId);
                    } catch (FeignException e) {
                        logger.error("Failed to delete employee {} after promotion: {}", supId, e.getMessage());
                    }
                    */
                }

            } catch (FeignException.NotFound notEmployee) {
                // Step 3: Neither employee nor supervisor — report error
                logger.warn("ID {} is neither employee nor supervisor", supId);
                throw new ResourceNotFoundException("No employee or supervisor found with ID: " + supId);
            } catch (FeignException e) {
                logger.error("Unexpected error during supervisor processing for ID {}: {}", supId, e.getMessage());
            }
        }

        return supervisorResponses;
    }

    
    private List<EmployeeResponse> getEmployeesForSupervisor(String supervisorId) {
        List<Project> projects = projectRepository.findBySupervisorTeamMembersContains(supervisorId);

        Set<String> employeeIds = new HashSet<>();
        for (Project project : projects) {
            employeeIds.addAll(project.getEmployeeTeamMembers());
        }

        return employeeIds.stream()
            .map(empId -> {
                Employee employee = employeeClient.getEmployeeById(empId);
                if (employee == null) {
                    throw new EmployeeNotFoundException("Employee not found: " + empId);
                }
                return modelMapper.map(employee, EmployeeResponse.class);
            }).collect(Collectors.toList());
    }
    
    private Supervisor createSupervisorFromEmployee(String empId, String projectId) {
        // Get the employee details
        Employee employee = employeeClient.getEmployeeById(empId);

        // Extract the password (assumed to be securely hashed)
        String password = employee.getPassword();

        // Create Supervisor instance and populate fields
        Supervisor supervisor = new Supervisor();
        supervisor.setFirstName(employee.getFirstName());
        supervisor.setLastName(employee.getLastName());
        supervisor.setAddress(employee.getAddress());
        supervisor.setMobileNumber(employee.getMobileNumber());
        supervisor.setEmailId(employee.getEmailId());
        supervisor.setPassword(password);  // ⚠️ Reusing existing password
        supervisor.setAadharNumber(employee.getAadharNumber());
        supervisor.setPanNumber(employee.getPanNumber());
        supervisor.setProjects(Collections.singletonList(projectId));

        // Display the password—only for debug, never in production!
        System.out.println("Supervisor password: " + password);

        return supervisor;
    }



    
    private String extractIdFromException(FeignException e) {
        // Extract the employee or supervisor ID from the exception message
        String message = e.getMessage();
        int startIndex = message.lastIndexOf("/") + 1;
        int endIndex = message.indexOf("]", startIndex);
        return message.substring(startIndex, endIndex);
    }

    private void validateEmployeeIds(List<String> employeeIds) {
        for (String empId : employeeIds) {
            if (employeeClient.getEmployeeById(empId) == null) {
                throw new ResourceNotFoundException("Employee not found with ID: " + empId);
            }
        }
    }

     private void validateSupervisorIds(List<String> supervisorIds) {
        for (String supId : supervisorIds) {
            boolean found = false;

            try {
                employeeClient.getEmployeeById(supId); // If found as employee, OK (will be converted later)
                found = true;
            } catch (FeignException.NotFound ignoredEmployee) {
                try {
                    supervisorClient.getSupervisorById(supId); // If found as supervisor, also OK
                    found = true;
                } catch (FeignException.NotFound ignoredSupervisor) {
                    // Neither employee nor supervisor found
                }
            }

            if (!found) {
                throw new ResourceNotFoundException("No employee or supervisor found with ID: " + supId);
            }
        }
    }



   

     public ProjectResponse getProjectById(String projectId) {
    	    Project project = projectRepository.findById(projectId)
    	        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found: " + projectId));

    	    List<EmployeeResponse> employeeResponses = project.getEmployeeTeamMembers().stream()
    	        .map(empId -> {
    	            try {
    	                Employee employee = employeeClient.getEmployeeById(empId);
    	                EmployeeResponse response = modelMapper.map(employee, EmployeeResponse.class);
    	                response.setProjects(Collections.singletonList(project.getProjectId()));
    	                return response;
    	            } catch (FeignException.NotFound e) {
    	                logger.warn("Employee not found: {}", empId);
    	                return null;
    	            }
    	        })
    	        .filter(Objects::nonNull)
    	        .collect(Collectors.toList());

    	    List<SupervisorResponse> supervisorResponses = project.getSupervisorTeamMembers().stream()
    	        .map(supId -> {
    	            try {
    	                Supervisor supervisor = supervisorClient.getSupervisorById(supId);
    	                SupervisorResponse response = modelMapper.map(supervisor, SupervisorResponse.class);
    	                response.setProjects(Collections.singletonList(project.getProjectId()));
    	                return response;
    	            } catch (FeignException.NotFound e) {
    	                logger.warn("Supervisor not found: {}", supId);
    	                return null;
    	            }
    	        })
    	        .filter(Objects::nonNull)
    	        .collect(Collectors.toList());

    	    return buildProjectResponse(project, employeeResponses, supervisorResponses);
    	}

 public List<ProjectResponse> getAllProjects() {
	    List<Project> projects = projectRepository.findAll();
	    List<ProjectResponse> responses = new ArrayList<>();

	    for (Project project : projects) {
	        List<EmployeeResponse> validEmployees = project.getEmployeeTeamMembers().stream()
	            .map(empId -> {
	                try {
	                    Employee employee = employeeClient.getEmployeeById(empId);
	                    EmployeeResponse response = modelMapper.map(employee, EmployeeResponse.class);
	                    response.setProjects(Collections.singletonList(project.getProjectId()));
	                    return response;
	                } catch (FeignException.NotFound e) {
	                    logger.warn("Employee not found: {}", empId);
	                    return null;
	                }
	            })
	            .filter(Objects::nonNull)
	            .collect(Collectors.toList());

	        List<SupervisorResponse> validSupervisors = project.getSupervisorTeamMembers().stream()
	            .map(supId -> {
	                try {
	                    Supervisor supervisor = supervisorClient.getSupervisorById(supId);
	                    SupervisorResponse response = modelMapper.map(supervisor, SupervisorResponse.class);
	                    response.setProjects(Collections.singletonList(project.getProjectId()));
	                    return response;
	                } catch (FeignException.NotFound e) {
	                    logger.warn("Supervisor not found: {}", supId);
	                    return null;
	                }
	            })
	            .filter(Objects::nonNull)
	            .collect(Collectors.toList());

	        // Build response with enriched team members
	        ProjectResponse projectResponse = buildProjectResponse(project, validEmployees, validSupervisors);
	        responses.add(projectResponse);
	    }

	    return responses;
	}


    public ProjectResponse updateProject(String projectId, Project updatedProject) {
        Set<String> uniqueErrors = new LinkedHashSet<>();

        // Step 1: Retrieve existing project
        Project existingProject = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        // Step 2: Update title and description
        existingProject.setProjectTitle(updatedProject.getProjectTitle());
        existingProject.setProjectDescription(updatedProject.getProjectDescription());

        // Step 3: Validate employee and supervisor IDs
        try {
            validateEmployeeIds(updatedProject.getEmployeeTeamMembers());
        } catch (EmployeeNotFoundException e) {
            uniqueErrors.add(e.getMessage());
        }

        try {
            validateSupervisorIds(updatedProject.getSupervisorTeamMembers());
        } catch (EmployeeNotFoundException | ProjectNotFoundException e) {
            uniqueErrors.add(e.getMessage());
        }

        if (!uniqueErrors.isEmpty()) {
            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
        }

        // Step 4: Handle role transitions (remove old supervisors not present in updated list)
        List<String> incomingSupervisors = updatedProject.getSupervisorTeamMembers();
        List<String> existingSupervisors = existingProject.getSupervisorTeamMembers();

        Set<String> supervisorsToRemove = new HashSet<>(existingSupervisors);
        supervisorsToRemove.removeAll(incomingSupervisors);

        for (String supervisorIdToRemove : supervisorsToRemove) {
            try {
                Supervisor supervisor = supervisorClient.getSupervisorById(supervisorIdToRemove);
                List<String> updatedProjects = Optional.ofNullable(supervisor.getProjects())
                    .orElse(new ArrayList<>())
                    .stream()
                    .filter(pid -> !pid.equals(existingProject.getProjectId()))
                    .collect(Collectors.toList());

                supervisor.setProjects(updatedProjects);
                supervisorRepository.save(supervisor); // or use supervisorClient.updateSupervisor()
                logger.info("Removed project {} from former supervisor {}", projectId, supervisorIdToRemove);
            } catch (FeignException e) {
                logger.warn("Failed to update supervisor {}: {}", supervisorIdToRemove, e.getMessage());
            }
        }

        // Step 5: Handle updated employee and supervisor responses
        List<EmployeeResponse> employeeResponses = handleEmployeeTeamMembersWithProjectId(updatedProject, projectId);
        List<SupervisorResponse> supervisorResponses = handleSupervisorTeamMembersWithProjectId(updatedProject, projectId);

        if (!uniqueErrors.isEmpty()) {
            throw new InvalidRequestException(String.join(" and ", uniqueErrors));
        }

        // Step 6: Apply updated team members to project entity
        existingProject.setEmployeeTeamMembers(updatedProject.getEmployeeTeamMembers());
        existingProject.setSupervisorTeamMembers(updatedProject.getSupervisorTeamMembers());

        // Step 7: Save and respond
        projectRepository.save(existingProject);
        return buildProjectResponse(existingProject, employeeResponses, supervisorResponses);
    }


    public List<EmployeeResponse> handleEmployeeTeamMembersWithProjectId(Project project, String projectId) {
        return project.getEmployeeTeamMembers().stream()
            .map(empId -> {
                Employee employee = employeeClient.getEmployeeById(empId);
                EmployeeResponse employeeResponse = modelMapper.map(employee, EmployeeResponse.class);
                employeeResponse.setProjects(Collections.singletonList(projectId));
                return employeeResponse;
            })
            .collect(Collectors.toList());
    }

    public List<SupervisorResponse> handleSupervisorTeamMembersWithProjectId(Project project, String projectId) {
        List<SupervisorResponse> supervisorResponses = new ArrayList<>();

        for (String supId : project.getSupervisorTeamMembers()) {
            try {
                // Try fetching as Supervisor first
                Supervisor supervisor = supervisorClient.getSupervisorById(supId);
                SupervisorResponse response = modelMapper.map(supervisor, SupervisorResponse.class);
                response.setProjects(Collections.singletonList(projectId));
                supervisorResponses.add(response);
                logger.info("Using existing supervisor record for ID: {}", supId);

            } catch (FeignException.NotFound e) {
                logger.info("ID {} not found as supervisor, checking as employee", supId);

                try {
                    // Try fetching as Employee and promote
                    Employee employee = employeeClient.getEmployeeById(supId);
                    if (employee != null) {
                        Supervisor newSupervisor = createSupervisorFromEmployee(supId, projectId);
                        newSupervisor.setSupervisorId(supId);

                        Supervisor createdSupervisor = supervisorClient.createSupervisor(newSupervisor);
                        SupervisorResponse supervisorResponse = modelMapper.map(createdSupervisor, SupervisorResponse.class);
                        supervisorResponse.setProjects(Collections.singletonList(projectId));
                        supervisorResponses.add(supervisorResponse);

                        logger.info("Promoted employee {} to supervisor for project {}", supId, projectId);
                    }
                } catch (FeignException.NotFound ex) {
                    logger.warn("ID {} is neither supervisor nor employee", supId);
                    throw new ResourceNotFoundException("No employee or supervisor found with ID: " + supId);
                }
            }
        }

        return supervisorResponses;
    }


    public void deleteProject(String projectId) {
        Set<String> uniqueErrors = new LinkedHashSet<>();

        // Step 1: Retrieve the project
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        // Step 2: Archive the project
        ArchiveProject archiveProject = modelMapper.map(project, ArchiveProject.class);
        archiveProjectRepository.save(archiveProject);

        // Step 3: Dissociate supervisors from this project
        for (String supervisorId : project.getSupervisorTeamMembers()) {
            try {
                Supervisor supervisor = supervisorClient.getSupervisorById(supervisorId);
                if (supervisor != null && supervisor.getProjects() != null) {
                    List<String> updatedProjects = supervisor.getProjects().stream()
                        .filter(pid -> !pid.equals(projectId))
                        .collect(Collectors.toList());

                    supervisor.setProjects(updatedProjects);

                    // Save updated supervisor (via repository or client)
                    supervisorRepository.save(supervisor);
                    logger.info("Removed project {} from supervisor {}", projectId, supervisorId);
                }
            } catch (FeignException e) {
                logger.warn("Failed to dissociate supervisor {} from project {}: {}", supervisorId, projectId, e.getMessage());
            }
        }

        // Step 4: Delete project from main table
        try {
            projectRepository.delete(project);
            logger.info("Successfully deleted project {}", projectId);
        } catch (Exception e) {
            uniqueErrors.add("An unexpected error occurred while deleting the project.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.join(" and ", uniqueErrors));
        }
    }


    private ProjectResponse buildProjectResponse(Project project, List<EmployeeResponse> employeeResponses, List<SupervisorResponse> supervisorResponses) {
        ProjectResponse response = modelMapper.map(project, ProjectResponse.class);
        response.setEmployeeTeamMembers(employeeResponses);
        response.setSupervisorTeamMembers(supervisorResponses);
        return response;
    }
    
    

    public EmployeeResponse getEmployeeById(String employeeId) {
        Employee employee = employeeClient.getEmployeeById(employeeId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee not found: " + employeeId);
        }

        SupervisorResponse supervisorResponse = null;
        if (employee.getSupervisorId() != null) {
            Supervisor supervisor = supervisorClient.getSupervisorById(employee.getSupervisorId());
            if (supervisor != null) {
                supervisorResponse = modelMapper.map(supervisor, SupervisorResponse.class);
            } else {
                System.err.println("Warning: Supervisor not found with ID: " + employee.getSupervisorId());
            }
        }

        EmployeeResponse employeeResponse = modelMapper.map(employee, EmployeeResponse.class);
        employeeResponse.setSupervisor(supervisorResponse);
        return employeeResponse;
    }
    
//    

    public SupervisorResponse getSupervisorById(String supervisorId) {
        Supervisor supervisor = supervisorClient.getSupervisorById(supervisorId);
        if (supervisor == null) {
            throw new RuntimeException("Supervisor not found: " + supervisorId);
        }

        List<Project> projects = projectRepository.findBySupervisorTeamMembersContains(supervisorId);

        SupervisorResponse response = new SupervisorResponse();
        response.setSupervisorId(supervisor.getSupervisorId());
        response.setFirstName(supervisor.getFirstName());
        response.setLastName(supervisor.getLastName());
        response.setAddress(supervisor.getAddress());
        response.setMobileNumber(supervisor.getMobileNumber());
        response.setEmailId(supervisor.getEmailId());
        response.setPassword(supervisor.getPassword());
        response.setAadharNumber(supervisor.getAadharNumber());
        response.setPanNumber(supervisor.getPanNumber());
        response.setProjects(projects.stream().map(Project::getProjectId).collect(Collectors.toList()));

        return response;
    }

    public boolean isSupervisorForEmployee(String supervisorId, String empId) {
        return projectRepository.findAll().stream()
            .anyMatch(project -> project.getEmployeeTeamMembers().contains(empId) &&
                project.getSupervisorTeamMembers().contains(supervisorId));
    }

    public List<String> getSupervisorsForProject(String projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        return project.getSupervisorTeamMembers().stream()
            .map(supId -> {
                Supervisor supervisor = supervisorClient.getSupervisorById(supId);
                if (supervisor != null) {
                    return supervisor.getFirstName() + " " + supervisor.getLastName();
                } else {
                    throw new RuntimeException("Supervisor not found for ID: " + supId);
                }
            }).collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByEmployeeId(String employeeId) {
        List<Project> projects = projectRepository.findByEmployeeTeamMembersContains(employeeId);

        if (projects.isEmpty()) {
            throw new RuntimeException("No projects found for employee ID: " + employeeId);
        }

        return projects.stream()
            .map(project -> {
                ProjectResponse response = new ProjectResponse();
                response.setProjectId(project.getProjectId());
                response.setProjectTitle(project.getProjectTitle());
                return response;
            }).collect(Collectors.toList());
    }

    public List<String> findSupervisorsByProjectAndEmployee(String projectId, String employeeId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        if (!project.getEmployeeTeamMembers().contains(employeeId)) {
            throw new RuntimeException("Employee with ID " + employeeId + " is not part of the project " + projectId);
        }

        List<String> supervisorIds = project.getSupervisorTeamMembers();
        if (supervisorIds.isEmpty()) {
            throw new RuntimeException("No supervisors found for the project " + projectId);
        }

        return supervisorIds;
    }

    public List<Project> getProjectsBySupervisorId(String supervisorId) {
        return projectRepository.findBySupervisorTeamMembersContains(supervisorId);
    }

    public ProjectResponse createProjectResponse(Project project) {
        List<EmployeeResponse> employeeResponses = getEmployeeResponses(project);
        List<SupervisorResponse> supervisorResponses = getSupervisorResponses(project);

        ProjectResponse projectResponse = new ProjectResponse();
        projectResponse.setProjectId(project.getProjectId());
        projectResponse.setProjectTitle(project.getProjectTitle());
        projectResponse.setProjectDescription(project.getProjectDescription());
        projectResponse.setEmployeeTeamMembers(employeeResponses);
        projectResponse.setSupervisorTeamMembers(supervisorResponses);

        return projectResponse;
    }
    
    private List<EmployeeResponse> getEmployeeResponses(Project project) {
        return project.getEmployeeTeamMembers().stream()
            .map(empId -> {
                Employee employee = employeeClient.getEmployeeById(empId);
                if (employee == null) {
                    throw new RuntimeException("Employee not found: " + empId);
                }
                return modelMapper.map(employee, EmployeeResponse.class);
            }).collect(Collectors.toList());
    }

    private List<SupervisorResponse> getSupervisorResponses(Project project) {
        return project.getSupervisorTeamMembers().stream()
            .map(supId -> {
                Supervisor supervisor = supervisorClient.getSupervisorById(supId);
                if (supervisor == null) {
                    throw new RuntimeException("Supervisor not found: " + supId);
                }
                return modelMapper.map(supervisor, SupervisorResponse.class);
            }).collect(Collectors.toList());
    }
    public List<SupervisorResponse> getSupervisorsByEmployeeId(String employeeId) {
        // Fetch all projects where the employee is part of the team
        List<Project> projects = projectRepository.findByEmployeeTeamMembersContains(employeeId);

        if (projects.isEmpty()) {
            throw new RuntimeException("No projects found for employee ID: " + employeeId);
        }

        // Set to collect unique supervisor IDs
        Set<String> supervisorIds = new HashSet<>();

        // Collect all unique supervisor IDs from these projects
        for (Project project : projects) {
            supervisorIds.addAll(project.getSupervisorTeamMembers());
        }

        // Retrieve supervisor details and convert to SupervisorResponse
        List<SupervisorResponse> supervisorResponses = supervisorIds.stream()
            .map(supervisorId -> {
                Supervisor supervisor = supervisorRepository.findById(supervisorId)
                    .orElseThrow(() -> new RuntimeException("Supervisor not found: " + supervisorId));

                SupervisorResponse supervisorResponse = new SupervisorResponse();
                supervisorResponse.setSupervisorId(supervisor.getSupervisorId());
                supervisorResponse.setFirstName(supervisor.getFirstName());
                supervisorResponse.setLastName(supervisor.getLastName());
                supervisorResponse.setAddress(supervisor.getAddress());
                supervisorResponse.setMobileNumber(supervisor.getMobileNumber());
                supervisorResponse.setEmailId(supervisor.getEmailId());
                supervisorResponse.setPassword(supervisor.getPassword());
                supervisorResponse.setAadharNumber(supervisor.getAadharNumber());
                supervisorResponse.setPanNumber(supervisor.getPanNumber());
                supervisorResponse.setProjects(projectRepository.findBySupervisorTeamMembersContains(supervisorId)
                    .stream().map(Project::getProjectId).collect(Collectors.toList()));

                return supervisorResponse;
            })
            .collect(Collectors.toList());

        return supervisorResponses;
    }

}
