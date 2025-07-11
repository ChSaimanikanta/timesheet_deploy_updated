package com.timesheet.employee.entity;



import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminEntity {

		@Id
		private String adminId;
	
		@NotBlank(message = "First name must not be blank")
	    private String firstName;

	    @NotBlank(message = "Last name must not be blank")
	    private String lastName;

	    @NotBlank(message = "Address must not be blank")
	    private String address;

	    @NotNull(message = "Mobile number must not be null")
	    private Long mobileNumber;

	    @NotBlank(message = "Email ID must not be blank")
	    private String emailId;

	    @NotNull(message = "Aadhar number must not be null")
	    private Long aadharNumber;

	    @NotBlank(message = "PAN number must not be blank")
	    private String panNumber;
	    
	    @NotBlank(message = "Password must not be blank")
	    private String password;
	    
	    private boolean canCreateEmployee;
	    private boolean canEditEmployee;
	    private boolean canDeleteEmployee;
	    private boolean canCreateProject;
	    private boolean canEditProject;
	    private boolean canDeleteProject;
}