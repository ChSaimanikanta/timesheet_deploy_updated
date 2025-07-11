package com.timesheetcreation.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.timesheetcreation.entity.WorkingHour;
import com.timesheetcreation.service.WorkingHourService;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/workinghours")
public class WorkingHourController {

    @Autowired
    private WorkingHourService workingHourService;

    // Create or Update a WorkingHour
    @PostMapping
    public List<WorkingHour> createOrUpdateWorkingHours(@RequestBody List<WorkingHour> workingHours) {
        return workingHours.stream()
            .map(workingHourService::saveOrUpdateWorkingHour)
            .collect(Collectors.toList());
    }


    // Create or Update multiple WorkingHours
    @PostMapping("/bulk")
    public List<WorkingHour> createOrUpdateMultipleWorkingHours(@RequestBody List<WorkingHour> workingHours) {
        return workingHourService.saveMultipleWorkingHours(workingHours);
    }

    // Get WorkingHours by Employee ID and Date Range
    @GetMapping("/employee/{employeeId}/range")
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(
            @PathVariable String employeeId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return workingHourService.getWorkingHoursByEmployeeIdAndDateRange(employeeId, startDate, endDate);
    }

    // Get a WorkingHour by ID
    @GetMapping("/{id}")
    public WorkingHour getWorkingHourById(@PathVariable Long id) {
        return workingHourService.getWorkingHourById(id)
                .orElseThrow(() -> new RuntimeException("WorkingHour not found"));
    }

    // Get all WorkingHours within a Date Range
    @GetMapping("/range")
    public List<WorkingHour> getAllWorkingHoursWithinDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return workingHourService.getAllWorkingHoursWithinDateRange(startDate, endDate);
    }

    // Get WorkingHours by Employee ID and Status "NEW"
    @GetMapping("/employee/{employeeId}/new")
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndStatusNew(@PathVariable String employeeId) {
        return workingHourService.getWorkingHoursByEmployeeIdAndStatusNew(employeeId);
    }

    // Approve or Reject a WorkingHour by ID
    @PutMapping("/{id}/approval")
    public WorkingHour approveOrRejectWorkingHourById(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason,
            @RequestParam String employeeId,
            @RequestParam String projectId) {
        return workingHourService.approveOrRejectWorkingHourById(id, status, rejectionReason, employeeId, projectId);
    }

    // Approve or Reject WorkingHours by Employee ID and Date Range
    @PutMapping("/employee/{employeeId}/range/approval")
    public List<WorkingHour> approveOrRejectWorkingHoursByEmployeeIdAndDateRange(
            @PathVariable String employeeId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason,
            @RequestParam String projectId) {
        return workingHourService.approveOrRejectWorkingHoursByEmployeeIdAndDateRange(
                employeeId, startDate, endDate, status, rejectionReason, projectId);
    }

    // Approve or Reject WorkHours by Supervisor
    @PutMapping("/supervisor/{supervisorId}/approval")
    public List<WorkingHour> approveOrRejectWorkHoursBySupervisor(
            @PathVariable String supervisorId,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason) {
        return workingHourService.approveOrRejectWorkHoursBySupervisor(supervisorId, status, rejectionReason);
    }

    // Approve or Reject WorkHours for an Employee under a Supervisor
    @PutMapping("/supervisor/{supervisorId}/employee/{employeeId}/approval")
    public List<WorkingHour> approveOrRejectWorkHoursForEmployee(
            @PathVariable String supervisorId,
            @PathVariable String employeeId,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason) {
        return workingHourService.approveOrRejectWorkHoursForEmployee(supervisorId, employeeId, status, rejectionReason);
    }

    // Get WorkingHours for Employees under a Supervisor by Supervisor ID
    @GetMapping("/supervisor/{supervisorId}/range")
    public List<WorkingHour> getWorkingHoursBySupervisorIdAndDateRange(
            @PathVariable String supervisorId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return workingHourService.getWorkingHoursBySupervisorIdAndDateRange(supervisorId, startDate, endDate);
    }
    
    
    
 // Get WorkingHours for Employees under a Supervisor by Supervisor ID
    @GetMapping("/supervisor/{supervisorId}")
    public List<WorkingHour> getWorkingHoursBySupervisorId(@PathVariable String supervisorId) {
        return workingHourService.getWorkingHoursBySupervisorId(supervisorId);
    }
    
    

    
    
// // Get WorkingHours for Employees under a Supervisor by Supervisor ID and Date Range
//    @GetMapping("employees/supervisor/{supervisorId}/range")
//    public List<WorkingHour> getWorkingHoursEmpBySupervisorIdAndDateRange(
//            @PathVariable String supervisorId,
//            @RequestParam LocalDate startDate,
//            @RequestParam LocalDate endDate) {
//        return workingHourService.getWorkingHoursEmpBySupervisorIdAndDateRange(supervisorId, startDate, endDate);
//    }
    
 // Get WorkingHours for Employees under a Supervisor by Supervisor ID and Date Range
    @GetMapping("emp/supervisor/{supervisorId}/range")
    public List<WorkingHour> getWorkingHoursEmpBySupervisorIdAndDateRange(
            @PathVariable String supervisorId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return workingHourService.getWorkingHoursByEmpSupervisorIdAndDateRange(supervisorId, startDate, endDate);
    }
    
    

    // Update WorkingHours by ID
    @PutMapping("/{id}")
    public WorkingHour updateWorkingHour(
            @PathVariable Long id,
            @RequestBody WorkingHour updatedWorkingHour) {
        return workingHourService.updateWorkingHour(id, updatedWorkingHour);
    }
    
    
    
//    // Get WorkingHours with status "NEW" for Employees under a Supervisor by Supervisor ID
//    @GetMapping("/supervisor/{supervisorId}/new")
//    public List<WorkingHour> getNewWorkingHoursBySupervisorId(
//            @PathVariable String supervisorId) {
//        return workingHourService.getNewWorkingHoursBySupervisorId(supervisorId);
//    }
    
    
    // Get WorkingHours with status "NEW" for Employees under a Supervisor by Supervisor ID
    @GetMapping("/supervisor/{supervisorId}/new")
    public ResponseEntity<Map<String, Object>> getNewWorkingHoursBySupervisorId(
            @PathVariable String supervisorId) {
        Map<String, Object> response = workingHourService.getFormattedWorkingHoursBySupervisorId(supervisorId);
        return ResponseEntity.ok(response);
    }
    
    
    
    
 // Delete Working Hour by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployeeWorkingHoursById(@PathVariable Long id) {
        workingHourService.deleteEmployeeWorkingHoursById(id);
        return ResponseEntity.ok("Working hour with ID " + id + " has been deleted.");
    }

    // Delete all Working Hours within a date range
    @DeleteMapping("/range")
    public ResponseEntity<String> deleteAllEmployeeWorkingHoursUsingDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        workingHourService.deleteAllEmployeeWorkingHoursUsingDateRange(startDate, endDate);
        return ResponseEntity.ok("All working hours between " + startDate + " and " + endDate + " have been deleted.");
    }

    // Delete Working Hours by Employee ID and Date Range
    @DeleteMapping("/employee/{employeeId}/range")
    public ResponseEntity<String> deleteEmployeeWorkingHoursUsingEmployeeIdAndDateRange(
            @PathVariable String employeeId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        workingHourService.deleteEmployeeWorkingHoursUsingEmployeeIdAndDateRange(employeeId, startDate, endDate);
        return ResponseEntity.ok("All working hours for employee " + employeeId + " between " + startDate + " and " + endDate + " have been deleted.");
    }
    
    
    
 // Endpoint to update work hours based on Employee ID and Date Range
    @PutMapping("/update")
    public ResponseEntity<List<WorkingHour>> updateWorkHoursUsingEmployeeIdAndDateRange(
            @RequestBody List<WorkingHour> workingHours) {
        List<WorkingHour> updatedHours = workingHourService.updateWorkHoursUsingEmployeeIdAndDateRange(workingHours);
        return new ResponseEntity<>(updatedHours, HttpStatus.OK);
    }
    
    
    
    
    // Get working hours by Employee ID and Supervisor ID within a date range
    @GetMapping("/employee/{employeeId}/supervisor/{supervisorId}/daterange")
    public ResponseEntity<List<WorkingHour>> getWorkingHoursByEmployeeIdAndSupervisorIdWithinDateRange(
            @PathVariable String employeeId,
            @PathVariable String supervisorId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<WorkingHour> workingHours = workingHourService.getWorkingHoursByEmployeeIdAndSupervisorIdWithinDateRange(employeeId, supervisorId, startDate, endDate);
        return new ResponseEntity<>(workingHours, HttpStatus.OK);
    }

    // Get working hours by Employee ID and Supervisor ID within a date range and status "NEW"
    @GetMapping("/employee/{employeeId}/supervisor/{supervisorId}/daterange/new")
    public ResponseEntity<List<WorkingHour>> getWorkingHoursByEmployeeIdAndSupervisorIdWithinDateRangeWithStatusNew(
            @PathVariable String employeeId,
            @PathVariable String supervisorId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<WorkingHour> workingHours = workingHourService.getWorkingHoursByEmployeeIdAndSupervisorIdWithinDateRangeWithStatusNew(employeeId, supervisorId, startDate, endDate);
        return new ResponseEntity<>(workingHours, HttpStatus.OK);
    }
    
    
}
