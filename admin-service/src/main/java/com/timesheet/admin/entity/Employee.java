package com.timesheet.admin.entity;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;

import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Employee {

	@Id
	private String employeeId;

	@NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    @NotBlank(message = "Address must not be blank")
    private String address;

    @NotNull(message = "Mobile number must not be null")
    @Min(value = 1000000000L, message = "mobileNumber must be at least 10 digits long")
    @Max(value = 9999999999L, message = "mobileNumber must be at most 10 digits long")
    private Long mobileNumber;

    @NotBlank(message = "Email ID must not be blank")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", 
       message = "Email address must be valid")
    private String emailId;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Aadhar number must not be null")
    @Min(value = 100000000000L, message = "Aadhar number must be at least 12 digits long")
    @Max(value = 999999999999L, message = "Aadhar number must be at most 12 digits long")
    private Long aadharNumber;

    @NotBlank(message = "PAN number must not be blank")
    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "PAN number must have the format ABCDE1234F")
    private String panNumber;

    private List<String> supervisors; // Nullable
    
    // private List<String> supervisorId;
    
    private List<String> projects;
}
