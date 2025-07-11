package com.timesheet.employee.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.employee.entity.LeaveRequest;



public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>{

}
