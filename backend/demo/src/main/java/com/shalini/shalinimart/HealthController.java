package com.shalini.shalinimart;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
