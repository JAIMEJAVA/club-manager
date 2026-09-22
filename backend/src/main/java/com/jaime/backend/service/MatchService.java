package com.jaime.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jaime.backend.model.Match;
import com.jaime.backend.repository.MatchRepository;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    public List<Match> getMatches() {
        return matchRepository.findAll();
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id).orElse(null);
    }

    public Match createMatch(Match match) {
        return matchRepository.save(match);
    }

    public Match updateMatch(Long id, Match updatedMatch) {
        Match match = getMatchById(id);

        if (match == null) {
            return null;
        }

        match.setRival(updatedMatch.getRival());
        match.setFecha(updatedMatch.getFecha());
        match.setLocal(updatedMatch.isLocal());
        match.setGolesLocal(updatedMatch.getGolesLocal());
        match.setGolesVisitante(updatedMatch.getGolesVisitante());
        match.setEstado(updatedMatch.getEstado());

        return matchRepository.save(match);
    }

    public boolean deleteMatch(Long id) {
        if (!matchRepository.existsById(id)) {
            return false;
        }

        matchRepository.deleteById(id);
        return true;
    }
}
