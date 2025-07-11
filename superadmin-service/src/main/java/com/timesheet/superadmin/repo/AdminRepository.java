package com.timesheet.superadmin.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timesheet.superadmin.entity.AdminEntity;


@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, String>{

	Optional<AdminEntity> findByAdminId(String adminId);
    boolean existsByAdminId(String adminId);
    void deleteByAdminId(String adminId);
    AdminEntity findByEmailIdAndPassword(String emailId, String password);

    List<AdminEntity> findByFirstName(String firstName);

    boolean existsByEmailId(String emailId);
    boolean existsByMobileNumber(Long mobileNumber);
    boolean existsByAadharNumber(Long aadharNumber);
    boolean existsByPanNumber(String panNumber);
	AdminEntity findByEmailId(String emailId);
	AdminEntity findByPassword(String password);
	boolean existsByPassword(String password);
	Optional<AdminEntity> findTopByOrderByAdminIdDesc();
    


}
