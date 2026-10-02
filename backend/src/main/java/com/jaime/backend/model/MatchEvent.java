package com.jaime.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "match_events")
public class MatchEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchEventType type;

    @Column(nullable = false)
    private Integer minute;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    private Integer rivalDorsal;

    private String description;

    public MatchEvent() {
    }

    public Long getId() {
        return id;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public MatchEventType getType() {
        return type;
    }

    public void setType(MatchEventType type) {
        this.type = type;
    }

    public Integer getMinute() {
        return minute;
    }

    public void setMinute(Integer minute) {
        this.minute = minute;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Integer getRivalDorsal() {
        return rivalDorsal;
    }

    public void setRivalDorsal(Integer rivalDorsal) {
        this.rivalDorsal = rivalDorsal;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}