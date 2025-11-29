package com.example.firstWebApp.controles;

import com.example.firstWebApp.entities.User;
import com.example.firstWebApp.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;

    // Constructor
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> req) {
        boolean ok = userService.register(req.get("email"), req.get("password"));
        return Map.of("status", ok ? "created" : "exists");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        User user = userService.login(req.get("email"), req.get("password"));

        if (user == null)
            return Map.of("error", "Invalid credentials");

        return Map.of(
                "status", "success",
                "userId", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName() != null ? user.getFullName() : ""
        );
    }
}
