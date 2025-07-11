package com.timesheet.superadmin.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.superadmin.entity.LeaveRequest;



public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>{

}
