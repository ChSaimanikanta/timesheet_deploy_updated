package com.timesheet.superadmin.client;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.timesheet.superadmin.entity.EmployeeWorkingHours;
import com.timesheet.superadmin.entity.ProjectWorkingHours;
import com.timesheet.superadmin.entity.WorkingHour;


@FeignClient(name = "admin-service")
public interface EmployeeServiceClient {

    @GetMapping("/api/working-hours/{employeeId}/range")
    List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(@PathVariable String employeeId,
                                                              @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                              @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate);

    @PutMapping("/api/working-hours/approve/{id}")
    WorkingHour approveWorkingHour(@PathVariable Long id);

    @PutMapping("/api/working-hours/reject/{id}")
    WorkingHour rejectWorkingHour(@PathVariable Long id, @RequestParam String reason);


    @PutMapping("/api/working-hours/update")
    List<WorkingHour> updateWorkingHours(@RequestBody List<WorkingHour> workingHours);

    @PutMapping("/api/working-hours/{employeeId}/approve-range")
    List<WorkingHour> approveWorkingHoursInRange(@PathVariable String employeeId,
                                                 @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate);

//    @PutMapping("/{employeeId}/reject-range")
//    List<WorkingHour> rejectWorkingHoursInRange(@PathVariable String employeeId,
//                                                @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//                                                @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate);

    
    @PutMapping("/api/working-hours/{employeeId}/reject-range")
    List<WorkingHour> rejectWorkingHoursInRange(@PathVariable String employeeId,
                                                @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                @RequestParam String reason);

    
    
    @DeleteMapping("/api/working-hours/{employeeId}/delete-range")
    void deleteWorkingHoursInRange(@PathVariable String employeeId,
                                   @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                   @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate);

    @GetMapping("/api/working-hours/{employeeId}/projects")
    List<ProjectWorkingHours> getProjectWorkingHoursByEmployeeId(@PathVariable String employeeId);
    
    
    @GetMapping("/api/working-hours/all/range")
    public ResponseEntity<Map<String, List<WorkingHour>>> getAllEmployeesWorkHoursInRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate);
    
    
    
    @GetMapping("/api/working-hours/all/new")
    public ResponseEntity<Map<String, EmployeeWorkingHours>> getAllNewEmployeesWorkHours();
}

