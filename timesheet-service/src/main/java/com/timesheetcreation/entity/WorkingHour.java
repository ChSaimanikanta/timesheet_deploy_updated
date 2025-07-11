package com.timesheetcreation.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WorkingHour {

    public WorkingHour(String employeeId2, String projectId2, LocalDate date2, int hours2, String status2) {
		// TODO Auto-generated constructor stub
	}
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String employeeId;
    private String projectId;
    private LocalDate date;
    private int hours;
    private String status = "NEW"; // Default status is "NEW"
    private String rejectionReason;
    
    
}
