package com.timesheet.superadmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
@Table(name = "archive_admin")
public class ArchiveAdmin {

	 @Id
	    private String adminId;

	    @NotBlank(message = "First name must not be blank")
	    private String firstName;

	    @NotBlank(message = "Last name must not be blank")
	    private String lastName;

	    @NotBlank(message = "Address must not be blank")
	    private String address;

	    @NotNull(message = "Mobile number is required")
	    private Long mobileNumber;

	    @NotBlank(message = "Email ID is required")
	    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", 
       message = "Email address must be valid")
		private String emailId;


	    @NotNull(message = "Aadhar number is required")
	    private Long aadharNumber;

	    @NotBlank(message = "PAN number is required")
	    @Pattern(regexp = "^[A-Z]{5}[A-Z0-9]{4}[A-Z]{1}$", message = "PAN card number must be of format: BEJPC8665H")
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
