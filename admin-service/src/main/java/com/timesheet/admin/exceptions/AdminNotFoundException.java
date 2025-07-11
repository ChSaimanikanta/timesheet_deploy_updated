package com.timesheet.admin.exceptions;

public class AdminNotFoundException extends RuntimeException {
    public AdminNotFoundException(String adminId) {
        super(String.format("Admin not found with ID: %s", adminId));
    }
}
