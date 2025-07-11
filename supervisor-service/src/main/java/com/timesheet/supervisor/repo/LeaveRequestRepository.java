package com.timesheet.supervisor.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timesheet.supervisor.entity.LeaveRequest;





public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>{

	List<LeaveRequest> findBySupervisorId(String supervisorId);

	
}
