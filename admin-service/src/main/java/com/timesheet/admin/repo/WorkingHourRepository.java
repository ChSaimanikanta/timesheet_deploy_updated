package com.timesheet.admin.repo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.admin.entity.WorkingHour;



public interface WorkingHourRepository extends JpaRepository<WorkingHour, Long> {

    List<WorkingHour> findByEmployeeId(String employeeId);

    List<WorkingHour> findByEmployeeIdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);

	List<WorkingHour> findByDateBetween(LocalDate startDate, LocalDate endDate);
	
	List<WorkingHour> findByStatus(String status);

	Optional<WorkingHour> findByEmployeeIdAndProjectIdAndDate(String employeeId, String projectId, LocalDate date);
}
