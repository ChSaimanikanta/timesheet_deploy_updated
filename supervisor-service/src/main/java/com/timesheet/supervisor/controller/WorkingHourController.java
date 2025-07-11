package com.timesheet.supervisor.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.timesheet.supervisor.entity.EmployeeWorkingHours;
import com.timesheet.supervisor.entity.ProjectWorkingHours;
import com.timesheet.supervisor.entity.WorkingHour;
import com.timesheet.supervisor.service.WorkingHourService;




@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/sup")
public class WorkingHourController {

	    @Autowired
	    private WorkingHourService workingHourService;

	    @PostMapping("/api/working-hours")
	    public List<WorkingHour> saveWorkingHours(@RequestBody List<WorkingHour> workingHours) {
	        return workingHourService.saveWorkingHours(workingHours);
	    }

	    @GetMapping("/api/working-hours/{employeeId}")
	    public List<WorkingHour> getWorkingHoursByEmployeeId(@PathVariable String employeeId) {
	        return workingHourService.getWorkingHoursByEmployeeId(employeeId);
	    }

	    @GetMapping("/api/working-hours/{employeeId}/range")
	    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.getWorkingHoursByEmployeeIdAndDateRange(employeeId, startDate, endDate);
	    }


	    
	    
	    @PutMapping("/api/working-hours/approve/{id}")
	    public WorkingHour approveWorkingHour(@PathVariable Long id, @RequestParam String adminId) {
	        return workingHourService.approveWorkingHour(id, adminId);
	    }

	    @PutMapping("/api/working-hours/reject/{id}")
	    public WorkingHour rejectWorkingHour(@PathVariable Long id, @RequestParam String reason, @RequestParam String adminId) {
	        return workingHourService.rejectWorkingHour(id, reason, adminId);
	    }
	    
	    
	    

	    @PutMapping("/api/working-hours/update")
	    public List<WorkingHour> updateWorkingHours(@RequestBody List<WorkingHour> workingHours) {
	        System.out.println("Received Update Request: " + workingHours);
	        return workingHourService.updateWorkingHours(workingHours);
	    }



	    
	    
	    
	    // Approve working hours in range
	    @PutMapping("/api/working-hours/{employeeId}/approve-range")
	    public List<WorkingHour> approveWorkingHoursInRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
	            @RequestParam("adminId") String adminId) { // Include adminId
	        return workingHourService.approveWorkingHoursInRange(employeeId, startDate, endDate, adminId);
	    }

	    // Reject working hours in range
	    @PutMapping("/api/working-hours/{employeeId}/reject-range")
	    public List<WorkingHour> rejectWorkingHoursInRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
	            @RequestParam("reason") String reason,
	            @RequestParam("adminId") String adminId) { // Include adminId
	        return workingHourService.rejectWorkingHoursInRange(employeeId, startDate, endDate, reason, adminId);
	    }

	    
	    

	    @DeleteMapping("/api/working-hours/{employeeId}/delete-range")
	    public void deleteWorkingHoursInRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        workingHourService.deleteWorkingHoursInRange(employeeId, startDate, endDate);
	    }
 	    
	    @GetMapping("/api/working-hours/{employeeId}/projects")
	    public List<ProjectWorkingHours> getProjectWorkingHoursByEmployeeId(@PathVariable String employeeId) {
	        return workingHourService.getProjectWorkingHoursByEmployeeId(employeeId);
	    }


	    
	    
	    @GetMapping("/api/working-hours/range")
	    public List<WorkingHour> getEmployeeWorkHoursInRange(
	            @RequestParam("employeeId") String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.getEmployeeWorkHoursInRange(employeeId, startDate, endDate);
	    }

	    // Endpoint to get work hours for multiple employees within a date range
	    @GetMapping("/api/working-hours/multiple/range")
	    public Map<String, List<WorkingHour>> getMultipleEmployeesWorkHoursInRange(
	            @RequestParam("employeeIds") List<String> employeeIds,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.getMultipleEmployeesWorkHoursInRange(employeeIds, startDate, endDate);
	    }
	    
	    
	    
	    
//	      Get all the employee workhours in Range
	    @GetMapping("/api/working-hours/all/range")
	    public ResponseEntity<Map<String, List<WorkingHour>>> getAllEmployeesWorkHoursInRange(
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        
	        Map<String, List<WorkingHour>> workHoursMap = workingHourService.getAllEmployeesWorkHoursInRange(startDate, endDate);
	        return ResponseEntity.ok(workHoursMap);
	    }
	    
	    
	    @GetMapping("/api/working-hours/all/new")
	    public ResponseEntity<Map<String, EmployeeWorkingHours>> getAllNewEmployeesWorkHours() {
	        Map<String, EmployeeWorkingHours> workHoursMap = workingHourService.getAllNewEmployeesWorkHours();
	        return ResponseEntity.ok(workHoursMap);
	    }
	    
	    
}
