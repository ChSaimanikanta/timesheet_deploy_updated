package com.chiselon.ssuperadmin.controller;

import com.chiselon.ssuperadmin.model.SuperAdmin;
import com.chiselon.ssuperadmin.service.SuperAdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/superadmins")
public class SuperAdminController {

    @Autowired
    private SuperAdminService superAdminService;

    @PostMapping
    public ResponseEntity<SuperAdmin> createSuperAdmin(@Valid @RequestBody SuperAdmin superadmin) {
        SuperAdmin createdSuperAdmin = superAdminService.createSuperAdmin(superadmin);
        return new ResponseEntity<>(createdSuperAdmin, HttpStatus.OK); // Changed to 200 OK
    }

    @PutMapping("/{superAdminId}")
    public ResponseEntity<SuperAdmin> updateSuperAdmin(
            @PathVariable("superAdminId") String superAdminId,
            @Valid @RequestBody SuperAdmin superadmin) {
        SuperAdmin updatedSuperAdmin = superAdminService.updateSuperAdmin(superAdminId, superadmin);
        return new ResponseEntity<>(updatedSuperAdmin, HttpStatus.OK); // Remains 200 OK
    }

    @DeleteMapping("/{superAdminId}")
    public ResponseEntity<String> deleteSuperAdmin(@PathVariable("superAdminId") String superAdminId) {
        superAdminService.deleteSuperAdmin(superAdminId);
        return new ResponseEntity<>("SuperAdmin deleted successfully.", HttpStatus.OK);
    }

       

    @GetMapping
    public ResponseEntity<List<SuperAdmin>> getAllSuperAdmins() {
        List<SuperAdmin> superAdmins = superAdminService.getAllSuperAdmins();
        return new ResponseEntity<>(superAdmins, HttpStatus.OK); // Remains 200 OK
    }

    @GetMapping("/{superAdminId}")
    public ResponseEntity<SuperAdmin> getSuperAdminById(@PathVariable("superAdminId") String superAdminId) {
        SuperAdmin superAdmin = superAdminService.getSuperAdminById(superAdminId);
        return new ResponseEntity<>(superAdmin, HttpStatus.OK); // Remains 200 OK
    }

    @GetMapping("/validate")
    public ResponseEntity<SuperAdmin> validateSuperAdminCredentials(
            @RequestParam String emailId, @RequestParam String password) {
        SuperAdmin superAdmin = superAdminService.validateSuperAdminCredentials(emailId, password);
        if (superAdmin != null) {
            return new ResponseEntity<>(superAdmin, HttpStatus.OK); // Remains 200 OK
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Remains 401 Unauthorized
        }
    }
}
