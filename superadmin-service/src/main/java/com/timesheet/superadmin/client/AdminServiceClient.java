package com.timesheet.superadmin.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.timesheet.superadmin.entity.LeaveRequest;




@FeignClient(name = "admin-service")
public interface AdminServiceClient {
	    
	    @GetMapping("/api/admin/leave-requests")
	    List<LeaveRequest> getAllLeaveRequests();

	    @PutMapping("/api/admin/leave-requests/{id}")
	    LeaveRequest updateLeaveRequest(@RequestParam Long id, @RequestBody LeaveRequest leaveRequest);
	    
	    @GetMapping("/api/admin/leave-requests/{id}")
	    LeaveRequest getLeaveRequestById(@PathVariable("id") Long id);
	    
	    
	    
}
