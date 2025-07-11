package com.timesheet.superadmin.entity;

import java.time.LocalDate;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;



@Entity
@Data
@Table(name="superadmin-approval")
public class LeaveRequest {

	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    private String adminId;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private int noOfDays;
	    private String reason;
	    private String comments;
	    private String status; // PENDING, APPROVED, REJECTED
	    private String reasonForRejection;

	
	
}
