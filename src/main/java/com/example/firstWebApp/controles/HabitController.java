package com.example.firstWebApp.controles;

import com.example.firstWebApp.entities.Habit;
import com.example.firstWebApp.entities.HabitCompletion;
import com.example.firstWebApp.services.HabitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin("*")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    // إضافة عادة
    @PostMapping("/add")
    public ResponseEntity<?> addHabit(@RequestBody Habit habit) {
        try {
            Habit savedHabit = habitService.addHabit(habit);
            return ResponseEntity.ok(savedHabit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // تحديث عادة
    @PutMapping("/update")
    public ResponseEntity<?> updateHabit(@RequestBody Habit habit) {
        try {
            Habit updatedHabit = habitService.updateHabit(habit);
            return ResponseEntity.ok(updatedHabit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // حذف عادة
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteHabit(@PathVariable Long id) {
        try {
            habitService.deleteHabit(id);
            return ResponseEntity.ok(Map.of("status", "deleted", "message", "تم الحذف بنجاح"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // جلب عادات مستخدم
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserHabits(@PathVariable Long userId) {
        try {
            List<Habit> habits = habitService.getActiveHabits(userId);

            List<Map<String, Object>> simpleHabits = habits.stream().map(habit -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", habit.getId());
                map.put("name", habit.getName());
                map.put("description", habit.getDescription() != null ? habit.getDescription() : "");
                map.put("frequency", habit.getFrequency().toString());
                map.put("timesPerDay", habit.getTimesPerDay() != null ? habit.getTimesPerDay() : 0);
                map.put("active", habit.isActive());
                return map;
            }).toList();

            return ResponseEntity.ok(simpleHabits);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // تسجيل الإنجاز
    @PostMapping("/{habitId}/complete")
    public ResponseEntity<?> markCompleted(@PathVariable Long habitId) {
        try {
            HabitCompletion completion = habitService.markAsCompleted(habitId, LocalDate.now());
            Map<String, Object> response = new HashMap<>();
            response.put("id", completion.getId());
            response.put("completionDate", completion.getCompletionDate());
            response.put("habitId", completion.getHabit().getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ جلب كل إنجازات العادة (للواجهة فقط، بدون تعديل قاعدة البيانات)
    @GetMapping("/{habitId}/completions")
    public ResponseEntity<?> getHabitCompletions(@PathVariable Long habitId) {
        try {
            List<HabitCompletion> completions = habitService.getHabitCompletions(habitId);
            List<String> dates = completions.stream()
                    .map(hc -> hc.getCompletionDate().toString())
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dates);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // اختبار API
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("status", "running", "message", "API is working"));
    }
}
