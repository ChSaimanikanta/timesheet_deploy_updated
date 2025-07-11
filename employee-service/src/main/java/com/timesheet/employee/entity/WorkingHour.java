package com.timesheet.employee.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class WorkingHour {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String employeeId;
	    private String projectId;
	    private LocalDate date;
	    private int hours;
	    private String status; // NEW, APPROVED, REJECTED
	    private String rejectionReason;
}
