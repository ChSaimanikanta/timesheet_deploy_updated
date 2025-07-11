package com.timesheet.supervisor.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timesheet.supervisor.entity.EmployeeWorkingHours;
import com.timesheet.supervisor.entity.ProjectWorkingHours;
import com.timesheet.supervisor.entity.WorkingHour;
import com.timesheet.supervisor.repo.WorkingHourRepository;





@Service
public class WorkingHourService {

	    @Autowired
	    private WorkingHourRepository workingHourRepository;

	    public List<WorkingHour> saveWorkingHours(List<WorkingHour> workingHours) {
	        List<WorkingHour> updatedWorkingHours = new ArrayList<>();

	        for (WorkingHour workingHour : workingHours) {
	            Optional<WorkingHour> existingRecord = workingHourRepository.findByEmployeeIdAndProjectIdAndDate(
	                workingHour.getEmployeeId(), workingHour.getProjectId(), workingHour.getDate()
	            );

	            if (existingRecord.isPresent()) {
	                WorkingHour updatedEntry = existingRecord.get();
	                updatedEntry.setHours(workingHour.getHours());
	                updatedEntry.setStatus(workingHour.getStatus() != null ? workingHour.getStatus() : updatedEntry.getStatus());
	                updatedEntry.setRejectionReason(workingHour.getRejectionReason());

	                // Reset status if necessary
	                boolean hoursChanged = updatedEntry.getHours() != workingHour.getHours();
	                boolean rejectionRemoved = updatedEntry.getRejectionReason() != null && workingHour.getRejectionReason() == null;

	                if (hoursChanged || rejectionRemoved || updatedEntry.getStatus().equals("REJECTED") || updatedEntry.getStatus().equals("APPROVED")) {
	                    updatedEntry.setStatus("NEW");
	                }

	                updatedWorkingHours.add(updatedEntry);
	            } else {
	                workingHour.setStatus(workingHour.getStatus() != null ? workingHour.getStatus() : "NEW");
	                updatedWorkingHours.add(workingHour);
	            }
	        }
	        
	        return workingHourRepository.saveAll(updatedWorkingHours);
	    }


	    public List<WorkingHour> getWorkingHoursByEmployeeId(String employeeId) {
	        return workingHourRepository.findByEmployeeId(employeeId);
	    }

	    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate) {
	        return workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	    }



	    public WorkingHour approveWorkingHour(Long id, String adminId) {
	        WorkingHour workingHour = workingHourRepository.findById(id).orElseThrow(() -> new RuntimeException("WorkingHour not found"));
	        workingHour.setStatus("APPROVED");
	        workingHour.setApprovedBy(adminId); // Set the admin ID for approval
	        return workingHourRepository.save(workingHour);
	    }

	    public WorkingHour rejectWorkingHour(Long id, String reason, String adminId) {
	        WorkingHour workingHour = workingHourRepository.findById(id).orElseThrow(() -> new RuntimeException("WorkingHour not found"));
	        workingHour.setStatus("REJECTED");
	        workingHour.setRejectionReason(reason); // Set the reason for rejection
	        workingHour.setRejectedBy(adminId); // Set the admin ID for rejection
	        return workingHourRepository.save(workingHour);
	    }
	    
	    
	    
	    // Approve working hours in range
	    public List<WorkingHour> approveWorkingHoursInRange(String employeeId, LocalDate startDate, LocalDate endDate, String adminId) {
	        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	        for (WorkingHour workingHour : workingHours) {
	            workingHour.setStatus("APPROVED");
	            workingHour.setApprovedBy(adminId); // Set admin ID as approvedBy
	            workingHour.setRejectedBy(null); // Clear rejectedBy field if previously set
	            workingHour.setRejectionReason(null); // Clear rejection reason if previously set
	        }
	        return workingHourRepository.saveAll(workingHours);
	    }

	    // Reject working hours in range with reason
	    public List<WorkingHour> rejectWorkingHoursInRange(String employeeId, LocalDate startDate, LocalDate endDate, String reason, String adminId) {
	        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	        for (WorkingHour workingHour : workingHours) {
	            workingHour.setStatus("REJECTED");
	            workingHour.setRejectedBy(adminId); // Set admin ID as rejectedBy
	            workingHour.setRejectionReason(reason); // Set the reason for rejection
	            workingHour.setApprovedBy(null); // Clear approvedBy field if previously set
	        }
	        return workingHourRepository.saveAll(workingHours);
	    }
	    
	    
	    
	    

	    
	    

	    public List<WorkingHour> updateWorkingHours(List<WorkingHour> workingHours) {
	        List<Long> ids = workingHours.stream().map(WorkingHour::getId).toList();
	        
	        // Fetch existing records based on IDs
	        List<WorkingHour> existingRecords = workingHourRepository.findAllById(ids);
	        
	        // Validate that all requested records exist
	        if (existingRecords.size() != workingHours.size()) {
	            throw new IllegalArgumentException("Some records do not exist, update failed");
	        }
	        
	        return workingHourRepository.saveAll(workingHours);
	    }


	    public List<WorkingHour> updateWorkingHoursStatusInRange(String employeeId, LocalDate startDate, LocalDate endDate, String status) {
	        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	        for (WorkingHour workingHour : workingHours) {
	            workingHour.setStatus(status);
	        }
	        return workingHourRepository.saveAll(workingHours);
	    }

	    public void deleteWorkingHoursInRange(String employeeId, LocalDate startDate, LocalDate endDate) {
	        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	        workingHourRepository.deleteAll(workingHours);
	    }	    
	    
	    
	    public List<ProjectWorkingHours> getProjectWorkingHoursByEmployeeId(String employeeId) {
	        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeId(employeeId);
	        Map<String, ProjectWorkingHours> projectMap = new HashMap<>();
	        
	        for (WorkingHour workingHour : workingHours) {
	            ProjectWorkingHours projectWorkingHours = projectMap.getOrDefault(workingHour.getProjectId(), new ProjectWorkingHours(workingHour.getProjectId()));
	            projectWorkingHours.addWorkingHour(workingHour);
	            projectMap.put(workingHour.getProjectId(), projectWorkingHours);
	        }

	        return new ArrayList<>(projectMap.values());
	    }


	    
	    
	    public Map<String, List<WorkingHour>> getMultipleEmployeesWorkHoursInRange(List<String> employeeIds, LocalDate startDate, LocalDate endDate) {
	        Map<String, List<WorkingHour>> employeeWorkHoursMap = new HashMap<>();

	        for (String employeeId : employeeIds) {
	            List<WorkingHour> workHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	            employeeWorkHoursMap.put(employeeId, workHours);
	        }

	        return employeeWorkHoursMap;
	    }

	    public List<WorkingHour> getEmployeeWorkHoursInRange(String employeeId, LocalDate startDate, LocalDate endDate) {
	        return workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	    }
	    
	    
	    public Map<String, List<WorkingHour>> getAllEmployeesWorkHoursInRange(LocalDate startDate, LocalDate endDate) {
	        List<WorkingHour> workHours = workingHourRepository.findByDateBetween(startDate, endDate);
	        Map<String, List<WorkingHour>> employeeWorkHoursMap = new HashMap<>();

	        for (WorkingHour workingHour : workHours) {
	            String employeeId = workingHour.getEmployeeId();
	            employeeWorkHoursMap.computeIfAbsent(employeeId, k -> new ArrayList<>()).add(workingHour);
	        }

	        return employeeWorkHoursMap;
	    }
	    
	    
	    
	    public Map<String, EmployeeWorkingHours> getAllNewEmployeesWorkHours() {
	        List<WorkingHour> workHours = workingHourRepository.findByStatus("NEW");
	        Map<String, EmployeeWorkingHours> employeeWorkHoursMap = new HashMap<>();

	        for (WorkingHour workingHour : workHours) {
	            String employeeId = workingHour.getEmployeeId();
	            EmployeeWorkingHours employeeWorkingHours = employeeWorkHoursMap.computeIfAbsent(
	                employeeId,
	                k -> new EmployeeWorkingHours(employeeId, new ArrayList<>(), 0)
	            );
	            employeeWorkingHours.getWorkingHours().add(workingHour);
	            employeeWorkingHours.setTotalHours(employeeWorkingHours.getTotalHours() + workingHour.getHours());
	        }

	        return employeeWorkHoursMap;
	    }
	    
	    

}
