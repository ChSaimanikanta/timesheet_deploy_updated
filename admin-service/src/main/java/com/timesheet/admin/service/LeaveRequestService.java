package com.timesheet.admin.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timesheet.admin.entity.LeaveRequest;
import com.timesheet.admin.repo.LeaveRequestRepository;








//------------------  Admin Leave request creation  -------------------------


@Service
public class LeaveRequestService {

	@Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        if (leaveRequest.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date must be today or in the future.");
        }
        leaveRequest.setStatus("PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest updateLeaveRequest(Long id, LeaveRequest leaveRequest) {
        Optional<LeaveRequest> existingRequest = leaveRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            LeaveRequest request = existingRequest.get();
            if (request.getStartDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Cannot update a leave request with a past start date.");
            }
            request.setStartDate(leaveRequest.getStartDate());
            request.setEndDate(leaveRequest.getEndDate());
            request.setNoOfDays(leaveRequest.getNoOfDays());
            request.setReason(leaveRequest.getReason());
            request.setComments(leaveRequest.getComments());
            return leaveRequestRepository.save(request);
        } else {
            throw new IllegalArgumentException("Leave request not found.");
        }
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }
	
    
    public void deleteLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found for id: " + id));
        leaveRequestRepository.delete(leaveRequest);
    }
    
    
	
}
