package com.leave.request.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApproveLeaveRequestDTO {

	
	private List<Long> leaveRequestIds;
    private String supervisorId;
	
}
