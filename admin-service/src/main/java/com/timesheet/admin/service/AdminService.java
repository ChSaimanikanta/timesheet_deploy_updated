package com.timesheet.admin.service;

import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timesheet.admin.client.SupervisorClient;
import com.timesheet.admin.entity.LeaveRequest;



//-------------------------  Supervisor leave request approval/rejection --------------------------


@Service
public class AdminService {
    @Autowired
    private SupervisorClient supervisorServiceClient;

    public List<LeaveRequest> getAllLeaveRequests() {
        return supervisorServiceClient.getAllLeaveRequests();
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = supervisorServiceClient.getAllLeaveRequests().stream()
                .filter(request -> request.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        leaveRequest.setStatus("APPROVED");
        return supervisorServiceClient.updateLeaveRequest(id, leaveRequest);
    }

    public LeaveRequest rejectLeaveRequest(Long id, String reasonforRejection) {
        LeaveRequest leaveRequest = supervisorServiceClient.getAllLeaveRequests().stream()
                .filter(request -> request.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        leaveRequest.setStatus("REJECTED");
        leaveRequest.setReasonForRejection(reasonforRejection);
        return supervisorServiceClient.updateLeaveRequest(id, leaveRequest);
    }
    
    
    public List<LeaveRequest> approveMultipleLeaveRequests(List<Long> ids) {
        List<LeaveRequest> leaveRequests = supervisorServiceClient.getAllLeaveRequests();
        List<LeaveRequest> approvedRequests = new ArrayList<>();
        
        for (Long id : ids) {
            LeaveRequest leaveRequest = leaveRequests.stream()
                    .filter(request -> request.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Leave Request ID: " + id));
            leaveRequest.setStatus("APPROVED");
            approvedRequests.add(supervisorServiceClient.updateLeaveRequest(id, leaveRequest));
        }
        
        return approvedRequests;
    }

    public List<LeaveRequest> rejectMultipleLeaveRequests(List<Long> ids, String reasonForRejection) {
        List<LeaveRequest> leaveRequests = supervisorServiceClient.getAllLeaveRequests();
        List<LeaveRequest> rejectedRequests = new ArrayList<>();
        
        for (Long id : ids) {
            LeaveRequest leaveRequest = leaveRequests.stream()
                    .filter(request -> request.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Leave Request ID: " + id));
            leaveRequest.setStatus("REJECTED");
            leaveRequest.setReasonForRejection(reasonForRejection);
            rejectedRequests.add(supervisorServiceClient.updateLeaveRequest(id, leaveRequest));
        }
        
        return rejectedRequests;
    }

}
