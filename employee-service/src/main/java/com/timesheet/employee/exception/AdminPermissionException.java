package com.timesheet.employee.exception;

public class AdminPermissionException extends RuntimeException {
    public AdminPermissionException(String message) {
        super(message);
    }
}