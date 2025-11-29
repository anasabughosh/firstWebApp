package com.example.firstWebApp.services;

import com.example.firstWebApp.entities.Habit;
import com.example.firstWebApp.entities.HabitCompletion;
import com.example.firstWebApp.repository.HabitCompletionRepository;
import com.example.firstWebApp.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HabitService {

    private final HabitRepository habitRepo;
    private final HabitCompletionRepository completionRepo;

    public HabitService(HabitRepository habitRepo, HabitCompletionRepository completionRepo) {
        this.habitRepo = habitRepo;
        this.completionRepo = completionRepo;
    }

    // إضافة عادة جديدة
    public Habit addHabit(Habit habit) {
        return habitRepo.save(habit);
    }

    // تحديث عادة موجودة
    public Habit updateHabit(Habit habit) {
        Habit existing = habitRepo.findById(habit.getId())
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        existing.setName(habit.getName());
        existing.setDescription(habit.getDescription());
        existing.setFrequency(habit.getFrequency());
        existing.setTimesPerDay(habit.getTimesPerDay());
        existing.setActive(habit.isActive());
        return habitRepo.save(existing);
    }

    // حذف عادة
    public void deleteHabit(Long habitId) {
        if (!habitRepo.existsById(habitId)) {
            throw new RuntimeException("Habit not found");
        }
        habitRepo.deleteById(habitId);
    }

    // جلب العادات النشطة لمستخدم معين
    public List<Habit> getActiveHabits(Long userId) {
        return habitRepo.findByUserIdAndActiveTrue(userId);
    }

    // تسجيل إنجاز عادة في يوم معين
    public HabitCompletion markAsCompleted(Long habitId, LocalDate date) {
        Optional<HabitCompletion> existing = completionRepo.findByHabitIdAndCompletionDate(habitId, date);
        if (existing.isPresent()) return existing.get();

        Habit habit = habitRepo.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        HabitCompletion hc = new HabitCompletion();
        hc.setHabit(habit);
        hc.setCompletionDate(date);
        return completionRepo.save(hc);
    }

    // ✅ جلب عادة حسب الـ id
    public Habit getHabitById(Long habitId) {
        return habitRepo.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
    }

    // ✅ جلب كل إنجازات العادة
    public List<HabitCompletion> getHabitCompletions(Long habitId) {
        Habit habit = getHabitById(habitId);
        return habit.getCompletions();
    }
}
