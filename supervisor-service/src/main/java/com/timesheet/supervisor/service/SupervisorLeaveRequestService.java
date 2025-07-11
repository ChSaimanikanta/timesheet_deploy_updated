package com.timesheet.supervisor.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timesheet.supervisor.entity.LeaveRequest;
import com.timesheet.supervisor.repo.LeaveRequestRepository;




@Service
public class SupervisorLeaveRequestService {
    
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

    public List<LeaveRequest> getLeaveRequestsBySupervisorId(String supervisorId) {
        return leaveRequestRepository.findBySupervisorId(supervisorId);
    }

    
    public LeaveRequest approveLeaveRequest(Long id, String adminId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        
        leaveRequest.setStatus("APPROVED");
        leaveRequest.setApprovedBy(adminId);
        leaveRequest.setRejectedBy(null);  // Clear rejectedBy if previously set

        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest rejectLeaveRequest(Long id, String adminId, String reasonForRejection) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        
        leaveRequest.setStatus("REJECTED");
        leaveRequest.setRejectedBy(adminId);
        leaveRequest.setApprovedBy(null);  // Clear approvedBy if previously set
        leaveRequest.setReasonForRejection(reasonForRejection);

        return leaveRequestRepository.save(leaveRequest);
    }
    
    
    
    
    
    public List<LeaveRequest> approveMultipleLeaveRequests(List<Long> leaveRequestIds, String adminId) {
        List<LeaveRequest> approvedRequests = new ArrayList<>();

        // Iterate over each leave request ID in the list
        for (Long id : leaveRequestIds) {
            // Fetch the leave request from the repository by ID
            LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Leave request not found for id: " + id));
            
            // Update the leave request status and admin details
            leaveRequest.setStatus("APPROVED");
            leaveRequest.setApprovedBy(adminId);
            leaveRequest.setRejectedBy(null); // Clear rejectedBy if it was previously set

            // Save the updated leave request and add it to the approvedRequests list
            approvedRequests.add(leaveRequestRepository.save(leaveRequest));
        }

        // Return the list of approved leave requests
        return approvedRequests;
    }
    
    
    
    public List<LeaveRequest> rejectMultipleLeaveRequests(List<Long> leaveRequestIds, String adminId, String rejectionReason) {
        List<LeaveRequest> rejectedRequests = new ArrayList<>();

        // Iterate over each leave request ID in the list
        for (Long id : leaveRequestIds) {
            // Fetch the leave request from the repository by ID
            LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Leave request not found for id: " + id));

            // Update the leave request status, admin details, and rejection reason
            leaveRequest.setStatus("REJECTED");
            leaveRequest.setRejectedBy(adminId);
            leaveRequest.setReasonForRejection(rejectionReason);
            leaveRequest.setApprovedBy(null); // Clear approvedBy if it was previously set

            // Save the updated leave request and add it to the rejectedRequests list
            rejectedRequests.add(leaveRequestRepository.save(leaveRequest));
        }

        // Return the list of rejected leave requests
        return rejectedRequests;
    }
    
    
    
    public void deleteLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found for id: " + id));
        leaveRequestRepository.delete(leaveRequest);
    }
    
    
    
    
    
    
}
