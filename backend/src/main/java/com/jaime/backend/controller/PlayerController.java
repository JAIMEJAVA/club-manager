package com.jaime.backend.controller;

import ch.qos.logback.classic.jul.JULHelper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jaime.backend.model.Player;
import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @GetMapping
    public List <Player> getPlayers(){
        Player jugador = new Player("Jaime", 24, 9, "Delantero");
        Player jugador1 = new Player("Carlos",25, 6, "Mediocentro");
        Player jugador2 = new Player("Juan",30, 2, "Defensa");

        return List.of(jugador, jugador1, jugador2);

    }
}
