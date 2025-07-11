package com.timesheet.admin.entity;

import java.util.List;

import lombok.Data;

@Data
public class RejectAllRequest {
    private List<Long> ids;
    private String reasonForRejection;
}
