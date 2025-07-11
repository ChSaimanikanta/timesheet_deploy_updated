package com.leave.request.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RejectLeaveRequestDTO {

	
	 private List<Long> leaveRequestIds;
	    private String reason;
	    private String supervisorId;
	
	
}
