package com.timesheet.employee.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timesheet.employee.entity.ProjectWorkingHours;
import com.timesheet.employee.entity.WorkingHour;
import com.timesheet.employee.repo.WorkingHourRepository;



@Service
public class WorkingHourService {

	    @Autowired
	    private WorkingHourRepository workingHourRepository;

	    public List<WorkingHour> saveWorkingHours(List<WorkingHour> workingHours) {
	        for (WorkingHour workingHour : workingHours) {
	            workingHour.setStatus("NEW");
	        }
	        return workingHourRepository.saveAll(workingHours);
	    }

	    public List<WorkingHour> getWorkingHoursByEmployeeId(String employeeId) {
	        return workingHourRepository.findByEmployeeId(employeeId);
	    }

	    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate) {
	        return workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
	    }

	    public WorkingHour approveWorkingHour(Long id) {
	        WorkingHour workingHour = workingHourRepository.findById(id).orElseThrow(() -> new RuntimeException("WorkingHour not found"));
	        workingHour.setStatus("APPROVED");
	        return workingHourRepository.save(workingHour);
	    }

	    public WorkingHour rejectWorkingHour(Long id) {
	        WorkingHour workingHour = workingHourRepository.findById(id).orElseThrow(() -> new RuntimeException("WorkingHour not found"));
	        workingHour.setStatus("REJECTED");
	        return workingHourRepository.save(workingHour);
	    }

	    public WorkingHour updateWorkingHour(WorkingHour workingHour) {
	        return workingHourRepository.save(workingHour);
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

//	    public List<ProjectWorkingHours> getTotalWorkingHoursByEmployeeIdAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate) {
//	        List<WorkingHour> workingHours = workingHourRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
//	        Map<String, ProjectWorkingHours> projectMap = new HashMap<>();
//
//	        for (WorkingHour workingHour : workingHours) {
//	            ProjectWorkingHours projectWorkingHours = projectMap.getOrDefault(workingHour.getProjectId(), new ProjectWorkingHours(workingHour.getProjectId()));
//	            projectWorkingHours.addWorkingHour(workingHour);
//	            projectMap.put(workingHour.getProjectId(), projectWorkingHours);
//	        }
//
//	        return new ArrayList<>(projectMap.values());
//	    }
	    
	    
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
	    
	    

}
