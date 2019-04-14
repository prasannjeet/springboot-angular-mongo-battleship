package com.prasannjeet.battleship.controller;

import com.google.gson.Gson;
import com.mongodb.util.JSON;
import com.prasannjeet.battleship.logics.ModelConversion;
import com.prasannjeet.battleship.model.*;
import com.prasannjeet.battleship.repository.GameInstanceRepository;
import com.prasannjeet.battleship.repository.PlayerMatchesRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Null;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * Class that primarily handles all the RESTful API calls from the Angular client.
 *
 */
@RestController
@RequestMapping("/api/v1/battle")
public class BattleController {

    /**
     * Used Gson to parse JSON Objects
     */
    private final Gson gson;
    
    /**
     * Repository instance of GameInstance Model
     */
    private final GameInstanceRepository gameInstanceRepository;
    
    /**
     * Repository instance of PlayerMatches Model
     */
    private final PlayerMatchesRepository playerMatchesRepository;

    @Autowired
    public BattleController(Gson gson, GameInstanceRepository gameInstanceRepository, PlayerMatchesRepository playerMatchesRepository) {
        this.gson = gson;
        this.gameInstanceRepository = gameInstanceRepository;
        this.playerMatchesRepository = playerMatchesRepository;
    }

    /**
     * This API endpoint us used by the Score-Table component to display the scores.
     * @return The details of all the users in the database who have won at least one game.
     */
    @RequestMapping(value = "/getAll")
    public String getAllItems() {
        List<GameInstance> allItems = gameInstanceRepository.findAll();
        HashMap<String, String[]> returnItem = new HashMap<>();
        for (GameInstance theItem : allItems) {
            if (theItem.getWonGames() > 0 || theItem.getLostGames() > 0) {
                returnItem.put(theItem.getUserName(), new String[] {Integer.toString(theItem.getWonGames()), Integer.toString(theItem.getLostGames())});
            }
        }
        return gson.toJson(returnItem);
    }

    /**
     * Thsi API endpoint is used by Battleboard1 component from Angular. It first creates a random UUID and assigns that as the unique user-id of the
     * player. Further, the Class GameInstance instantiates one of it's instance that contains a board with randomly distributed ships. This GameInstance
     * class is further simplified to another GameModel class that contains minimal information needed for Angular to display the ship positions. This
     * GameModel is then returned to the client.
     * @param username The username of Player 1.
     * @return The Game-Model POJO object containing the details of player 1.
     */
    @RequestMapping(value ="/newgame/{username}")
    public GameModel initPlayer1 (@PathVariable String username) {
        GameInstance gameInstance;
        GameModel gameModel = new GameModel(UUID.randomUUID().toString(), username);
        
        /** If the user already exists in the repository, it will be used. Otherwise a new
         * instance of the model GameInstance, and in turn GameModel will be generated and sent.
         */
        if (gameInstanceRepository.existsByUserName(username)){
            gameInstance = gameInstanceRepository.findOneByUserName(username);
            gameInstance = new GameInstance(gameModel.getUserId(), gameInstance.getUserName(), gameInstance.getWonGames(), gameInstance.getLostGames());
        }
        else {
            gameInstance = new GameInstance(gameModel.getUserId(), username);
        }
        gameModel = ModelConversion.convertGameInstance(gameModel, gameInstance);
        gameInstanceRepository.save(gameInstance);
        PlayerMatches playerMatches = new PlayerMatches(gameInstance.getUserId());
        playerMatchesRepository.save(playerMatches);
        String socketUrl = playerMatchesRepository.findOneByPlayer1(gameInstance.getUserId()).getWebSocketAddress();
        gameModel.setSocketUrl(socketUrl);
        return gameModel;
    }

    /**
     * This API endpoint is used by Battleboard Component in Angular. It takes in the User-ID of a Player and returns it's username using the 
     * GameInstance model. 
     * @param userId The user-id of a player
     * @return the userName of the player.
     */
    @SneakyThrows(NullPointerException.class)
    @RequestMapping(value = "/getUserName/{userId}")
    public String getUserName (@PathVariable String userId) {
        HashMap<String, String> userNameMap = new HashMap<>();
        userNameMap.put("userName", gameInstanceRepository.findOneByUserId(userId).getUserName());
        return gson.toJson(userNameMap);

    }
    
    /**
     * Used by Battleboard Component. As we know the PlayerMatches model contains the user-id of both Player1 and Player2,
     * As soon as Player1 realizes player 2 has joined the game (via Websockets), it means that Player 2 has been instantiated and the PlayerMatches model
     * now has a pair of user-id with the socket-id as it's primary key. Furthermore, since sock-id is already generated, Battleboard Component uses that
     * to request for the user-id of Player 2 here. This userId is then used in the getUserName() API above to find out the username. This username is then
     * displayed at the bottom of the screen of player 1.
     * @param sockId The unique sockId used to communicate between two players via webs sockets in the server.
     * @return The user-id of player 2.
     */
    @RequestMapping(value = "/getPlayer2Id/{sockId}")
    public String getPlayerTwoName(@PathVariable String sockId) {
        PlayerMatches playerMatches = playerMatchesRepository.findOneByWebSocketAddress(sockId);
        HashMap<String,String> userId = new HashMap<>();
        userId.put("userId", playerMatches.getPlayer2());
        return gson.toJson(userId);
    }
}
