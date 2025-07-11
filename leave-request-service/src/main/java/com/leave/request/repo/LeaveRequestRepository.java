package com.leave.request.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.leave.request.entity.LeaveRequest;

import feign.Param;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>{

	 List<LeaveRequest> findByEmployeeId(String employeeId);
	 
//	 @Query("SELECT lr FROM LeaveRequest lr WHERE :supervisorId MEMBER OF lr.supervisors")
//	 List<LeaveRequest> findLeaveRequestsBySupervisorId(@Param("supervisorId") String supervisorId);
	 
	    List<LeaveRequest> findBySupervisorsContaining(String supervisorId); // To find leave requests for a specific supervisor
	
	
}
