package com.create.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.create.project.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, String>{

}
