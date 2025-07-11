package com.chiselon.login.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.chiselon.login.exception.CustomErrorDecoder;

import feign.Logger;
import feign.codec.ErrorDecoder;

@Configuration
public class OpenFeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
    
    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }
}
