package com.prasannjeet.battleship.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.google.gson.Gson;
import com.prasannjeet.battleship.logics.ModelConversion;
import com.prasannjeet.battleship.model.GameInstance;
import com.prasannjeet.battleship.model.GameModel;
import com.prasannjeet.battleship.model.PlayerMatches;
import com.prasannjeet.battleship.repository.GameInstanceRepository;
import com.prasannjeet.battleship.repository.PlayerMatchesRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
public class WebSocketController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final Gson gson;
    private final GameInstanceRepository gameInstanceRepository;
    private final PlayerMatchesRepository playerMatchesRepository;

    @Autowired
    public WebSocketController(SimpMessageSendingOperations messagingTemplate,
                               Gson gson,
                               GameInstanceRepository gameInstanceRepository,
                               PlayerMatchesRepository playerMatchesRepository) {
        this.messagingTemplate = messagingTemplate;
        this.gson = gson;
        this.gameInstanceRepository = gameInstanceRepository;
        this.playerMatchesRepository = playerMatchesRepository;
    }

    @RequestMapping(value ="/playWithFriend/{username}/{socketUrl}")
    @SneakyThrows(Exception.class)
    public GameModel read (@PathVariable String username, @PathVariable String socketUrl) {
        GameModel gameModel = new GameModel(UUID.randomUUID().toString(), username);
        GameInstance gameInstance = new GameInstance(gameModel.getUserId(), username);
        gameModel = ModelConversion.convertGameInstance(gameModel, gameInstance);
        gameInstanceRepository.save(gameInstance);

        PlayerMatches playerMatches = playerMatchesRepository.findOneByWebSocketAddress(socketUrl);
        playerMatches.setPlayer2(gameModel.getUserId());
        playerMatchesRepository.save(playerMatches);
        return gameModel;
    }

//    @MessageMapping("/message")
//    @SendTo("/topic/reply")
//    public String processMessageFromClient(@Payload String message) throws Exception {
//        String name = new Gson().fromJson(message, Map.class).get("name").toString();
//        return name;
//    }

    @SneakyThrows(NullPointerException.class)
    @MessageMapping("/message/{id}")
    @SendTo("/topic/reply/{id}")
    public String processMessageFromClient2(@Payload String message, @DestinationVariable("id") String socketId) throws Exception {
        String messageBody = gson.fromJson(message, Map.class).get("name").toString();
        String textPart = "", numberPart = "";
        String playerId = "";
        boolean isPlayerOne = false;
        System.out.println("debug: "+socketId);
        if (!(messageBody.equals("start") || messageBody.equals("won") || messageBody.equals("lost"))) {
            System.out.println("one");
            textPart = messageBody.replaceAll("\\d","");
            numberPart = messageBody.replace(textPart, "");
            HashMap<String, String> tempHashMap = new HashMap<>();
//            System.out.println("main debug: "+textPart);
            if (textPart.equals("potheir")) {
//                System.out.println("two");
//                if (playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1() == null)
//                    System.out.println("three");
                playerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer2();
                tempHashMap.put("turnBy", "p1");
                isPlayerOne = true;
            }
            else if (textPart.equals("pttheir")) {
//                if (playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer2() == null)
//                    System.out.println("four");
                playerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1();
//                System.out.println("p2 "+playerId);
//                System.out.println("p1 "+playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1());
                tempHashMap.put("turnBy", "p2");
                isPlayerOne = false;
            }
//            if (gameInstanceRepository.findOneByUserId(playerId) == null) System.out.println("five");
            GameInstance gameInstance = gameInstanceRepository.findOneByUserId(playerId);
            boolean isContainsShip = gameInstance.enemyTurn(Integer.parseInt(numberPart));
            tempHashMap.put("attackedAt", numberPart);
            tempHashMap.put("isContainsShip", String.valueOf(isContainsShip));
            tempHashMap.put("winningMove", String.valueOf(gameInstance.getAttackedShips() >= 15));
            gameInstanceRepository.save(gameInstance);

            if (gameInstance.getAttackedShips() >= 15){
                if (isPlayerOne) {
                    playerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1();
                } else  {
                    playerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer2();
                }
                gameInstance = gameInstanceRepository.findOneByUserId(playerId);
                gameInstance.setWonGames(gameInstance.getWonGames() + 1);
                gameInstanceRepository.save(gameInstance);
            }

            return gson.toJson(tempHashMap);
        }
//        System.out.println("TEST1: "+textPart+" "+"TEST2 "+numberPart);
        return new Gson().fromJson(message, Map.class).get("name").toString();
    }

    @MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
        return exception.getMessage();
    }

}