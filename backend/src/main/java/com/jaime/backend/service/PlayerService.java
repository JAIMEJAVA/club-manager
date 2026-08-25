package com.jaime.backend.service;
import  com.jaime.backend.model.Player;
import java.util.List;
import org.springframework.stereotype.Service;
import java.util.ArrayList;



@Service
public class PlayerService {
private final List<Player> players = new ArrayList<>();
public PlayerService(){
    players.add(new Player (1L , "Jaime", 24, 9, "Delantero"));
    players.add(new Player (2L, "Carlos", 25, 6, "Mediocentro"));
    players.add(new Player (3L ,"Juan", 30, 2, "Defensa"));

}

    public List<Player> getPlayers() {
        return players;
    }

    public Player getPlayerById(Long id){
        return getPlayers()
                .stream()
                .filter(player -> player.getId().equals(id))
                .findFirst()
                .orElse(null);
    }


    public Player createPlayer (Player player){
    players.add(player);
    return player;
    }

    public Player updatePlayer(Long id, Player updatedPlayer) {

        Player player = getPlayerById(id);

        if (player == null) {
            return null;
        }

        player.setNombre(updatedPlayer.getNombre());
        player.setEdad(updatedPlayer.getEdad());
        player.setDorsal(updatedPlayer.getDorsal());
        player.setPosicion(updatedPlayer.getPosicion());

        return player;
    }


    public boolean deletePlayer (Long id){
    Player player = getPlayerById(id);
    if(player == null){
        return false;
    }
    players.remove(player);
    return true;
    }
    }
