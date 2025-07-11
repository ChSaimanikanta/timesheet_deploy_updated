package com.leave.request.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.leave.request.Service.LeaveRequestService;
import com.leave.request.client.AdminProjectClient;
import com.leave.request.client.ProjectServiceClient;
import com.leave.request.entity.ApproveLeaveRequestDTO;
import com.leave.request.entity.EmployeeResponse;
import com.leave.request.entity.LeaveRequest;
import com.leave.request.entity.RejectLeaveRequestDTO;
import com.leave.request.entity.SupervisorResponse;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/leaverequests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        LeaveRequest created = leaveRequestService.createLeaveRequest(leaveRequest);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public LeaveRequest updateLeaveRequest(@PathVariable Long id, @RequestBody LeaveRequest leaveRequest) {
        return leaveRequestService.updateLeaveRequest(id, leaveRequest);
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.getAllLeaveRequests();
    }

    @GetMapping("/{id}")
    public LeaveRequest getLeaveRequestById(@PathVariable Long id) {
        return leaveRequestService.getLeaveRequestById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelLeaveRequest(@PathVariable Long id) {
    	leaveRequestService.cancelPendingLeaveRequest(id); // This now throws ResponseStatusException
        return ResponseEntity.ok("Leave request cancelled successfully.");
    }




    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getLeaveRequestsByEmpId(@PathVariable String employeeId) {
        return leaveRequestService.getLeaveRequestsByEmpId(employeeId);
    }

    @GetMapping("/supervisor/{supervisorId}")
    public List<LeaveRequest> getLeaveRequestsBySupervisorId(@PathVariable String supervisorId) {
        return leaveRequestService.getLeaveRequestsBySupervisorId(supervisorId);
    }

    @PostMapping("/approve/{id}")
    public LeaveRequest approveLeaveRequest(@PathVariable Long id, @RequestParam String supervisorId) {
        return leaveRequestService.approveLeaveRequest(id, supervisorId);
    }

    @PostMapping("/reject/{id}")
    public LeaveRequest rejectLeaveRequest(@PathVariable Long id, @RequestParam String supervisorId,
                                           @RequestParam String reason) {
        return leaveRequestService.rejectLeaveRequest(id, supervisorId, reason);
    }
    
    
    @PostMapping("/approve-multiple")
    public ResponseEntity<List<LeaveRequest>> approveMultipleLeaveRequests(
            @RequestBody ApproveLeaveRequestDTO dto) {

        List<LeaveRequest> approvedLeaveRequests = leaveRequestService.approveMultipleLeaveRequests(dto.getLeaveRequestIds(), dto.getSupervisorId());
        return ResponseEntity.ok(approvedLeaveRequests);
    }
       
    
    @PostMapping("/reject-multiple")
    public ResponseEntity<List<LeaveRequest>> rejectMultipleLeaveRequests(
            @RequestBody RejectLeaveRequestDTO dto) {

        List<LeaveRequest> rejectedLeaveRequests = leaveRequestService.rejectMultipleLeaveRequests(dto.getLeaveRequestIds(), dto.getReason(), dto.getSupervisorId());
        return ResponseEntity.ok(rejectedLeaveRequests);
    }
    
}


	