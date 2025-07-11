package com.timesheet.employee.controller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timesheet.employee.entity.ProjectWorkingHours;
import com.timesheet.employee.entity.WorkingHour;
import com.timesheet.employee.service.WorkingHourService;


@RestController
//@CrossOrigin(origins = "http://localhost:3000")
// @RequestMapping("/api/working-hours")
@RequestMapping("/working-hours")
public class WorkingHourController {

	    @Autowired
	    private WorkingHourService workingHourService;

	    @PostMapping
	    public List<WorkingHour> saveWorkingHours(@RequestBody List<WorkingHour> workingHours) {
	        return workingHourService.saveWorkingHours(workingHours);
	    }

	    @GetMapping("/{employeeId}")
	    public List<WorkingHour> getWorkingHoursByEmployeeId(@PathVariable String employeeId) {
	        return workingHourService.getWorkingHoursByEmployeeId(employeeId);
	    }

	    @GetMapping("/{employeeId}/range")
	    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.getWorkingHoursByEmployeeIdAndDateRange(employeeId, startDate, endDate);
	    }

	    @PutMapping("/approve/{id}")
	    public WorkingHour approveWorkingHour(@PathVariable Long id) {
	        return workingHourService.approveWorkingHour(id);
	    }

	    @PutMapping("/reject/{id}")
	    public WorkingHour rejectWorkingHour(@PathVariable Long id) {
	        return workingHourService.rejectWorkingHour(id);
	    }

	    @PutMapping("/update")
	    public WorkingHour updateWorkingHour(@RequestBody WorkingHour workingHour) {
	        return workingHourService.updateWorkingHour(workingHour);
	    }

	    @PutMapping("/{employeeId}/approve-range")
	    public List<WorkingHour> approveWorkingHoursInRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.updateWorkingHoursStatusInRange(employeeId, startDate, endDate, "APPROVED");
	    }

	    @PutMapping("/{employeeId}/reject-range")
	    public List<WorkingHour> rejectWorkingHoursInRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.updateWorkingHoursStatusInRange(employeeId, startDate, endDate, "REJECTED");
	    }

	    @DeleteMapping("/{employeeId}/delete-range")
	    public void deleteWorkingHoursInRange(
	            @PathVariable String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        workingHourService.deleteWorkingHoursInRange(employeeId, startDate, endDate);
	    }
 	    
	    @GetMapping("/{employeeId}/projects")
	    public List<ProjectWorkingHours> getProjectWorkingHoursByEmployeeId(@PathVariable String employeeId) {
	        return workingHourService.getProjectWorkingHoursByEmployeeId(employeeId);
	    }

//	    @GetMapping("/{employeeId}/projects/total-hours")
//	    public List<ProjectWorkingHours> getTotalWorkingHoursByEmployeeIdAndDateRange(
//	            @PathVariable String employeeId,
//	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//	        return workingHourService.getTotalWorkingHoursByEmployeeIdAndDateRange(employeeId, startDate, endDate);
//	    }
	    
	    
	    
	    @GetMapping("/range")
	    public List<WorkingHour> getEmployeeWorkHoursInRange(
	            @RequestParam("employeeId") String employeeId,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.getEmployeeWorkHoursInRange(employeeId, startDate, endDate);
	    }

	    // Endpoint to get work hours for multiple employees within a date range
	    @GetMapping("/multiple/range")
	    public Map<String, List<WorkingHour>> getMultipleEmployeesWorkHoursInRange(
	            @RequestParam("employeeIds") List<String> employeeIds,
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        return workingHourService.getMultipleEmployeesWorkHoursInRange(employeeIds, startDate, endDate);
	    }
	    
	    
	    
	    
//	      Get all the employee workhours in Range
	    @GetMapping("/all/range")
	    public ResponseEntity<Map<String, List<WorkingHour>>> getAllEmployeesWorkHoursInRange(
	            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
	        
	        Map<String, List<WorkingHour>> workHoursMap = workingHourService.getAllEmployeesWorkHoursInRange(startDate, endDate);
	        return ResponseEntity.ok(workHoursMap);
	    }
	    

}
