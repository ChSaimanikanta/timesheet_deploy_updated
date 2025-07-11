package com.timesheetcreation.entity;

import java.util.List;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {

	@Id
    @Column(updatable = false, nullable = false)
    private String projectId;
    private String projectTitle;
    private String projectDescription;

    @ElementCollection
    private List<String> employeeTeamMembers;

    @ElementCollection
    private List<String> supervisorTeamMembers;

}
