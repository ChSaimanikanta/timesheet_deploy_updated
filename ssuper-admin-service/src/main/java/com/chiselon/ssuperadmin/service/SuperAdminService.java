package com.chiselon.ssuperadmin.service;

import java.util.List;

import com.chiselon.ssuperadmin.model.SuperAdmin;

public interface SuperAdminService {
    SuperAdmin createSuperAdmin(SuperAdmin superadmin);
    SuperAdmin updateSuperAdmin(String superAdminId, SuperAdmin superadmin);
    void deleteSuperAdmin(String superAdminId);
    List<SuperAdmin> getAllSuperAdmins();
    SuperAdmin getSuperAdminById(String superAdminId);
    SuperAdmin validateSuperAdminCredentials(String emailId, String password);
}
