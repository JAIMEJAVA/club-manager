package com.jaime.backend.controller;

import com.jaime.backend.model.MatchEvent;
import com.jaime.backend.service.MatchEventService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches/{matchId}/events")
@CrossOrigin(origins = "http://localhost:5173")
public class MatchEventController {

    private final MatchEventService matchEventService;

    public MatchEventController(MatchEventService matchEventService) {
        this.matchEventService = matchEventService;
    }

    @GetMapping
    public List<MatchEvent> getEventsByMatchId(
            @PathVariable("matchId") Long matchId
    ) {
        return matchEventService.getEventsByMatchId(matchId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatchEvent createEvent(
            @PathVariable("matchId") Long matchId,
            @RequestParam(name = "playerId", required = false) Long playerId,
            @RequestBody MatchEvent event
    ) {
        return matchEventService.createEvent(matchId, event, playerId);
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(
            @PathVariable("eventId") Long eventId
    ) {
        matchEventService.deleteEvent(eventId);
    }
}