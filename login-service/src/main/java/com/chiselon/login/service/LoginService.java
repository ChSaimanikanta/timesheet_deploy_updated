package com.chiselon.login.service;

import java.util.Map;

public interface LoginService {
    
	Map<String, Object> loginAsAdmin(String emailId, String password);
	Map<String, Object> loginAsEmployee(String emailId, String password);
	Map<String, Object> loginAsSuperAdmin(String emailId, String password);
    Map<String, Object> loginAsSupervisor(String emailId, String password); // New method
	
	
}
