package com.timesheet.admin.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.admin.entity.LeaveRequest;
import com.timesheet.admin.exceptions.ResourceNotFoundException;
import com.timesheet.admin.repo.LeaveRequestRepository;
import com.timesheet.admin.service.LeaveRequestService;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/leave-requests")
    public LeaveRequest createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        leaveRequest.setStatus("PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    @PutMapping("/leave-requests/{id}")
    public LeaveRequest updateLeaveRequest(@PathVariable Long id, @RequestBody LeaveRequest leaveRequestDetails) { 
    	LeaveRequest leaveRequest = leaveRequestRepository.findById(id) .orElseThrow();
    	leaveRequest.setStartDate(leaveRequestDetails.getStartDate()); 
    	leaveRequest.setEndDate(leaveRequestDetails.getEndDate());
    	leaveRequest.setNoOfDays(leaveRequestDetails.getNoOfDays());
    	leaveRequest.setReason(leaveRequestDetails.getReason()); 
    	leaveRequest.setComments(leaveRequestDetails.getComments());
    	leaveRequest.setStatus(leaveRequestDetails.getStatus()); 
    	leaveRequest.setReasonForRejection(leaveRequestDetails.getReasonForRejection());
    	return leaveRequestRepository.save(leaveRequest); 
    }

    @GetMapping("/leave-requests")
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }
    
    @GetMapping("/leave-requests/{id}")
    public LeaveRequest getLeaveRequestById(@PathVariable Long id) {
    	return leaveRequestRepository.findById(id).orElseThrow(); 
    }
    
    @DeleteMapping("/leave-requests/{id}")
    public ResponseEntity<Void> deleteLeaveRequestById(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequestById(id);
        return ResponseEntity.noContent().build();
    }
}
