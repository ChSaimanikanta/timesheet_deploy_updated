package com.timesheet.supervisor.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Sup_LeaveRequests")
public class LeaveRequest {

	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    private String supervisorId;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private int noOfDays;
	    private String reason;
	    private String comments;
	    private String status;  
	    private String reasonForRejection;
	    private String approvedBy;
	    private String rejectedBy;
	    
}
