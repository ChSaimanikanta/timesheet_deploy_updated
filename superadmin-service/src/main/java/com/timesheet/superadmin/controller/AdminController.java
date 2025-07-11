package com.timesheet.superadmin.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.server.ResponseStatusException;

import com.timesheet.superadmin.client.AdminServiceClient;
import com.timesheet.superadmin.client.EmployeeServiceClient;
import com.timesheet.superadmin.entity.AdminEntity;
import com.timesheet.superadmin.entity.EmployeeWorkingHours;
import com.timesheet.superadmin.entity.LeaveRequest;
import com.timesheet.superadmin.entity.ProjectWorkingHours;
import com.timesheet.superadmin.entity.WorkingHour;
import com.timesheet.superadmin.service.AdminService;

import jakarta.validation.Valid;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admins")
public class AdminController {

	@Autowired
    private AdminService adminService;
	
	private EmployeeServiceClient employeeserviceClient;

	@PostMapping("/saveadmin")
    public ResponseEntity<AdminEntity> createAdmin(@Valid @RequestBody AdminEntity admin) {
        AdminEntity createdAdmin = adminService.createAdmin(admin);
        return new ResponseEntity<>(createdAdmin, HttpStatus.OK); // 200 OK for creation
    }

    @GetMapping("/getadmins")
    public ResponseEntity<List<AdminEntity>> getAllAdmins() {
        List<AdminEntity> admins = adminService.getAllAdmins();
        return new ResponseEntity<>(admins, HttpStatus.OK); // 200 OK for retrieving all admins
    }

    @PutMapping("/{adminId}")
    public ResponseEntity<AdminEntity> updateAdmin(
            @PathVariable String adminId,
            @Valid @RequestBody AdminEntity admin) {
        AdminEntity updatedAdmin = adminService.updateAdmin(adminId, admin);
        return new ResponseEntity<>(updatedAdmin, HttpStatus.OK); // 200 OK for update
    }

    @DeleteMapping("/{adminId}")
    public ResponseEntity<String> deleteAdmin(@PathVariable String adminId) {
        adminService.deleteAdmin(adminId);
        return new ResponseEntity<>("Admin deleted successfully.", HttpStatus.OK); // 200 OK for deletion
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<AdminEntity> getAdminById(@PathVariable String adminId) {
        AdminEntity admin = adminService.getAdminById(adminId);
        return new ResponseEntity<>(admin, HttpStatus.OK); // 200 OK for retrieving by ID
    }

    @GetMapping("/permissions/{adminId}")
    public ResponseEntity<AdminEntity> getPermissions(@PathVariable String adminId) {
        AdminEntity admin = adminService.getPermissions(adminId);
        return new ResponseEntity<>(admin, HttpStatus.OK); // 200 OK for permissions
    }

    @GetMapping("/validate")
    public ResponseEntity<AdminEntity> validateAdminCredentials(
            @RequestParam String emailId,
            @RequestParam String password) {
        AdminEntity admin = adminService.validateAdminCredentials(emailId, password);
        return new ResponseEntity<>(admin, HttpStatus.OK); // 200 OK for valid credentials
    }



    @GetMapping("/by-firstName/{firstName}")
    public ResponseEntity<List<AdminEntity>> getUsersByFirstName(@PathVariable("firstName") String firstName) {
        List<AdminEntity> admins = adminService.findByFirstName(firstName);
        if (admins.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found if no admins are found
        }
        return new ResponseEntity<>(admins, HttpStatus.OK); // 200 OK if admins are found
    }
    
    
    
    
    
    
    @Autowired
    private EmployeeServiceClient employeeServiceClient;

    @GetMapping("/working-hours/{employeeId}/range")
    public List<WorkingHour> getWorkingHoursByEmployeeIdAndDateRange(@PathVariable String employeeId,
                                                                     @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                     @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return employeeServiceClient.getWorkingHoursByEmployeeIdAndDateRange(employeeId, startDate, endDate);
    }

    @PutMapping("/working-hours/approve/{id}")
    public WorkingHour approveWorkingHour(@PathVariable Long id) {
        return employeeServiceClient.approveWorkingHour(id);
    }

    @PutMapping("/working-hours/reject/{id}")
    public WorkingHour rejectWorkingHour(@PathVariable Long id, @RequestParam String reason) {
        return employeeServiceClient.rejectWorkingHour(id,reason);
    }

    @PutMapping("/working-hours/update")
    public List<WorkingHour> updateWorkingHour(@RequestBody List<WorkingHour> workingHours) {
        System.out.println("Received Update Request: " + workingHours);
        return employeeServiceClient.updateWorkingHours(workingHours);
    }
    
    

    @PutMapping("/working-hours/{employeeId}/approve-range")
    public List<WorkingHour> approveWorkingHoursInRange(@PathVariable String employeeId,
                                                        @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return employeeServiceClient.approveWorkingHoursInRange(employeeId, startDate, endDate);
    }

//    @PutMapping("/working-hours/{employeeId}/reject-range")
//    public List<WorkingHour> rejectWorkingHoursInRange(@PathVariable String employeeId,
//                                                       @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//                                                       @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//        return employeeServiceClient.rejectWorkingHoursInRange(employeeId, startDate, endDate);
//    }
    
    
    
    @PutMapping("/working-hours/{employeeId}/reject-range")
    public List<WorkingHour> rejectWorkingHoursInRange(@PathVariable String employeeId,
                                                       @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                       @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                       @RequestParam String reason) {
    	
        return employeeServiceClient.rejectWorkingHoursInRange(employeeId, startDate, endDate,reason);
    }

    
    
    

    @DeleteMapping("/working-hours/{employeeId}/delete-range")
    public void deleteWorkingHoursInRange(@PathVariable String employeeId,
                                          @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                          @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        employeeServiceClient.deleteWorkingHoursInRange(employeeId, startDate, endDate);
    }

    @GetMapping("/working-hours/{employeeId}/projects")
    public List<ProjectWorkingHours> getProjectWorkingHoursByEmployeeId(@PathVariable String employeeId) {
        return employeeServiceClient.getProjectWorkingHoursByEmployeeId(employeeId);
    }
    
    
////    Get all the employee workhours in Range
//    @GetMapping("/all/range")
//    public ResponseEntity<Map<String, List<WorkingHour>>> getAllEmployeesWorkHoursInRange(
//            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//        
//        Map<String, List<WorkingHour>> workHoursMap = adminService.getAllEmployeesWorkHoursInRange(startDate, endDate);
//        return ResponseEntity.ok(workHoursMap);
//    }
//    
//    
//    @GetMapping("/all/new")
//    public ResponseEntity<Map<String, EmployeeWorkingHours>> getAllNewEmployeesWorkHours() {
//        Map<String, EmployeeWorkingHours> workHoursMap = adminService.getAllNewEmployeesWorkHours();
//        return ResponseEntity.ok(workHoursMap);
//    }
    
    
    @GetMapping("/all/range")
    public ResponseEntity<Map<String, List<WorkingHour>>> getAllEmployeesWorkHoursInRange(
        @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return employeeServiceClient.getAllEmployeesWorkHoursInRange(startDate, endDate);
    }

    @GetMapping("/all/new")
    public ResponseEntity<Map<String, EmployeeWorkingHours>> getAllNewEmployeesWorkHours() {
        return employeeServiceClient.getAllNewEmployeesWorkHours();
    }
    
    

}