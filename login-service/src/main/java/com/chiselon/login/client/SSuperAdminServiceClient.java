package com.chiselon.login.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.chiselon.login.model.SuperAdmin;
import com.chiselon.login.config.OpenFeignConfig;

@FeignClient(name = "ssuper-admin-service", configuration = OpenFeignConfig.class)
public interface SSuperAdminServiceClient {

    @GetMapping("/api/superadmins/validate")
    SuperAdmin validateSuperAdminCredentials(@RequestParam("emailId") String emailId,
                                             @RequestParam("password") String password);
}
