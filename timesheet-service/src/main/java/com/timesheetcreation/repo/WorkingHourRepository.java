package com.timesheetcreation.repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheetcreation.entity.WorkingHour;



public interface WorkingHourRepository extends JpaRepository<WorkingHour, Long> {
	
	
	 List<WorkingHour> findByEmployeeId(String employeeId);

	    List<WorkingHour> findByProjectId(String projectId);


	    List<WorkingHour> findByEmployeeIdAndProjectId(String employeeId, String projectId);

	    List<WorkingHour> findByEmployeeIdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);

	    List<WorkingHour> findByEmployeeIdAndStatus(String employeeId, String status);

	    List<WorkingHour> findByDateBetween(LocalDate startDate, LocalDate endDate);

	    List<WorkingHour> findByEmployeeIdAndDateBetweenAndStatus(String employeeId, LocalDate startDate, LocalDate endDate, String status);
	    
	    List<WorkingHour> findByProjectIdIn(List<String> projectIds);
	    
	    List<WorkingHour> findByProjectIdInAndStatus(List<String> projectIds, String status);
	    
	    Optional<WorkingHour> findByEmployeeIdAndProjectIdAndDate(String employeeId, String projectId, LocalDate date);

	    
	 // 1. Find working hours by employee ID and project IDs
	    List<WorkingHour> findByEmployeeIdAndProjectIdIn(String employeeId, List<String> projectIds);

	    // 2. Find working hours by employee ID, project IDs, and status
	    List<WorkingHour> findByEmployeeIdAndProjectIdInAndStatus(String employeeId, List<String> projectIds, String status);

		List<WorkingHour> findByDateBefore(LocalDate thresholdDate);
	    
}
