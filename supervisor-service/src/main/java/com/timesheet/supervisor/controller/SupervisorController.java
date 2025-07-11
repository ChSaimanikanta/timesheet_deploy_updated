package com.timesheet.supervisor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.timesheet.supervisor.entity.Supervisor;
import com.timesheet.supervisor.exceptions.SupervisorNotFoundException;
import com.timesheet.supervisor.service.SupervisorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/supervisors")
public class SupervisorController {

    @Autowired
    private SupervisorService supervisorService;

    @PostMapping
    public ResponseEntity<Supervisor> createSupervisor(@RequestBody Supervisor supervisor) {
        Supervisor createdSupervisor = supervisorService.createSupervisor(supervisor);
        return new ResponseEntity<>(createdSupervisor, HttpStatus.CREATED);
    }

    @DeleteMapping("/{supervisorId}")
    public ResponseEntity<Void> deleteSupervisor(@PathVariable String supervisorId) {
        supervisorService.deleteSupervisor(supervisorId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{supervisorId}")
    public ResponseEntity<Supervisor> getSupervisorById(@PathVariable String supervisorId) {
        Supervisor supervisor = supervisorService.getSupervisorById(supervisorId);
        return new ResponseEntity<>(supervisor, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Supervisor>> getAllSupervisors() {
        List<Supervisor> supervisors = supervisorService.getAllSupervisors();
        return new ResponseEntity<>(supervisors, HttpStatus.OK);
    }

    @GetMapping("/validate")
    public ResponseEntity<Supervisor> validateSupervisorCredentials(
            @RequestParam String emailId,
            @RequestParam String password) {
        Supervisor supervisor = supervisorService.validateSupervisorCredentials(emailId, password);
        return new ResponseEntity<>(supervisor, HttpStatus.OK);
    }

    @PutMapping("/{supervisorId}")
    public ResponseEntity<?> updateSupervisor(
            @PathVariable String supervisorId,
            @Valid @RequestBody Supervisor updatedSupervisor) {
        try {
            Supervisor result = supervisorService.updateSupervisor(supervisorId, updatedSupervisor);
            return ResponseEntity.ok(result);
        } catch (SupervisorNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Unexpected error occurred"));
        }
    }

}
