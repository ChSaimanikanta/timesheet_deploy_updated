package com.chiselon.login.exception;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomErrorResponse {
    private String errorCode;
    private String errorMessage;
}
