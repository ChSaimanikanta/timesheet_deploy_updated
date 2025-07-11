package com.timesheet.admin.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.admin.entity.LeaveRequest;



public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>{

	

}
