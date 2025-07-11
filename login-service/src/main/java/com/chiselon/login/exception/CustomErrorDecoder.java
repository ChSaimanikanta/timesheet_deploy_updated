package com.chiselon.login.exception;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.io.InputStream;

public class CustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultErrorDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        HttpStatus status = HttpStatus.valueOf(response.status());

        String responseBody = "";
        try (InputStream bodyIs = response.body().asInputStream()) {
            responseBody = new String(bodyIs.readAllBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        switch (status) {
            case UNAUTHORIZED:
                if (responseBody.contains("Both email ID and password are incorrect.")) {
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Both email ID and password are invalid.");
                } else {
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Password.");
                }
            case NOT_FOUND:
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid EmailID ");
            default:
                return defaultErrorDecoder.decode(methodKey, response);
        }
    }
}
