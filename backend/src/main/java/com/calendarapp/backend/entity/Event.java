package com.calendarapp.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Entity
@Table(name = "events")
@Getter
@Setter

public class Event {

    public enum Scope {
        PERSONAL, GROUP
    }

    public enum Status {
        PROPOSED, CONFIRMED, CANCELLED
    }

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column (name = "event_name", nullable = false)
    private String name;
    
    @Column (nullable = true)
    private String location; 

    @Column (nullable = true)
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Scope scope;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PROPOSED;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
}
