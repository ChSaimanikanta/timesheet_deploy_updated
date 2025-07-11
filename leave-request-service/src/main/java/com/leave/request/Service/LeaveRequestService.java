package com.leave.request.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.leave.request.client.ProjectServiceClient;
import com.leave.request.entity.LeaveRequest;
import com.leave.request.entity.ProjectResponse;
import com.leave.request.repo.LeaveRequestRepository;

import feign.FeignException;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private ProjectServiceClient projectServiceClient;

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        if (leaveRequest.getStartDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date must be today or in the future.");
        }

        List<ProjectResponse> projects;
        try {
            projects = projectServiceClient.getProjectsByEmployeeId(leaveRequest.getEmployeeId());

            if (projects.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, 
                    "Employee is not assigned to any projects. Please contact the admin.");
            }

        } catch (FeignException.InternalServerError e) {
            // Improve error clarity by inspecting root cause if possible
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                "Your EmployeeId is not mapped to any project. Cannot proceed with leave request.");
        } catch (FeignException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "Project service responded with an unexpected error.");
        }

        String projectId = projects.get(0).getProjectId();
        List<String> supervisors = projectServiceClient.getSupervisorsForProject(projectId);

        leaveRequest.setProjectId(projectId);
        leaveRequest.setSupervisors(supervisors);
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
            request.setStatus(leaveRequest.getStatus());
            request.setApprovedBy(leaveRequest.getApprovedBy());
            request.setRejectedBy(leaveRequest.getRejectedBy());
            request.setReasonForRejection(leaveRequest.getReasonForRejection());
            return leaveRequestRepository.save(request);
        } else {
            throw new IllegalArgumentException("Leave request not found.");
        }
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
    }

    public void cancelPendingLeaveRequest(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Leave request not found."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only pending leave requests can be cancelled.");
        }

        leaveRequestRepository.deleteById(id);
    }



    public List<LeaveRequest> getLeaveRequestsByEmpId(String employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

//    public List<LeaveRequest> getLeaveRequestsBySupervisorId(String supervisorId) {
//        return leaveRequestRepository.findBySupervisorsContaining(supervisorId);
//    }
    
    public List<LeaveRequest> getLeaveRequestsBySupervisorId(String supervisorId) {
        // Fetch all leave requests from the repository
        List<LeaveRequest> allLeaveRequests = leaveRequestRepository.findAll();
        
        // Filter the leave requests where the supervisor is responsible for the employee
        return allLeaveRequests.stream()
                .filter(leaveRequest -> projectServiceClient.isSupervisorForEmployee(supervisorId, leaveRequest.getEmployeeId()))
                .collect(Collectors.toList());
    }
    

    public LeaveRequest approveLeaveRequest(Long id, String supervisorId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        if (!projectServiceClient.isSupervisorForEmployee(supervisorId, leaveRequest.getEmployeeId())) {
            throw new IllegalArgumentException("Supervisor not authorized to approve this leave request.");
        }
        leaveRequest.setStatus("APPROVED");
        leaveRequest.setApprovedBy(supervisorId);
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest rejectLeaveRequest(Long id, String supervisorId, String reason) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        if (!projectServiceClient.isSupervisorForEmployee(supervisorId, leaveRequest.getEmployeeId())) {
            throw new IllegalArgumentException("Supervisor not authorized to reject this leave request.");
        }
        leaveRequest.setStatus("REJECTED");
        leaveRequest.setRejectedBy(supervisorId);
        leaveRequest.setReasonForRejection(reason);
        return leaveRequestRepository.save(leaveRequest);
    }
    
    
    
    // Approve multiple leave requests
    public List<LeaveRequest> approveMultipleLeaveRequests(List<Long> leaveRequestIds, String supervisorId) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAllById(leaveRequestIds);

        // Filter leave requests that the supervisor is authorized to approve
        List<LeaveRequest> authorizedRequests = leaveRequests.stream()
            .filter(request -> projectServiceClient.isSupervisorForEmployee(supervisorId, request.getEmployeeId()))
            .collect(Collectors.toList());

        // Update the status of each leave request
        for (LeaveRequest request : authorizedRequests) {
            request.setStatus("APPROVED");
            request.setApprovedBy(supervisorId);
        }

        // Save all updated leave requests in batch
        return leaveRequestRepository.saveAll(authorizedRequests);
    }
    
    
    // Reject multiple leave requests
    public List<LeaveRequest> rejectMultipleLeaveRequests(List<Long> leaveRequestIds, String reason, String supervisorId) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAllById(leaveRequestIds);

        // Filter leave requests that the supervisor is authorized to reject
        List<LeaveRequest> authorizedRequests = leaveRequests.stream()
            .filter(request -> projectServiceClient.isSupervisorForEmployee(supervisorId, request.getEmployeeId()))
            .collect(Collectors.toList());

        // Update the status and rejection reason of each leave request
        for (LeaveRequest request : authorizedRequests) {
            request.setStatus("REJECTED");
            request.setReasonForRejection(reason);
            request.setRejectedBy(supervisorId);
        }

        // Save all updated leave requests in batch
        return leaveRequestRepository.saveAll(authorizedRequests);
    }
    

    
}


