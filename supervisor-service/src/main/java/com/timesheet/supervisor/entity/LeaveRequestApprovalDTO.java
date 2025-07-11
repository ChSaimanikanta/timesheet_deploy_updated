package com.timesheet.supervisor.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequestApprovalDTO {

	
	 private List<Long> leaveRequestIds;
	
}
