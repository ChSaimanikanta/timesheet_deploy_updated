package com.chiselon.ssuperadmin.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.chiselon.ssuperadmin.model.ArchiveSuperAdmin;
import com.chiselon.ssuperadmin.model.SuperAdmin;
import com.chiselon.ssuperadmin.repository.ArchiveSuperAdminRepository;
import com.chiselon.ssuperadmin.repository.SuperAdminRepository;
import com.chiselon.ssuperadmin.service.SuperAdminService;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Transactional
public class SuperAdminServiceImpl implements SuperAdminService {

    @Autowired
    private SuperAdminRepository superAdminRepository;
    
    @Autowired
    private ArchiveSuperAdminRepository archiveSuperAdminRepository;

    @Autowired 
    private ModelMapper modelMapper; // Inject ModelMapper
    
    private long lastSuperAdminId = 0; // Track last Admin ID

    @Override
    public SuperAdmin createSuperAdmin(SuperAdmin superadmin) {
        validateSuperAdminFields(superadmin);

        // Check for duplicate entries before proceeding with creation
        checkForDuplicateEntries(superadmin);

        // Generate SuperAdmin ID if not provided
        if (superadmin.getSuperAdminId() == null || superadmin.getSuperAdminId().isEmpty()) {
            superadmin.setSuperAdminId(generateSuperAdminId());
        }
     // Encode password before saving
        if (superadmin.getPassword() != null && !superadmin.getPassword().isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            superadmin.setPassword(passwordEncoder.encode(superadmin.getPassword()));
        }
        // Save and return the created SuperAdmin
        return superAdminRepository.save(superadmin);
    }

    private void validateSuperAdminFields(SuperAdmin superadmin) {
        List<String> errors = new ArrayList<>();

        if (superadmin.getMobileNumber() != null && !String.valueOf(superadmin.getMobileNumber()).matches("\\d{10}")) {
            errors.add("Mobile number must be exactly 10 digits.");
        }

        if (superadmin.getAadharNumber() != null && !String.valueOf(superadmin.getAadharNumber()).matches("\\d{12}")) {
            errors.add("Aadhar number must be exactly 12 digits.");
        }

        if (superadmin.getPassword() != null && !superadmin.getPassword().startsWith("$2a$")) { // Skip validation for encrypted passwords
            List<String> passwordErrors = validatePassword(superadmin.getPassword());
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

    private void checkForDuplicateEntries(SuperAdmin superadmin) {
        if (superAdminRepository.existsByEmailId(superadmin.getEmailId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address already in use.");
        }
        if (superadmin.getMobileNumber() != null && superAdminRepository.existsByMobileNumber(superadmin.getMobileNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mobile number already in use.");
        }
        if (superadmin.getAadharNumber() != null && superAdminRepository.existsByAadharNumber(superadmin.getAadharNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aadhar card number already in use.");
        }
        if (superAdminRepository.existsByPanNumber(superadmin.getPanNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PAN card number already in use.");
        }
    }

    private String generateSuperAdminId() {
        Optional<SuperAdmin> latest = superAdminRepository.findTopByOrderBySuperAdminIdDesc();
        int nextId = 1;

        if (latest.isPresent()) {
            String currentId = latest.get().getSuperAdminId(); // e.g., "SA004"
            String numericPart = currentId.replaceAll("\\D+", "");
            try {
                nextId = Integer.parseInt(numericPart) + 1;
            } catch (NumberFormatException e) {
                throw new IllegalStateException("Invalid super admin ID format: " + currentId);
            }
        }

        return "SA" + String.format("%03d", nextId);
    }


    @Override
    public SuperAdmin updateSuperAdmin(String superAdminId, SuperAdmin superadmin) {
        SuperAdmin existingSuperAdmin = superAdminRepository.findBySuperAdminId(superAdminId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SuperAdmin not found with ID: " + superAdminId));

        validateSuperAdminFields(superadmin);
        validateSuperAdminUpdate(superadmin, existingSuperAdmin);

        existingSuperAdmin.setFirstName(superadmin.getFirstName());
        existingSuperAdmin.setLastName(superadmin.getLastName());
        existingSuperAdmin.setAddress(superadmin.getAddress());
        existingSuperAdmin.setMobileNumber(superadmin.getMobileNumber());
        existingSuperAdmin.setEmailId(superadmin.getEmailId());
        existingSuperAdmin.setAadharNumber(superadmin.getAadharNumber());
        existingSuperAdmin.setPanNumber(superadmin.getPanNumber());
        // Encode the password before updating
        if (superadmin.getPassword() != null && !superadmin.getPassword().isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            existingSuperAdmin.setPassword(passwordEncoder.encode(superadmin.getPassword()));
        }
        return superAdminRepository.save(existingSuperAdmin);
    }

    private void validateSuperAdminUpdate(SuperAdmin updatedSuperAdmin, SuperAdmin existingSuperAdmin) {
        List<String> errors = new ArrayList<>();

        if (!updatedSuperAdmin.getEmailId().equals(existingSuperAdmin.getEmailId()) &&
            superAdminRepository.existsByEmailId(updatedSuperAdmin.getEmailId())) {
            errors.add("Email address already in use.");
        }

        if (updatedSuperAdmin.getMobileNumber() != null && 
            !updatedSuperAdmin.getMobileNumber().equals(existingSuperAdmin.getMobileNumber()) &&
            superAdminRepository.existsByMobileNumber(updatedSuperAdmin.getMobileNumber())) {
            errors.add("Mobile number already in use.");
        }

        if (updatedSuperAdmin.getAadharNumber() != null &&
            !updatedSuperAdmin.getAadharNumber().equals(existingSuperAdmin.getAadharNumber()) &&
            superAdminRepository.existsByAadharNumber(updatedSuperAdmin.getAadharNumber())) {
            errors.add("Aadhar card number already in use.");
        }

        if (!updatedSuperAdmin.getPanNumber().equals(existingSuperAdmin.getPanNumber()) &&
            superAdminRepository.existsByPanNumber(updatedSuperAdmin.getPanNumber())) {
            errors.add("PAN card number already in use.");
        }

        if (updatedSuperAdmin.getPassword() != null) {
            List<String> passwordErrors = validatePassword(updatedSuperAdmin.getPassword());
            errors.addAll(passwordErrors);
        }

        if (!errors.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.join(", ", errors));
        }
    }

    @Override
    public void deleteSuperAdmin(String superAdminId) {
        // Check if the SuperAdmin exists
        SuperAdmin superAdmin = superAdminRepository.findBySuperAdminId(superAdminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SuperAdmin not found with ID: " + superAdminId));

        // Convert SuperAdmin to ArchiveSuperAdmin using ModelMapper
        ArchiveSuperAdmin archiveSuperAdmin = modelMapper.map(superAdmin, ArchiveSuperAdmin.class);

        // Save the archived record
        archiveSuperAdminRepository.save(archiveSuperAdmin);

        // Delete the SuperAdmin record from the main table
        superAdminRepository.deleteBySuperAdminId(superAdminId);
    }

    @Override
    public SuperAdmin getSuperAdminById(String superAdminId) {
        return superAdminRepository.findBySuperAdminId(superAdminId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SuperAdmin not found with ID: " + superAdminId));
    }

    @Override
    public SuperAdmin validateSuperAdminCredentials(String emailId, String rawPassword) {
        SuperAdmin superAdmin = superAdminRepository.findByEmailId(emailId);

        // If email does not exist, check if the password belongs to any SuperAdmin
        if (superAdmin == null) {
            List<SuperAdmin> allAdmins = superAdminRepository.findAll(); // Fetch all admins
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            boolean passwordExists = allAdmins.stream()
                    .anyMatch(admin -> passwordEncoder.matches(rawPassword, admin.getPassword()));

            if (!passwordExists) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Both email ID and password are incorrect.");
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email ID does not exist.");
            }
        }

        // Password validation using BCryptPasswordEncoder
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(rawPassword, superAdmin.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your password is wrong.");
        }

        return superAdmin; // Return SuperAdmin entity if credentials are valid
    }


    @Override
    public List<SuperAdmin> getAllSuperAdmins() {
        return superAdminRepository.findAll();
    }
}
