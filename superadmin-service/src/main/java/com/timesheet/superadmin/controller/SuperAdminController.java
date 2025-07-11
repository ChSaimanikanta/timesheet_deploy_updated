package com.timesheet.superadmin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.superadmin.client.AdminServiceClient;
import com.timesheet.superadmin.entity.LeaveRequest;
import com.timesheet.superadmin.entity.ListRequest;
import com.timesheet.superadmin.entity.RejectAllRequest;
import com.timesheet.superadmin.entity.RejectReasonRequest;
import com.timesheet.superadmin.service.AdminService;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/superadmin")
public class SuperAdminController {
	
	@Autowired
    private AdminService adminService;
	
	
	 @Autowired
	    private AdminServiceClient adminServiceClient;

	    @GetMapping
	    public List<LeaveRequest> getAllLeaveRequests() {
	        return adminServiceClient.getAllLeaveRequests();
	    }

	    @PutMapping("/{id}/approve")
	    public LeaveRequest approveLeaveRequest(@PathVariable Long id) {
	        LeaveRequest leaveRequest = adminServiceClient.getLeaveRequestById(id);
	        leaveRequest.setStatus("APPROVED");
	        return adminServiceClient.updateLeaveRequest(id, leaveRequest);
	    }

//	    @PutMapping("/{id}/reject")
//	    public LeaveRequest rejectLeaveRequest(@PathVariable Long id) {
//	        LeaveRequest leaveRequest = adminServiceClient.getLeaveRequestById(id);
//	        leaveRequest.setStatus("REJECTED");
//	        return adminServiceClient.updateLeaveRequest(id, leaveRequest);
//	    }
	    
	    
	    @PutMapping("/{id}/reject")
	    public LeaveRequest rejectLeaveRequest(@PathVariable Long id, @RequestBody RejectReasonRequest rejectReasonRequest) {
	        return adminService.rejectLeaveRequest(id, rejectReasonRequest.getReasonForRejection());
	    }
	   
	    
	    @PutMapping("/leave-requests/approve-all")
	    public ResponseEntity<List<LeaveRequest>> approveAllRequests(@RequestBody ListRequest listRequest) {
	        List<LeaveRequest> approvedLeaveRequests = adminService.approveMultipleLeaveRequests(listRequest.getIds());
	        return ResponseEntity.ok(approvedLeaveRequests);
	    }

	    @PutMapping("/leave-requests/reject-all")
	    public ResponseEntity<List<LeaveRequest>> rejectAllRequests(@RequestBody RejectAllRequest rejectAllRequest) {
	        List<LeaveRequest> rejectedLeaveRequests = adminService.rejectMultipleLeaveRequests(rejectAllRequest.getIds(), rejectAllRequest.getReasonForRejection());
	        return ResponseEntity.ok(rejectedLeaveRequests);
	    }
	    
	

}
