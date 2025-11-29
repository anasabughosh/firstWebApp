package com.example.firstWebApp.repository;

import com.example.firstWebApp.entities.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserIdAndActiveTrue(Long userId);
}
