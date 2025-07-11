package com.timesheet.supervisor.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.supervisor.entity.LeaveRequest;
import com.timesheet.supervisor.entity.LeaveRequestApprovalDTO;
import com.timesheet.supervisor.entity.LeaveRequestRejectionDTO;
import com.timesheet.supervisor.exceptions.ResourceNotFoundException;
import com.timesheet.supervisor.repo.LeaveRequestRepository;
import com.timesheet.supervisor.service.SupervisorLeaveRequestService;





@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/supervisor")
public class SupervisorLeaveRequestController {

	
	 @Autowired
	    private LeaveRequestRepository leaveRequestRepository;

	    @Autowired
	    private SupervisorLeaveRequestService leaveRequestService;

	    @PostMapping("/leave-requests")
	    public LeaveRequest createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
	        leaveRequest.setStatus("PENDING");
	        return leaveRequestService.createLeaveRequest(leaveRequest);
	    }

	    @PutMapping("/leave-requests/{id}")
	    public LeaveRequest updateLeaveRequest(@PathVariable Long id, @RequestBody LeaveRequest leaveRequestDetails) {
	        return leaveRequestService.updateLeaveRequest(id, leaveRequestDetails);
	    }

	    @GetMapping("/leave-requests")
	    public List<LeaveRequest> getAllLeaveRequests() {
	        return leaveRequestService.getAllLeaveRequests();
	    }

	    @GetMapping("/leave-requests/{supervisorId}")
	    public List<LeaveRequest> getLeaveRequestsBySupervisorId(@PathVariable String supervisorId) {
	        return leaveRequestService.getLeaveRequestsBySupervisorId(supervisorId);
	    }

	    
//	    @GetMapping("/leave-requests/{id}")
//	    public LeaveRequest getLeaveRequestById(@PathVariable Long id) {
//	        return leaveRequestRepository.findById(id)
//	            .orElseThrow(() -> new IllegalArgumentException("LeaveRequest not found for this id :: " + id));
//	    }

	    @PutMapping("/leave-requests/{id}/approve")
	    public LeaveRequest approveLeaveRequest(@PathVariable Long id, @RequestParam String adminId) {
	        return leaveRequestService.approveLeaveRequest(id, adminId);
	    }

	    @PutMapping("/leave-requests/{id}/reject")
	    public LeaveRequest rejectLeaveRequest(@PathVariable Long id, @RequestParam String adminId, @RequestParam String reasonForRejection) {
	        return leaveRequestService.rejectLeaveRequest(id, adminId, reasonForRejection);
	    }
	
	    
	    @PutMapping("/leave-requests/leave-requests/approve-multiple")
	    public ResponseEntity<List<LeaveRequest>> approveMultipleLeaveRequests(@RequestBody LeaveRequestApprovalDTO request, @RequestParam String adminId) {
	        List<LeaveRequest> approvedRequests = leaveRequestService.approveMultipleLeaveRequests(request.getLeaveRequestIds(), adminId);
	        return ResponseEntity.ok(approvedRequests);
	    }
	    
	    
	    
	    @PutMapping("/leave-requests/leave-requests/reject-multiple")
	    public ResponseEntity<List<LeaveRequest>> rejectMultipleLeaveRequests(
	        @RequestBody LeaveRequestRejectionDTO request, 
	        @RequestParam String adminId) {

	        List<LeaveRequest> rejectedRequests = leaveRequestService.rejectMultipleLeaveRequests(
	            request.getLeaveRequestIds(), 
	            adminId, 
	            request.getRejectionReason()
	        );

	        return ResponseEntity.ok(rejectedRequests);
	    }
	    
	    
	    
	    @DeleteMapping("/leave-requests/{id}")
	    public ResponseEntity<Void> deleteLeaveRequestById(@PathVariable Long id) {
	        leaveRequestService.deleteLeaveRequestById(id);
	        return ResponseEntity.noContent().build(); // Responds with 204 No Content
	    }
	    
	    
	    
	    
}
