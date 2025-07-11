package com.create.project.entity;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
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
@Table(name = "project", uniqueConstraints = {
	    @UniqueConstraint(columnNames = "projectTitle")
	})
public class Project {

	@Id
    @Column(updatable = false, nullable = false)
    private String projectId;
	   @Column(nullable = false)
    private String projectTitle;
    private String projectDescription;

    @ElementCollection
    private List<String> employeeTeamMembers = new ArrayList<>();

    @ElementCollection
    private List<String> supervisorTeamMembers = new ArrayList<>();

}
