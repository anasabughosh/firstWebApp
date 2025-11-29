package com.example.firstWebApp.services;

import com.example.firstWebApp.entities.User;
import com.example.firstWebApp.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepo;

    // Constructor
    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // تسجيل مستخدم جديد مع تحويل البريد للحروف الصغيرة
    public boolean register(String email, String password) {
        if (userRepo.findByEmailIgnoreCase(email).isPresent()) {
            return false; // الحساب موجود
        }

        User u = new User();
        u.setEmail(email.toLowerCase());
        u.setPassword(password);
        userRepo.save(u);
        return true;
    }

    // تسجيل دخول مع تحويل البريد للحروف الصغيرة
    public User login(String email, String password) {
        return userRepo.findByEmailIgnoreCase(email)
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }
}