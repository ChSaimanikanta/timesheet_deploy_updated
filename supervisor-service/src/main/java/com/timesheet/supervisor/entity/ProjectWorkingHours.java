package com.timesheet.supervisor.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProjectWorkingHours {


	  private String projectId;
	    private int totalWorkingHours;
	    private Map<String, Integer> employeeWorkingHours;
	    private List<WorkingHour> workingHours;

	    public ProjectWorkingHours(String projectId) {
	        this.projectId = projectId;
	        this.totalWorkingHours = 0;
	        this.employeeWorkingHours = new HashMap<>();
	        this.workingHours = new ArrayList<>();
	    }

	    // getters and setters
	    public String getProjectId() {
	        return projectId;
	    }

	    public void setProjectId(String projectId) {
	        this.projectId = projectId;
	    }

	    public int getTotalWorkingHours() {
	        return totalWorkingHours;
	    }

	    public void setTotalWorkingHours(int totalWorkingHours) {
	        this.totalWorkingHours = totalWorkingHours;
	    }

	    public Map<String, Integer> getEmployeeWorkingHours() {
	        return employeeWorkingHours;
	    }

	    public void setEmployeeWorkingHours(Map<String, Integer> employeeWorkingHours) {
	        this.employeeWorkingHours = employeeWorkingHours;
	    }

	    public List<WorkingHour> getWorkingHours() {
	        return workingHours;
	    }

	    public void setWorkingHours(List<WorkingHour> workingHours) {
	        this.workingHours = workingHours;
	    }

	    // methods to add working hours
	    public void addWorkingHour(WorkingHour workingHour) {
	        this.workingHours.add(workingHour);
	        this.totalWorkingHours += workingHour.getHours();
	        this.employeeWorkingHours.put(
	            workingHour.getEmployeeId(),
	            this.employeeWorkingHours.getOrDefault(workingHour.getEmployeeId(), 0) + workingHour.getHours()
	        );
	    }
	
	
}
