package com.chiselon.login.model;



import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class SuperAdmin {

    @Id
    private String superAdminId;
   
    private String emailId;
    private String password;
   
}
