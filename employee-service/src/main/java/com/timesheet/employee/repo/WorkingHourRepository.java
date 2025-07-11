package com.timesheet.employee.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.employee.entity.WorkingHour;

public interface WorkingHourRepository extends JpaRepository<WorkingHour, Long> {

	

	  List<WorkingHour> findByEmployeeId(String employeeId);

	    List<WorkingHour> findByEmployeeIdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);

		List<WorkingHour> findByDateBetween(LocalDate startDate, LocalDate endDate);
		

}
