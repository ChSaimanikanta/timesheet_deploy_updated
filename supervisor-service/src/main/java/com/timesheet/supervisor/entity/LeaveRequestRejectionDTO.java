package com.timesheet.supervisor.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestRejectionDTO {
	
	
	  private List<Long> leaveRequestIds;
	    private String rejectionReason;

}
