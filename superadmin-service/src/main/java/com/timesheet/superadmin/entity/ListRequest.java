package com.timesheet.superadmin.entity;

import java.util.List;

import lombok.Data;

@Data
public class ListRequest {
    private List<Long> ids;
}
