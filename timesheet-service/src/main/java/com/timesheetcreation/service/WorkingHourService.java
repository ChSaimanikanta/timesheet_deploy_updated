package com.timesheetcreation.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.timesheetcreation.client.ProjectClient;
import com.timesheetcreation.entity.Project;
import com.timesheetcreation.entity.WorkingHour;
import com.timesheetcreation.repo.WorkingHourRepository;

@Service
public class WorkingHourService {
    @Autowired
    private WorkingHourRepository workingHourRepository;

    @Autowired
    private ProjectClient projectClient;

    // Create or Update a WorkingHour
    public WorkingHour saveOrUpdateWorkingHour(WorkingHour workingHour) {
        Optional<WorkingHour> existingRecord = workingHourRepository
            .findByEmployeeIdAndProjectIdAndDate(
                workingHour.getEmployeeId(), workingHour.getProjectId(), workingHour.getDate()
            );

        if (existingRecord.isPresent()) {
            // Update existing entry
            WorkingHour updatedEntry = existingRecord.get();
            updatedEntry.setHours(workingHour.getHours());
            updatedEntry.setStatus(workingHour.getStatus());
            updatedEntry.setRejectionReason(workingHour.getRejectionReason());
            return workingHourRepository.save(updatedEntry);
        } else {
            // Save new entry
            return workingHourRepository.save(workingHour);
        }
    }

    // Save multiple WorkingHours
    public List<WorkingHour> saveMultipleWorkingHours(List<WorkingHour> workingHours) {
        List<WorkingHour> savedWorkingHours = new ArrayList<>();

        for (WorkingHour workingHour : workingHours) {
            Optional<WorkingHour> existingRecord = workingHourRepository.findByEmployeeIdAndProjectIdAndDate(
                workingHour.getEmployeeId(), workingHour.getProjectId(), workingHour.getDate()
            );

            if (existingRecord.isPresent()) {
                WorkingHour updatedEntry = existingRecord.get();

                // Detect changes
                boolean hoursChanged = updatedEntry.getHours() != workingHour.getHours();
                boolean rejectionRemoved = updatedEntry.getRejectionReason() != null && workingHour.getRejectionReason() == null;

                // Update fields
                updatedEntry.setHours(workingHour.getHours());
                updatedEntry.setStatus(workingHour.getStatus() != null ? workingHour.getStatus() : updatedEntry.getStatus());
                updatedEntry.setRejectionReason(workingHour.getRejectionReason());

                // Enforce status update if necessary
                if (hoursChanged || rejectionRemoved || updatedEntry.getStatus().equals("REJECTED") || updatedEntry.getStatus().equals("APPROVED")) {
                    updatedEntry.setStatus("NEW");
                }

                savedWorkingHours.add(workingHourRepository.save(updatedEntry));
            } else {
                // Set default status for new records
                workingHour.setStatus(workingHour.getStatus() != null ? workingHour.getStatus() : "NEW");
                savedWorkingHours.add(workingHourRepository.save(workingHour));
            }
        }
        return savedWorkingHours;
    }


    // Get WorkingHours by Employee ID and Date Range
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate) {
        return workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
    }

    // Get WorkingHours by ID
    public Optional<WorkingHour> getWorkingHourById(Long id) {
        return workingHourRepository.findById(id);
    }

    // Get all WorkingHours within a date range
    public List<WorkingHour> getAllWorkingHoursWithinDateRange(LocalDate startDate, LocalDate endDate) {
        return workingHourRepository.findByDateBetween(startDate, endDate);
    }

    // Get WorkingHours by Employee ID and Status "NEW"
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndStatusNew(String employeeId) {
        return workingHourRepository.findByEmployeeId(employeeId);
    }

    // Get supervisor IDs based on employee ID and project ID
    private List<String> getSupervisorIdsByEmployeeIdAndProjectId(String employeeId, String projectId) {
        return projectClient.getSupervisorsByProjectAndEmployee(projectId, employeeId);
    }

    // Approve or Reject a WorkingHour by ID
    public WorkingHour approveOrRejectWorkingHourById(Long id, String status, String rejectionReason, String employeeId, String projectId) {
        List<String> supervisorIds = getSupervisorIdsByEmployeeIdAndProjectId(employeeId, projectId);
        if (supervisorIds.isEmpty()) {
            throw new RuntimeException("No supervisors found for the given employee and project.");
        }
        Optional<WorkingHour> optionalWorkingHour = workingHourRepository.findById(id);
        if (optionalWorkingHour.isPresent()) {
            WorkingHour workingHour = optionalWorkingHour.get();
            workingHour.setStatus(status);
            if ("REJECTED".equalsIgnoreCase(status)) {
                workingHour.setRejectionReason(rejectionReason);
            }
            return workingHourRepository.save(workingHour);
        }
        throw new RuntimeException("WorkingHour not found");
    }

    // Approve or Reject WorkingHours by Employee ID and Date Range
    public List<WorkingHour> approveOrRejectWorkingHoursByEmployeeIdAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate, String status, String rejectionReason, String projectId) {
        List<String> supervisorIds = getSupervisorIdsByEmployeeIdAndProjectId(employeeId, projectId);
        if (supervisorIds.isEmpty()) {
            throw new RuntimeException("No supervisors found for the given employee and project.");
        }
        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetweenAndStatus(employeeId, startDate, endDate, "NEW");
        workingHours.forEach(wh -> {
            wh.setStatus(status);
            if ("REJECTED".equalsIgnoreCase(status)) {
                wh.setRejectionReason(rejectionReason);
            }
        });
        return workingHourRepository.saveAll(workingHours);
    }

    // Get WorkingHours for Employees under a Supervisor by Supervisor ID
    public List<WorkingHour> getWorkingHoursBySupervisorIdAndDateRange(String supervisorId, LocalDate startDate, LocalDate endDate) {
        // Get projects where the supervisor is a member
        List<Project> projects = projectClient.getProjectsBySupervisorId(supervisorId);
        // Collect all project IDs
        List<String> projectIds = projects.stream()
                                          .map(Project::getProjectId)
                                          .collect(Collectors.toList());
        // Fetch working hours for the collected project IDs and date range
        return workingHourRepository.findByProjectIdIn(projectIds).stream()
                .filter(wh -> !wh.getDate().isBefore(startDate) && !wh.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }

    // Method to approve or reject work hours by Supervisor
    public List<WorkingHour> approveOrRejectWorkHoursBySupervisor(String supervisorId, String status, String rejectionReason) {
        List<WorkingHour> workingHours = getWorkingHoursBySupervisorId(supervisorId);
        workingHours.forEach(wh -> {
            wh.setStatus(status);
            if ("REJECTED".equalsIgnoreCase(status)) {
                wh.setRejectionReason(rejectionReason);
            }
        });
        return workingHourRepository.saveAll(workingHours);
    }


	// Method to approve or reject work hours for a specific employee under a supervisor
    public List<WorkingHour> approveOrRejectWorkHoursForEmployee(String supervisorId, String employeeId, String status, String rejectionReason) {
        List<WorkingHour> workingHours = getWorkingHoursBySupervisorId(supervisorId).stream()
                .filter(wh -> wh.getEmployeeId().equals(employeeId))
                .collect(Collectors.toList());
        workingHours.forEach(wh -> {
            wh.setStatus(status);
            if ("REJECTED".equalsIgnoreCase(status)) {
                wh.setRejectionReason(rejectionReason);
            }
        });
        return workingHourRepository.saveAll(workingHours);
    }
    
    
    
    // Method to get Working Hours by Supervisor ID
    public List<WorkingHour> getWorkingHoursBySupervisorId(String supervisorId) {
        // Fetch the projects managed by the supervisor
        List<Project> projects = projectClient.getProjectsBySupervisorId(supervisorId);
        
        // Collect all project IDs managed by the supervisor
        List<String> projectIds = projects.stream()
                                          .map(Project::getProjectId)
                                          .collect(Collectors.toList());
        
        // Retrieve working hours for employees working on these projects
        return workingHourRepository.findByProjectIdIn(projectIds);
    }
    
    
    
    // Get WorkingHours for Employees under a Supervisor by Supervisor ID and Date Range
    public List<WorkingHour> getWorkingHoursByEmpSupervisorIdAndDateRange(String supervisorId, LocalDate startDate, LocalDate endDate) {
        // Get projects where the supervisor is a member
        List<Project> projects = projectClient.getProjectsBySupervisorId(supervisorId);

        // Collect all project IDs
        List<String> projectIds = projects.stream()
                                          .map(Project::getProjectId)
                                          .collect(Collectors.toList());

        // Retrieve working hours for these project IDs within the specified date range
        return workingHourRepository.findByProjectIdIn(projectIds).stream()
                .filter(wh -> !wh.getDate().isBefore(startDate) && !wh.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }
    
    

    // Update WorkingHours by ID
    public WorkingHour updateWorkingHour(Long id, WorkingHour updatedWorkingHour) {
        return workingHourRepository.findById(id).map(existingWorkingHour -> {
            existingWorkingHour.setEmployeeId(updatedWorkingHour.getEmployeeId());
            existingWorkingHour.setProjectId(updatedWorkingHour.getProjectId());
            existingWorkingHour.setDate(updatedWorkingHour.getDate());
            existingWorkingHour.setHours(updatedWorkingHour.getHours());
            existingWorkingHour.setStatus(updatedWorkingHour.getStatus());
            existingWorkingHour.setRejectionReason(updatedWorkingHour.getRejectionReason());
            return workingHourRepository.save(existingWorkingHour);
        }).orElseThrow(() -> new RuntimeException("WorkingHour not found"));
    }
    
    
    
    
    
    // Get WorkingHours with status "NEW" for Employees under a Supervisor by Supervisor ID
    public Map<String, Object> getFormattedWorkingHoursBySupervisorId(String supervisorId) {
        // Get projects where the supervisor is a member
        List<Project> projects = projectClient.getProjectsBySupervisorId(supervisorId);

        // Collect all project IDs
        List<String> projectIds = projects.stream()
                                          .map(Project::getProjectId)
                                          .collect(Collectors.toList());

        // Retrieve working hours for these project IDs with status "NEW"
        List<WorkingHour> workingHours = workingHourRepository.findByProjectIdInAndStatus(projectIds, "NEW");

        // Group working hours by employeeId
        Map<String, List<WorkingHour>> groupedByEmployee = workingHours.stream()
                .collect(Collectors.groupingBy(WorkingHour::getEmployeeId));

        // Create a map to store the final response
        Map<String, Object> response = new HashMap<>();

        // Build the required JSON format for each employee
        groupedByEmployee.forEach((employeeId, hoursList) -> {
            Map<String, Object> employeeData = new HashMap<>();
            employeeData.put("employeeId", employeeId);
            employeeData.put("workingHours", hoursList);

            // Calculate total hours
            int totalHours = hoursList.stream().mapToInt(WorkingHour::getHours).sum();
            employeeData.put("totalHours", totalHours);

            // Add employee data to the response map
            response.put(employeeId, employeeData);
        });

        return response;
    }
    
    
    
    
    
    
    // Delete Working Hours by Working Hour ID
    public void deleteEmployeeWorkingHoursById(Long id) {
        if (workingHourRepository.existsById(id)) {
            workingHourRepository.deleteById(id);
        } else {
            throw new RuntimeException("WorkingHour not found");
        }
    }

    // Delete all Working Hours within a date range
    public void deleteAllEmployeeWorkingHoursUsingDateRange(LocalDate startDate, LocalDate endDate) {
        List<WorkingHour> workingHours = workingHourRepository.findByDateBetween(startDate, endDate);
        if (!workingHours.isEmpty()) {
            workingHourRepository.deleteAll(workingHours);
        } else {
            throw new RuntimeException("No WorkingHours found in the given date range");
        }
    }

    // Delete Working Hours by Employee ID and Date Range
    public void deleteEmployeeWorkingHoursUsingEmployeeIdAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate) {
        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
        if (!workingHours.isEmpty()) {
            workingHourRepository.deleteAll(workingHours);
        } else {
            throw new RuntimeException("No WorkingHours found for the given employee and date range");
        }
    }
    
    // Scheduled task to automatically delete old records every month
//    @Scheduled(cron = "0 0 1 * * ?") // Runs at midnight on the 1st of every month
//    public void cleanUpOldWorkingHours() {
//        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
//        LocalDate thresholdDate = currentMonth.minusMonths(3); // Retain only last 3 months
//
//        List<WorkingHour> oldRecords = workingHourRepository.findByDateBefore(thresholdDate);
//
//        if (!oldRecords.isEmpty()) {
//            workingHourRepository.deleteAll(oldRecords); // Delete outdated records
//            System.out.println("Deleted old records before: " + thresholdDate);
//        } else {
//            System.out.println("No old records found for deletion.");
//        }
//    }
    
// // Scheduled task to automatically delete all records except the current month
//    @Scheduled(cron = "0 44 15 * * ?") // Runs daily at 3:42 PM
// // Runs at midnight on the 1st of every month
//    public void cleanUpOldWorkingHours() {
//        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1); // Start of current month
//
//        // Find records older than the current month
//        List<WorkingHour> oldRecords = workingHourRepository.findByDateBefore(currentMonth);
//
//        if (!oldRecords.isEmpty()) {
//            workingHourRepository.deleteAll(oldRecords); // Delete all outdated records
//            System.out.println("Deleted all records before: " + currentMonth);
//        } else {
//            System.out.println("No old records found for deletion.");
//        }
//    }
    public List<WorkingHour> updateWorkHoursUsingEmployeeIdAndDateRange(List<WorkingHour> workingHours) {
        List<WorkingHour> updatedWorkingHours = new ArrayList<>();
        for (WorkingHour inputWorkHour : workingHours) {
            Optional<WorkingHour> existingWorkHourOpt = workingHourRepository
                    .findByEmployeeIdAndProjectIdAndDate(
                            inputWorkHour.getEmployeeId(),
                            inputWorkHour.getProjectId(),
                            inputWorkHour.getDate()
                    );

            if (existingWorkHourOpt.isPresent()) {
                WorkingHour existingWorkHour = existingWorkHourOpt.get();
                existingWorkHour.setHours(inputWorkHour.getHours()); // Update hours
                updatedWorkingHours.add(workingHourRepository.save(existingWorkHour));
            } else {
                throw new RuntimeException("No work hour found for Employee ID: " 
                        + inputWorkHour.getEmployeeId() + " on Date: " + inputWorkHour.getDate());
            }
        }
        return updatedWorkingHours;
    }
    
    
    
    
    
    
    
    
    
    
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndSupervisorIdWithinDateRange(String employeeId, String supervisorId, LocalDate startDate, LocalDate endDate) {
        // Get projects where the supervisor is a member
        List<Project> projects = projectClient.getProjectsBySupervisorId(supervisorId);

        // Collect all project IDs
        List<String> projectIds = projects.stream()
                                          .map(Project::getProjectId)
                                          .collect(Collectors.toList());

        // Fetch working hours for the employee within the specified date range and project IDs
        return workingHourRepository.findByEmployeeIdAndProjectIdIn(employeeId, projectIds).stream()
                .filter(wh -> !wh.getDate().isBefore(startDate) && !wh.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }
    
    
    
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndSupervisorIdWithinDateRangeWithStatusNew(String employeeId, String supervisorId, LocalDate startDate, LocalDate endDate) {
        // Get projects where the supervisor is a member
        List<Project> projects = projectClient.getProjectsBySupervisorId(supervisorId);

        // Collect all project IDs
        List<String> projectIds = projects.stream()
                                          .map(Project::getProjectId)
                                          .collect(Collectors.toList());

        // Fetch working hours with status "NEW" for the employee within the specified date range and project IDs
        return workingHourRepository.findByEmployeeIdAndProjectIdInAndStatus(employeeId, projectIds, "NEW").stream()
                .filter(wh -> !wh.getDate().isBefore(startDate) && !wh.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }
    
    
    
    
    

}