package com.create.project.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.create.project.entity.AdminEntity;



@FeignClient(name = "superadmin-service")
public interface SuperAdminServiceClient {

    @GetMapping("/api/admins/permissions/{adminId}")
    AdminEntity getPermissions(@PathVariable("adminId") String adminId);
}