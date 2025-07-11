package com.timesheet.admin.entity;

import java.util.List;

public class EmployeeWorkingHours {
    private String employeeId;
    private List<WorkingHour> workingHours;
    private int totalHours;

    // Constructors, getters, and setters
    public EmployeeWorkingHours(String employeeId, List<WorkingHour> workingHours, int totalHours) {
        this.employeeId = employeeId;
        this.workingHours = workingHours;
        this.totalHours = totalHours;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public List<WorkingHour> getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(List<WorkingHour> workingHours) {
        this.workingHours = workingHours;
    }

    public int getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(int totalHours) {
        this.totalHours = totalHours;
    }
}
