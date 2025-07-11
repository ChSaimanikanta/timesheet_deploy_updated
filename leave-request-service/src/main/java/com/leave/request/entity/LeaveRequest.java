package com.leave.request.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequest {

	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String employeeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int noOfDays;
    private String reason;
    private String comments;
    private String status;   
    private String reasonForRejection;
    private String approvedBy;
    private String rejectedBy;
    private String supervisorId;
    
    private String projectId;
	
    @ElementCollection
    private List<String> supervisors;
}
