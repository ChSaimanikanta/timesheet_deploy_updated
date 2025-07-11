package com.timesheet.admin.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupervisorResponse {

	
	private String supervisorId;
    private String firstName;
    private String lastName;
    private String address;
    private Long mobileNumber;
    private String emailId;
    private String password;
    private Long aadharNumber;
    private String panNumber;
    private List<String> projects;
	
}
