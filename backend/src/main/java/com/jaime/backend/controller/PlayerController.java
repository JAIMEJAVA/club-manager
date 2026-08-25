package com.jaime.backend.controller;

import ch.qos.logback.classic.jul.JULHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jaime.backend.model.Player;
import java.util.List;
import com.jaime.backend.service.PlayerService;
import  org.springframework.web.bind.annotation.PathVariable;
import  org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;




@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService playerService;
    public PlayerController(PlayerService playerService){
        this.playerService = playerService;
    }



    @GetMapping
    public List<Player> getPlayers() {
    return playerService.getPlayers();
    }




    @GetMapping("/{id}")
  public ResponseEntity<Player> getPlayerById(@PathVariable Long id){
        Player player = playerService.getPlayerById(id);
        if(player == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(player);
    }

    @PostMapping
    public Player createPlayer(@RequestBody Player player ) {
        return playerService.createPlayer(player);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(
            @PathVariable Long id,
            @RequestBody Player updatedPlayer) {

        Player player = playerService.updatePlayer(id, updatedPlayer);

        if (player == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(player);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {

        boolean deleted = playerService.deletePlayer(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }




}
