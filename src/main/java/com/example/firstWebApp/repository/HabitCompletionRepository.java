package com.example.firstWebApp.repository;

import com.example.firstWebApp.entities.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;



    public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
        Optional<HabitCompletion> findByHabitIdAndCompletionDate(Long habitId, LocalDate date);
    }


