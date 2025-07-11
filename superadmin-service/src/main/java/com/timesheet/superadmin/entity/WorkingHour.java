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
@Table(name = "wkhrsupadmin")
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
