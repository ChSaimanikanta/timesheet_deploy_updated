package com.chiselon.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.chiselon.login.service.LoginService;
import com.chiselon.login.model.SuperAdmin;

import java.util.Map;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/admin")
    public ResponseEntity<Map<String, Object>> loginAsAdmin(@RequestParam String emailId,
                                                            @RequestParam String password) {
        try {
            Map<String, Object> response = loginService.loginAsAdmin(emailId, password);
            return ResponseEntity.ok(response); // Status code 200 OK
        } catch (ResponseStatusException e) {
            Map<String, Object> errorResponse = Map.of(
                "errorCode", e.getStatusCode().toString(),
                "errorMessage", e.getReason()
            );
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @PostMapping("/employee")
    public ResponseEntity<Map<String, Object>> loginAsEmployee(@RequestParam String emailId, 
                                                               @RequestParam String password) {
        try {
            Map<String, Object> response = loginService.loginAsEmployee(emailId, password);
            return ResponseEntity.ok(response); // Status code 200 OK
        } catch (ResponseStatusException e) {
            Map<String, Object> errorResponse = Map.of(
                "errorCode", e.getStatusCode().toString(),
                "errorMessage", e.getReason()
            );
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @PostMapping("/superadmin")
    public ResponseEntity<Map<String, Object>> loginAsSuperAdmin(@RequestParam String emailId, 
                                                                 @RequestParam String password) {
        try {
            Map<String, Object> response = loginService.loginAsSuperAdmin(emailId, password);
            return ResponseEntity.ok(response); // Status code 200 OK
        } catch (ResponseStatusException e) {
            Map<String, Object> errorResponse = Map.of(
                "errorCode", e.getStatusCode().toString(),
                "errorMessage", e.getReason()
            );
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @PostMapping("/supervisor")
    public ResponseEntity<Map<String, Object>> loginAsSupervisor(@RequestParam String emailId, 
                                                                 @RequestParam String password) {
        try {
            Map<String, Object> response = loginService.loginAsSupervisor(emailId, password);
            return ResponseEntity.ok(response); // Status code 200 OK
        } catch (ResponseStatusException e) {
            Map<String, Object> errorResponse = Map.of(
                "errorCode", e.getStatusCode().toString(),
                "errorMessage", e.getReason()
            );
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }
}
