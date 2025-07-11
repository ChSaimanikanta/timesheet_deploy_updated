package com.timesheet.admin.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.admin.client.SupervisorClient;
import com.timesheet.admin.entity.EmployeeWorkingHours;
import com.timesheet.admin.entity.LeaveRequest;
import com.timesheet.admin.entity.ListRequest;
import com.timesheet.admin.entity.ProjectWorkingHours;
import com.timesheet.admin.entity.RejectAllRequest;
import com.timesheet.admin.entity.RejectReasonRequest;
import com.timesheet.admin.entity.WorkingHour;
import com.timesheet.admin.service.AdminService;
import com.timesheet.admin.service.RejectLeaveRequestRequest;
import com.timesheet.admin.service.WorkingHourService;



//-----------------  Supervisor Leaverequest & working hours  ---------------------


@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    
    @Autowired
    private SupervisorClient supervisorClient;

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return supervisorClient.getAllLeaveRequests();
    }

    @PutMapping("/{id}/approve")
    public LeaveRequest approveLeaveRequest(@PathVariable Long id) {
        LeaveRequest leaveRequest = supervisorClient.getLeaveRequestById(id);
        leaveRequest.setStatus("APPROVED");
        return supervisorClient.updateLeaveRequest(id, leaveRequest);
    }

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
    
    
    
    
    
    
    
  
    
    
    
  //------------ SUPERVISOR APPROVAL TIMESHEET ----------------------//	
    
    
    
    
    @GetMapping("/working-hours/{employeeId}/range")
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(@PathVariable String employeeId,
                                                                     @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                     @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return supervisorClient.getWorkingHoursByEmployeeIdAndDateRange(employeeId, startDate, endDate);
    }

    @PutMapping("/working-hours/approve/{id}")
    public WorkingHour approveWorkingHour(@PathVariable Long id) {
        return supervisorClient.approveWorkingHour(id);
    }

    @PutMapping("/working-hours/reject/{id}")
    public WorkingHour rejectWorkingHour(@PathVariable Long id, @RequestParam String reason) {
        return supervisorClient.rejectWorkingHour(id,reason);
    }


    @PutMapping("/working-hours/update")
    public List<WorkingHour> updateWorkingHours(@RequestBody List<WorkingHour> workingHours) {
        return supervisorClient.updateWorkingHours(workingHours);
    }


    @PutMapping("/working-hours/{employeeId}/approve-range")
    public List<WorkingHour> approveWorkingHoursInRange(@PathVariable String employeeId,
                                                        @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return supervisorClient.approveWorkingHoursInRange(employeeId, startDate, endDate);
    }

    @PutMapping("/working-hours/{employeeId}/reject-range")
    public List<WorkingHour> rejectWorkingHoursInRange(@PathVariable String employeeId,
                                                       @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                       @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                       @RequestParam String reason) {
    	
        return supervisorClient.rejectWorkingHoursInRange(employeeId, startDate, endDate,reason);
    }


    @DeleteMapping("/working-hours/{employeeId}/delete-range")
    public void deleteWorkingHoursInRange(@PathVariable String employeeId,
                                          @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                          @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
    	supervisorClient.deleteWorkingHoursInRange(employeeId, startDate, endDate);
    }

    @GetMapping("/working-hours/{employeeId}/projects")
    public List<ProjectWorkingHours> getProjectWorkingHoursByEmployeeId(@PathVariable String employeeId) {
        return supervisorClient.getProjectWorkingHoursByEmployeeId(employeeId);
    }
    

    
    
  @GetMapping("/all/range")
  public ResponseEntity<Map<String, List<WorkingHour>>> getAllEmployeesWorkHoursInRange(
          @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
          @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

      // Call the Feign client to get the working hours for all employees within the date range
      ResponseEntity<Map<String, List<WorkingHour>>> workingHoursMapResponse = supervisorClient.getAllEmployeesWorkHoursInRange(startDate, endDate);

      // Check if the response from the Feign client is successful
      if (workingHoursMapResponse.getStatusCode().is2xxSuccessful()) {
          // Return the response body directly
          return ResponseEntity.ok(workingHoursMapResponse.getBody());
      } else {
          // Return an error response if the Feign client call failed
          return ResponseEntity.status(workingHoursMapResponse.getStatusCode()).build();
      }
  }  
  
  
  
  @Autowired
  private WorkingHourService workingHourService;
  
  
  @GetMapping("/new")
  public ResponseEntity<Map<String, EmployeeWorkingHours>> getAllNewEmployeeWorkingHours() {
      Map<String, EmployeeWorkingHours> newEmployeeWorkHours = workingHourService.getAllNewEmployeeWorkingHours();
      return ResponseEntity.ok(newEmployeeWorkHours);
  }
  
  
  
}
