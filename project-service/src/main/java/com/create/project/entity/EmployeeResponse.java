package com.create.project.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeResponse {
	
	 private String employeeId;
	    private String firstName;
	    private String lastName;
	    private String address;
	    private Long mobileNumber;
	    private String emailId;
	    private String password;  // This might not be required in the response
	    private Long aadharNumber;
	    private String panNumber;
	    private SupervisorResponse supervisor;  // Change to SupervisorResponse
	    private List<String> projects;
    
}
