package com.jaime.backend.service;

import com.jaime.backend.model.Match;
import com.jaime.backend.model.MatchEvent;
import com.jaime.backend.model.MatchEventType;
import com.jaime.backend.model.Player;
import com.jaime.backend.repository.MatchEventRepository;
import com.jaime.backend.repository.MatchRepository;
import com.jaime.backend.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public MatchEvent createEvent(
            Long matchId,
            MatchEvent event,
            Long playerId
    ) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        event.setMatch(match);
        event.setPlayer(null);

        if (playerId != null) {
            Player player = playerRepository.findById(playerId)
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

            event.setPlayer(player);
        }

        MatchEvent savedEvent = matchEventRepository.save(event);

        if (event.getType() == MatchEventType.GOAL) {
            boolean golPropio = playerId != null;
            actualizarMarcador(match, golPropio, 1);
        }

        return savedEvent;
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        MatchEvent event = matchEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        if (event.getType() == MatchEventType.GOAL) {
            boolean golPropio = event.getPlayer() != null;
            actualizarMarcador(event.getMatch(), golPropio, -1);
        }

        matchEventRepository.delete(event);
    }

    private void actualizarMarcador(
            Match match,
            boolean golPropio,
            int cambio
    ) {
        boolean sumaGolesLocal =
                (match.isLocal() && golPropio)
                        || (!match.isLocal() && !golPropio);

        if (sumaGolesLocal) {
            match.setGolesLocal(
                    Math.max(0, match.getGolesLocal() + cambio)
            );
        } else {
            match.setGolesVisitante(
                    Math.max(0, match.getGolesVisitante() + cambio)
            );
        }

        matchRepository.save(match);
    }
}