package com.jaime.backend.service;

import com.jaime.backend.model.Match;
import com.jaime.backend.model.MatchEvent;
import com.jaime.backend.model.Player;
import com.jaime.backend.repository.MatchEventRepository;
import com.jaime.backend.repository.MatchRepository;
import com.jaime.backend.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchEventService {

    private final MatchEventRepository matchEventRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;

    public MatchEventService(
            MatchEventRepository matchEventRepository,
            MatchRepository matchRepository,
            PlayerRepository playerRepository
    ) {
        this.matchEventRepository = matchEventRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }

    public List<MatchEvent> getEventsByMatchId(Long matchId) {
        if (!matchRepository.existsById(matchId)) {
            throw new RuntimeException("Partido no encontrado");
        }

        return matchEventRepository.findByMatchIdOrderByMinuteAsc(matchId);
    }

    public MatchEvent createEvent(Long matchId, MatchEvent event, Long playerId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        event.setMatch(match);
        event.setPlayer(null);

        if (playerId != null) {
            Player player = playerRepository.findById(playerId)
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

            event.setPlayer(player);
        }

        return matchEventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        if (!matchEventRepository.existsById(eventId)) {
            throw new RuntimeException("Evento no encontrado");
        }

        matchEventRepository.deleteById(eventId);
    }
}