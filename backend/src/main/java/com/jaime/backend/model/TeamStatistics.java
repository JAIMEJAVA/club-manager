package com.jaime.backend.model;

import java.util.List;

public class TeamStatistics {

    private final int totalMatches;
    private final int finishedMatches;
    private final int wins;
    private final int draws;
    private final int losses;
    private final int goalsFor;
    private final int goalsAgainst;
    private final List<PlayerStatistics> playerStatistics;

    public TeamStatistics(
            int totalMatches,
            int finishedMatches,
            int wins,
            int draws,
            int losses,
            int goalsFor,
            int goalsAgainst,
            List<PlayerStatistics> playerStatistics
    ) {
        this.totalMatches = totalMatches;
        this.finishedMatches = finishedMatches;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.goalsFor = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.playerStatistics = playerStatistics;
    }

    public int getTotalMatches() {
        return totalMatches;
    }

    public int getFinishedMatches() {
        return finishedMatches;
    }

    public int getWins() {
        return wins;
    }

    public int getDraws() {
        return draws;
    }

    public int getLosses() {
        return losses;
    }

    public int getGoalsFor() {
        return goalsFor;
    }

    public int getGoalsAgainst() {
        return goalsAgainst;
    }

    public List<PlayerStatistics> getPlayerStatistics() {
        return playerStatistics;
    }
}