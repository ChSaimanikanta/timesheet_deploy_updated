package com.timesheet.supervisor.exceptions;

public class SupervisorNotFoundException extends RuntimeException {
    public SupervisorNotFoundException(String message) {
        super(message);
    }
}
