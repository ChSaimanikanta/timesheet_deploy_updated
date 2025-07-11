package com.timesheet.superadmin.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.timesheet.superadmin.entity.AdminEntity;
import com.timesheet.superadmin.entity.EmployeeWorkingHours;
import com.timesheet.superadmin.entity.LeaveRequest;
import com.timesheet.superadmin.entity.WorkingHour;

public interface AdminService {

	public AdminEntity createAdmin(AdminEntity admin);
	public AdminEntity updateAdmin(String adminId, AdminEntity admin);
	public void deleteAdmin(String adminId);
	public List<AdminEntity> getAllAdmins();
	public AdminEntity getAdminById(String adminId);
	AdminEntity getPermissions(String adminId);
	
	AdminEntity validateAdminCredentials(String emailId, String password);

    
	public List<AdminEntity> findByFirstName(String firstName);
	
	
	
	
	
	
	 public List<LeaveRequest> getAllLeaveRequests();
	 public LeaveRequest approveLeaveRequest(Long id);
//	 public LeaveRequest rejectLeaveRequest(Long id);
	 public LeaveRequest rejectLeaveRequest(Long id, String reasonforRejection);
	 public List<LeaveRequest> approveMultipleLeaveRequests(List<Long> ids);
	 public List<LeaveRequest> rejectMultipleLeaveRequests(List<Long> ids, String reasonForRejection);
	 
	 
	 
	 
//	 public Map<String, List<WorkingHour>> getAllEmployeesWorkHoursInRange(LocalDate startDate, LocalDate endDate);
//	 public Map<String, EmployeeWorkingHours> getAllNewEmployeeWorkingHours();
//	 public Map<String, EmployeeWorkingHours> getAllNewEmployeesWorkHours();
	 
	 
	 
}

