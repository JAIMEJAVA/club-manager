package com.jaime.backend.controller;

import com.jaime.backend.model.TeamStatistics;
import com.jaime.backend.service.StatisticsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:5173")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public TeamStatistics getTeamStatistics() {
        return statisticsService.getTeamStatistics();
    }
}