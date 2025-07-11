package com.timesheet.employee.exception;

public class PermissionDeniedException extends RuntimeException {
    public PermissionDeniedException(String action) {
        super(String.format("Permission denied for action: %s", action));
    }
}
