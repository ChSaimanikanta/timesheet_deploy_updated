package com.timesheet.superadmin.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.timesheet.superadmin.client.AdminServiceClient;
import com.timesheet.superadmin.entity.AdminEntity;
import com.timesheet.superadmin.entity.ArchiveAdmin;
import com.timesheet.superadmin.entity.LeaveRequest;
import com.timesheet.superadmin.exception.AdminNotFoundException;
import com.timesheet.superadmin.repo.AdminRepository;
import com.timesheet.superadmin.repo.ArchiveAdminRepository;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private ArchiveAdminRepository archiveAdminRepository;

    @Autowired
    private ModelMapper modelMapper;

    private long lastAdminId = 0; // Track last Admin ID

    @Override
    public AdminEntity createAdmin(AdminEntity admin) {
        validateAdminFields(admin);

        // Check for duplicate entries before proceeding with creation
        checkForDuplicateEntries(admin);

//        // Generate Admin ID if not provided
//        if (admin.getAdminId() == null || admin.getAdminId().isEmpty()) {
//            admin.setAdminId(generateAdminId());
//        }

     // Encode the password before saving
        if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }


        // Save and return the created AdminEntity
        return adminRepository.save(admin);
    }

    private void validateAdminFields(AdminEntity admin) {
        List<String> errors = new ArrayList<>();

     // Validate employee ID
        if (admin.getAdminId() == null || admin.getAdminId().trim().isEmpty()) {
            errors.add("Admin ID is required.");
        } else if (adminRepository.findByAdminId(admin.getAdminId()).isPresent()) {
            errors.add("Admin ID already exists. Please provide a unique one.");
        }
        
        if (admin.getMobileNumber() != null && !String.valueOf(admin.getMobileNumber()).matches("\\d{10}")) {
            errors.add("Mobile number must be exactly 10 digits.");
        }

        if (admin.getAadharNumber() != null && !String.valueOf(admin.getAadharNumber()).matches("\\d{12}")) {
            errors.add("Aadhar number must be exactly 12 digits.");
        }

        if (admin.getPassword() != null && !admin.getPassword().startsWith("$2a$")) { // Skip validation for encrypted passwords
            List<String> passwordErrors = validatePassword(admin.getPassword());
            errors.addAll(passwordErrors);
        }


        if (!errors.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.join(", ", errors));
        }
    }

    private List<String> validatePassword(String password) {
        List<String> errors = new ArrayList<>();
        if (password.length() < 8) {
            errors.add("Password must be at least 8 characters long.");
        }
        if (!Pattern.compile("[A-Z]").matcher(password).find()) {
            errors.add("Password must contain at least one uppercase letter.");
        }
        if (!Pattern.compile("[a-z]").matcher(password).find()) {
            errors.add("Password must contain at least one lowercase letter.");
        }
        if (!Pattern.compile("\\d").matcher(password).find()) {
            errors.add("Password must contain at least one digit.");
        }
        if (!Pattern.compile("[!@#$^*()_+\\-=\\[\\]{}|;':\",.<>]").matcher(password).find()) {
	        errors.add("Password must contain at least one special character.");
	    }
        if (Pattern.compile("[%&=/<>?]").matcher(password).find()) {
            errors.add("Password must not contain reserved characters (% & = / < > ?).");
        }
        return errors;
    }
    
    private void checkForDuplicateEntries(AdminEntity admin) {
        if (adminRepository.existsByEmailId(admin.getEmailId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address already in use.");
        }
        if (admin.getMobileNumber() != null && adminRepository.existsByMobileNumber(admin.getMobileNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mobile number already in use.");
        }
        if (admin.getAadharNumber() != null && adminRepository.existsByAadharNumber(admin.getAadharNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aadhar number already in use.");
        }
        if (adminRepository.existsByPanNumber(admin.getPanNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PAN card number already in use.");
        }
    }


    @Transactional
    @Override
    public AdminEntity updateAdmin(String existingId, AdminEntity updatedAdmin) {
        AdminEntity existingAdmin = adminRepository.findByAdminId(existingId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Admin not found with ID: " + existingId));

        String newId = updatedAdmin.getAdminId();

        if (!newId.equals(existingId) && adminRepository.existsByAdminId(newId)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Admin ID already exists: " + newId);
        }

        // validate fields
        validateUpdateAdminFields(updatedAdmin);
        validateAdminUpdate(updatedAdmin, existingAdmin);

        // Encode the password before saving
        if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            updatedAdmin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
        } else {
            updatedAdmin.setPassword(existingAdmin.getPassword()); // retain the existing password
        }

        AdminEntity newAdmin = new AdminEntity(
            newId,
            updatedAdmin.getFirstName(),
            updatedAdmin.getLastName(),
            updatedAdmin.getAddress(),
            updatedAdmin.getMobileNumber(),
            updatedAdmin.getEmailId(),
            updatedAdmin.getAadharNumber(),
            updatedAdmin.getPanNumber(),
            updatedAdmin.getPassword(),
            updatedAdmin.isCanCreateEmployee(),
            updatedAdmin.isCanEditEmployee(),
            updatedAdmin.isCanDeleteEmployee(),
            updatedAdmin.isCanCreateProject(),
            updatedAdmin.isCanEditProject(),
            updatedAdmin.isCanDeleteProject()
        );

        adminRepository.delete(existingAdmin);
        return adminRepository.save(newAdmin);
    }

    private void validateUpdateAdminFields(AdminEntity admin) {
        List<String> errors = new ArrayList<>();

     // Validate employee ID
        if (admin.getAdminId() == null || admin.getAdminId().trim().isEmpty()) {
            errors.add("Admin ID is required.");
        } 
        if (admin.getMobileNumber() != null && !String.valueOf(admin.getMobileNumber()).matches("\\d{10}")) {
            errors.add("Mobile number must be exactly 10 digits.");
        }

        if (admin.getAadharNumber() != null && !String.valueOf(admin.getAadharNumber()).matches("\\d{12}")) {
            errors.add("Aadhar number must be exactly 12 digits.");
        }

        if (admin.getPassword() != null && !admin.getPassword().startsWith("$2a$")) { // Skip validation for encrypted passwords
            List<String> passwordErrors = validatePassword(admin.getPassword());
            errors.addAll(passwordErrors);
        }


        if (!errors.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.join(", ", errors));
        }
    }


    private void validateAdminUpdate(AdminEntity updatedAdmin, AdminEntity existingAdmin) {
        List<String> errors = new ArrayList<>();

        if (!updatedAdmin.getEmailId().equals(existingAdmin.getEmailId()) &&
            adminRepository.existsByEmailId(updatedAdmin.getEmailId())) {
            errors.add("Email address already in use.");
        }

        if (updatedAdmin.getMobileNumber() != null && 
            !updatedAdmin.getMobileNumber().equals(existingAdmin.getMobileNumber()) &&
            adminRepository.existsByMobileNumber(updatedAdmin.getMobileNumber())) {
            errors.add("Mobile number already in use.");
        }

        if (updatedAdmin.getAadharNumber() != null &&
            !updatedAdmin.getAadharNumber().equals(existingAdmin.getAadharNumber()) &&
            adminRepository.existsByAadharNumber(updatedAdmin.getAadharNumber())) {
            errors.add("Aadhar number already in use.");
        }

        if (!updatedAdmin.getPanNumber().equals(existingAdmin.getPanNumber()) &&
            adminRepository.existsByPanNumber(updatedAdmin.getPanNumber())) {
            errors.add("PAN card number already in use.");
        }

        if (updatedAdmin.getPassword() != null) {
            List<String> passwordErrors = validatePassword(updatedAdmin.getPassword());
            errors.addAll(passwordErrors);
        }

        if (!errors.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.join(", ", errors));
        }
    }
    

//    @Override
//    public void deleteAdmin(String adminId) {
//        if (!adminRepository.existsByAdminId(adminId)) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found with ID: " + adminId);
//        }
//        adminRepository.deleteByAdminId(adminId);
//    }
    
    @Override
    public void deleteAdmin(String adminId) {
    	// Check if the Admin exists
        AdminEntity admin = adminRepository.findByAdminId(adminId)
        		.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SuperAdmin not found with ID: " + adminId));

        // Convert SuperAdmin to ArchiveSuperAdmin using ModelMapper
        ArchiveAdmin archiveSuperAdmin = modelMapper.map(admin, ArchiveAdmin.class);

        // Save the archived record
        archiveAdminRepository.save(archiveSuperAdmin);

        // Delete the SuperAdmin record from the main table
        adminRepository.deleteById(adminId);
    }

    @Override
    public AdminEntity getAdminById(String adminId) {
        return adminRepository.findByAdminId(adminId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found with ID: " + adminId));
    }
    
    @Override
    public AdminEntity getPermissions(String adminId) {
        return adminRepository.findByAdminId(adminId)
            .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + adminId));
    }

//    @Override
//    public AdminEntity validateAdminCredentials(String emailId, String password) {
//        // Fetch admin entity by email
//        AdminEntity admin = adminRepository.findByEmailId(emailId);
//
//        // If both email and password are incorrect
//        if (admin == null && (password == null || password.isEmpty() || !adminRepository.existsByPassword(password))) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Both email ID and password are incorrect.");
//        }
//
//        // If only the email is incorrect
//        if (admin == null) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email ID does not exist.");
//        }
//
//        // Password validation using BCryptPasswordEncoder
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//
//        // If only password is incorrect
//        if (!passwordEncoder.matches(password, admin.getPassword())) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your password is wrong.");
//        }
//
//        // If credentials are valid, return the admin entity
//        return admin;
//    }

//    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

    @Override
    public AdminEntity validateAdminCredentials(String emailId, String rawPassword) {
        AdminEntity adminByEmail = adminRepository.findByEmailId(emailId);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (adminByEmail == null) {
            // Check if there's an admin **with this password** (even if email is wrong)
            List<AdminEntity> adminsByPassword = adminRepository.findAll(); // Fetch all admins
            boolean passwordExists = adminsByPassword.stream()
                                    .anyMatch(admin -> passwordEncoder.matches(rawPassword, admin.getPassword()));

            if (!passwordExists) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Both email ID and password are incorrect.");
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email ID does not exist.");
            }
        }

        // Check password validity
        if (!passwordEncoder.matches(rawPassword, adminByEmail.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your password is wrong.");
        }

        return adminByEmail;
    }




    @Override
    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public List<AdminEntity> findByFirstName(String firstName) {
        List<AdminEntity> admins = adminRepository.findByFirstName(firstName);
        if (admins.isEmpty()) {
            throw new AdminNotFoundException("Admin with first name: " + firstName + " not found.");
        }
        return admins;
    }
	
	
	
	
	
	
	
	
	
	
    @Autowired
    private AdminServiceClient adminServiceClient;

 public List<LeaveRequest> getAllLeaveRequests() {
        return adminServiceClient.getAllLeaveRequests();
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = adminServiceClient.getAllLeaveRequests().stream()
                .filter(request -> request.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        leaveRequest.setStatus("APPROVED");
        return adminServiceClient.updateLeaveRequest(id, leaveRequest);
    }

//    public LeaveRequest rejectLeaveRequest(Long id) {
//        LeaveRequest leaveRequest = adminServiceClient.getAllLeaveRequests().stream()
//                .filter(request -> request.getId().equals(id))
//                .findFirst()
//                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
//        leaveRequest.setStatus("REJECTED");
//        return adminServiceClient.updateLeaveRequest(id, leaveRequest);
//    }
    
    
    public LeaveRequest rejectLeaveRequest(Long id, String reasonforRejection) {
        LeaveRequest leaveRequest = adminServiceClient.getAllLeaveRequests().stream()
                .filter(request -> request.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));
        leaveRequest.setStatus("REJECTED");
        leaveRequest.setReasonForRejection(reasonforRejection);
        return adminServiceClient.updateLeaveRequest(id, leaveRequest);
    }
    
    
    public List<LeaveRequest> approveMultipleLeaveRequests(List<Long> ids) {
        List<LeaveRequest> leaveRequests = adminServiceClient.getAllLeaveRequests();
        List<LeaveRequest> approvedRequests = new ArrayList<>();
        
        for (Long id : ids) {
            LeaveRequest leaveRequest = leaveRequests.stream()
                    .filter(request -> request.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Leave Request ID: " + id));
            leaveRequest.setStatus("APPROVED");
            approvedRequests.add(adminServiceClient.updateLeaveRequest(id, leaveRequest));
        }
        
        return approvedRequests;
    }

    public List<LeaveRequest> rejectMultipleLeaveRequests(List<Long> ids, String reasonForRejection) {
        List<LeaveRequest> leaveRequests = adminServiceClient.getAllLeaveRequests();
        List<LeaveRequest> rejectedRequests = new ArrayList<>();
        
        for (Long id : ids) {
            LeaveRequest leaveRequest = leaveRequests.stream()
                    .filter(request -> request.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Leave Request ID: " + id));
            leaveRequest.setStatus("REJECTED");
            leaveRequest.setReasonForRejection(reasonForRejection);
            rejectedRequests.add(adminServiceClient.updateLeaveRequest(id, leaveRequest));
        }
        
        return rejectedRequests;
    }


}