package com.timesheet.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.employee.entity.LeaveRequest;
import com.timesheet.employee.exception.ResourceNotFoundException;
import com.timesheet.employee.repo.LeaveRequestRepository;



@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/leave-requests")
public class LeaveRequestController {

	
	@Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @PostMapping
    public LeaveRequest createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        leaveRequest.setStatus("PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    @PutMapping("/{id}")
    public LeaveRequest updateLeaveRequest(@PathVariable Long id, @RequestBody LeaveRequest leaveRequestDetails) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow();
        
        leaveRequest.setStartDate(leaveRequestDetails.getStartDate());
        leaveRequest.setEndDate(leaveRequestDetails.getEndDate());
        leaveRequest.setNoOfDays(leaveRequestDetails.getNoOfDays());
        leaveRequest.setReason(leaveRequestDetails.getReason());
        leaveRequest.setComments(leaveRequestDetails.getComments());
        leaveRequest.setStatus(leaveRequestDetails.getStatus());
        leaveRequest.setReasonForRejection(leaveRequestDetails.getReasonForRejection());
        
        return leaveRequestRepository.save(leaveRequest);
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }
	
    
    @GetMapping("/{id}")
    public LeaveRequest getLeaveRequestById(@PathVariable Long id) {
        return leaveRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest not found for this id :: " + id));
    }
	
}
