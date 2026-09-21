package com.jaime.backend.service;
import  com.jaime.backend.model.Player;
import java.util.List;
import org.springframework.stereotype.Service;
import com.jaime.backend.repository.PlayerRepository;


@Service
public class PlayerService {
    private final PlayerRepository playerRepository;
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }


    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id).orElse(null);
    }


    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player updatePlayer(Long id, Player updatedPlayer) {
        Player player = getPlayerById(id);
        if(player  == null) {
        return null;
        }
        player.setNombre(updatedPlayer.getNombre());
        player.setEdad(updatedPlayer.getEdad());
        player.setDorsal(updatedPlayer.getDorsal());
        player.setPosicion(updatedPlayer.getPosicion());

        return playerRepository.save(player);

    }


    public boolean deletePlayer(Long id){
    if (!playerRepository.existsById(id)){
        return false;    
    }        
    playerRepository.deleteById(id);
    return  true;
    }
    }
