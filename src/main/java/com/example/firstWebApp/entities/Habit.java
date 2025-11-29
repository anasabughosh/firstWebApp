package com.example.firstWebApp.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    private HabitFrequency frequency;

    private Integer timesPerDay; // فقط إذا frequency = CUSTOM

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL)
    private List<HabitCompletion> completions;

    public Habit() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public HabitFrequency getFrequency() { return frequency; }
    public void setFrequency(HabitFrequency frequency) { this.frequency = frequency; }

    public Integer getTimesPerDay() { return timesPerDay; }
    public void setTimesPerDay(Integer timesPerDay) { this.timesPerDay = timesPerDay; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<HabitCompletion> getCompletions() { return completions; }
    public void setCompletions(List<HabitCompletion> completions) { this.completions = completions; }
}
