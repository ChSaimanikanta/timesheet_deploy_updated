package com.timesheet.employee.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class LeaveRequest {

	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    private String empId;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private int noOfDays;
	    private String reason;
	    private String comments;
	    private String status;   
	    private String reasonForRejection;
	
}
