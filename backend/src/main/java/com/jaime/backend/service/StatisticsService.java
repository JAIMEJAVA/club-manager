package com.jaime.backend.service;

import com.jaime.backend.model.Match;
import com.jaime.backend.model.MatchEvent;
import com.jaime.backend.model.MatchEventType;
import com.jaime.backend.model.MatchStatus;
import com.jaime.backend.model.Player;
import com.jaime.backend.model.PlayerStatistics;
import com.jaime.backend.model.TeamStatistics;
import com.jaime.backend.repository.MatchEventRepository;
import com.jaime.backend.repository.MatchRepository;
import com.jaime.backend.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    private final MatchRepository matchRepository;
    private final MatchEventRepository matchEventRepository;
    private final PlayerRepository playerRepository;

    public StatisticsService(
            MatchRepository matchRepository,
            MatchEventRepository matchEventRepository,
            PlayerRepository playerRepository
    ) {
        this.matchRepository = matchRepository;
        this.matchEventRepository = matchEventRepository;
        this.playerRepository = playerRepository;
    }

    public TeamStatistics getTeamStatistics() {
        List<Match> matches = matchRepository.findAll();
        List<MatchEvent> events = matchEventRepository.findAll();
        List<Player> players = playerRepository.findAll();

        int finishedMatches = 0;
        int wins = 0;
        int draws = 0;
        int losses = 0;
        int goalsFor = 0;
        int goalsAgainst = 0;

        for (Match match : matches) {
            int teamGoals = match.isLocal()
                    ? match.getGolesLocal()
                    : match.getGolesVisitante();

            int rivalGoals = match.isLocal()
                    ? match.getGolesVisitante()
                    : match.getGolesLocal();

            goalsFor += teamGoals;
            goalsAgainst += rivalGoals;

            if (match.getEstado() == MatchStatus.FINALIZADO) {
                finishedMatches++;

                if (teamGoals > rivalGoals) {
                    wins++;
                } else if (teamGoals == rivalGoals) {
                    draws++;
                } else {
                    losses++;
                }
            }
        }

        Map<Long, Integer> goalsByPlayer = new HashMap<>();
        Map<Long, Integer> yellowCardsByPlayer = new HashMap<>();
        Map<Long, Integer> redCardsByPlayer = new HashMap<>();

        for (Player player : players) {
            goalsByPlayer.put(player.getId(), 0);
            yellowCardsByPlayer.put(player.getId(), 0);
            redCardsByPlayer.put(player.getId(), 0);
        }

        for (MatchEvent event : events) {
            Player player = event.getPlayer();

            if (player == null) {
                continue;
            }

            Long playerId = player.getId();

            if (event.getType() == MatchEventType.GOAL) {
                goalsByPlayer.put(
                        playerId,
                        goalsByPlayer.get(playerId) + 1
                );
            }

            if (event.getType() == MatchEventType.YELLOW_CARD) {
                yellowCardsByPlayer.put(
                        playerId,
                        yellowCardsByPlayer.get(playerId) + 1
                );
            }

            if (event.getType() == MatchEventType.RED_CARD) {
                redCardsByPlayer.put(
                        playerId,
                        redCardsByPlayer.get(playerId) + 1
                );
            }
        }

        List<PlayerStatistics> playerStatistics = new ArrayList<>();

        for (Player player : players) {
            playerStatistics.add(
                    new PlayerStatistics(
                            player.getId(),
                            player.getNombre(),
                            goalsByPlayer.get(player.getId()),
                            yellowCardsByPlayer.get(player.getId()),
                            redCardsByPlayer.get(player.getId())
                    )
            );
        }

        playerStatistics.sort(
                Comparator.comparingInt(PlayerStatistics::getGoals)
                        .reversed()
                        .thenComparing(PlayerStatistics::getPlayerName)
        );

        return new TeamStatistics(
                matches.size(),
                finishedMatches,
                wins,
                draws,
                losses,
                goalsFor,
                goalsAgainst,
                playerStatistics
        );
    }
}