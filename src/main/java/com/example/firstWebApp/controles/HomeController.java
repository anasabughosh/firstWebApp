package com.example.firstWebApp.controles;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        // Spring Boot سيبحث عن ملف login.html في /static
        return "redirect:/login.html";
    }
}
