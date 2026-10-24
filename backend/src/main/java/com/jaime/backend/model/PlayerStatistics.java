package com.jaime.backend.model;

public class PlayerStatistics {

    private final Long playerId;
    private final String playerName;
    private final int goals;
    private final int yellowCards;
    private final int redCards;

    public PlayerStatistics(
            Long playerId,
            String playerName,
            int goals,
            int yellowCards,
            int redCards
    ) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.goals = goals;
        this.yellowCards = yellowCards;
        this.redCards = redCards;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public int getGoals() {
        return goals;
    }

    public int getYellowCards() {
        return yellowCards;
    }

    public int getRedCards() {
        return redCards;
    }
}