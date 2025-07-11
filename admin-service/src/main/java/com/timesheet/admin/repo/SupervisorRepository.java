package com.timesheet.admin.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.timesheet.admin.entity.Supervisor;



@Repository
public interface SupervisorRepository extends JpaRepository<Supervisor, String>{

	
	 List<Supervisor> findByfirstName(String firstName);

	 Supervisor findByemailId(String emailId);
	 Supervisor findBymobileNumber(long mobileNumber);
	 Supervisor findByaadharNumber(long aadharNumber);
	 Supervisor findBypanNumber(String panNumber);
}
