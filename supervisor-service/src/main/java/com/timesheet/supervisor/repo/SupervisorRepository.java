package com.timesheet.supervisor.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.timesheet.supervisor.entity.Supervisor;

public interface SupervisorRepository extends JpaRepository<Supervisor, String> {

	Optional<Supervisor> findByEmailIdAndPassword(String emailId, String password);

	Supervisor findSupervisorByEmailId(String emailId);

	Supervisor findSupervisorByPassword(String password);

	Supervisor findSupervisorByEmailIdAndPassword(String emailId, String password);

	Optional<Supervisor> findByEmailId(String emailId);

	Optional<Supervisor> findByAadharNumber(Long aadharNumber);

	Optional<Supervisor> findByMobileNumber(Long mobileNumber);

	Optional<Supervisor> findByPanNumber(String panNumber);

	Optional<Supervisor> findTopByOrderBySupervisorIdDesc();

	Optional<Supervisor> findBySupervisorId(String supervisorId);
}
