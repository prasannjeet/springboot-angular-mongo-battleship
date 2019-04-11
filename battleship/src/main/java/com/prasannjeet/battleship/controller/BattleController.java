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

@RestController
@RequestMapping("/api/v1/battle")
public class BattleController {

    private final Gson gson;
    private final GameInstanceRepository gameInstanceRepository;
    private final PlayerMatchesRepository playerMatchesRepository;

    @Autowired
    public BattleController(Gson gson, GameInstanceRepository gameInstanceRepository, PlayerMatchesRepository playerMatchesRepository) {
        this.gson = gson;
        this.gameInstanceRepository = gameInstanceRepository;
        this.playerMatchesRepository = playerMatchesRepository;
    }

    //to get all table value
    @RequestMapping(value = "/getAll")
    public String getAllItems() {
        System.out.println("get all");
        List<GameInstance> allItems = gameInstanceRepository.findAll();
        HashMap<String, String> returnItem = new HashMap<>();
        for (GameInstance theItem : allItems) {
            if (theItem.getWonGames() > 0) {
                returnItem.put(theItem.getUserName(), Integer.toString(theItem.getWonGames()));
            }
        }
        return gson.toJson(returnItem);
    }

    @RequestMapping(value ="/newgame/{username}")
    public GameModel initPlayer1 (@PathVariable String username) {
        GameModel gameModel = new GameModel(UUID.randomUUID().toString(), username);
        GameInstance gameInstance = new GameInstance(gameModel.getUserId(), username);
        gameModel = ModelConversion.convertGameInstance(gameModel, gameInstance);
        gameInstanceRepository.save(gameInstance);
        PlayerMatches playerMatches = new PlayerMatches(gameInstance.getUserId());
        playerMatchesRepository.save(playerMatches);
//        System.out.println(gson.toJson(playerMatchesRepository.findOneByPlayer1(gameInstance.getUserId())));
        String socketUrl = playerMatchesRepository.findOneByPlayer1(gameInstance.getUserId()).getWebSocketAddress();
        gameModel.setSocketUrl(socketUrl);
//        String json = gson.toJson(gameModel);
//        System.out.println(json);
//        String json2 = gson.toJson(gameInstance);
//        System.out.println(json2);
        return gameModel;
    }

    @SneakyThrows(NullPointerException.class)
    @RequestMapping(value = "/getUserName/{userId}")
    public String getUserName (@PathVariable String userId) {
        HashMap<String, String> userNameMap = new HashMap<>();
        userNameMap.put("userName", gameInstanceRepository.findOneByUserId(userId).getUserName());
        return gson.toJson(userNameMap);

    }

    @RequestMapping(value = "/getPlayer2Id/{sockId}")
    public String getPlayerTwoName(@PathVariable String sockId) {
        PlayerMatches playerMatches = playerMatchesRepository.findOneByWebSocketAddress(sockId);
//        System.out.println(gson.toJson(playerMatches));
        HashMap<String,String> userId = new HashMap<>();
        userId.put("userId", playerMatches.getPlayer2());
        return gson.toJson(userId);
    }
}
