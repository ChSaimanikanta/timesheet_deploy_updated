package com.timesheet.admin.exceptions;

public class AdminPermissionException extends RuntimeException {
    public AdminPermissionException(String message) {
        super(message);
    }
}
