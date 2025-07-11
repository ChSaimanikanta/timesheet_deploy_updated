package com.timesheet.admin.exceptions;

public class SupervisorNotFoundException extends RuntimeException {

    public SupervisorNotFoundException(String message) {
        super(message);
    }
}