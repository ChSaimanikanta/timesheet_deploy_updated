package com.timesheet.employee.entity;

import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import lombok.Data;

// @Entity
@Data
public class EmployeeServiceEntity {
	  @Id
//	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private String id;
	    private String name;
	    private String employeeId;
}
