package com.create.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.create.project.entity.Supervisor;

@Repository
public interface SupervisorRepository extends JpaRepository<Supervisor, String>{

}
