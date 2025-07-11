package com.chiselon.ssuperadmin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.chiselon.ssuperadmin.model.SuperAdmin;

public interface SuperAdminRepository extends JpaRepository<SuperAdmin, String> {
    Optional<SuperAdmin> findBySuperAdminId(String superAdminId);
    boolean existsBySuperAdminId(String superAdminId);
    void deleteBySuperAdminId(String superAdminId);
    SuperAdmin findByEmailIdAndPassword(String emailId, String password);

    boolean existsByMobileNumber(Long mobileNumber);
    boolean existsByEmailId(String emailId);
    boolean existsByAadharNumber(Long aadharNumber);
    boolean existsByPanNumber(String panNumber);
	SuperAdmin findByEmailId(String emailId);
	SuperAdmin findByPassword(String password);
    
	
	    @Query("SELECT MAX(s.superAdminId) FROM SuperAdmin s")
	    String findMaxSuperAdminId();
		Optional<SuperAdmin> findTopByOrderBySuperAdminIdDesc();
}