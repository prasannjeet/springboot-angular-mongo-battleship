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

/**
 * @author Prasannjeet <strong>Description: </strong>
 * Class that primarily deals with WebSocket controllers.
 */
@Controller
@RestController
public class WebSocketController {

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
    
    /**
     * Used to send error message to client.
     */
    private final SimpMessageSendingOperations messagingTemplate;

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

    /**
     * This API endpoint initializes player 2. It is called when the URL generated after Player 1
     * is initialized is called by Player 2 in another browser. <em>Note that this endpoint
     * should be present in the <strong>BattleController</strong> controller class. This will be
     * updated in future updates.</em>
     * @param username The username of Player 2 after the player enters it in the welcome form.
     * @param socketUrl The Socket-ID or unique ID from PlayerMatches model.
     * @return The GameModel POJO class containing all the details about Player 2, including the 
     * ship positions.
     */
    @RequestMapping(value ="/playWithFriend/{username}/{socketUrl}")
    @SneakyThrows(Exception.class)
    public GameModel initPlayer2 (@PathVariable String username, @PathVariable String socketUrl) {
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

        PlayerMatches playerMatches = playerMatchesRepository.findOneByWebSocketAddress(socketUrl);
        playerMatches.setPlayer2(gameModel.getUserId());
        playerMatchesRepository.save(playerMatches);
        return gameModel;
    }

    /**
     * This is the main endpoint that handles all the WebSocket connections. It receives the
     * Socket-Id from the URL, and the message from WebSocket payload.
     * <ul>
     *     <li>If the message body contains <i>start,</i> it's an indication by Player 2 that it has initialized
     *     it's board and is ready to play. At this stage, Player 1 requests the username of Player 2 from
     *     another RESTful API endpoint.</li>
     *     <li>If it does not contain the <i>start</i> message, it'll then contain the coordinate of the BattleBoard
     *     where the player attacked. Whether it was player 1, or player 2 is identified by the html coordinate-id.
     *     Once identified the other player is attacked and the based on the attack position, i.e. if it contains a
     *     ship, or if it is a blank coordinate, or if this attack resulted in a win, etc., an appropriate response
     *     is generated and sent to the client.</li>
     * </ul>
     * 
     * @param message Message received from the client regarding the game proceedings.
     * @param socketId The unique Id from the PlayerMatches model that is used as Socket-Id
     * for WebSockets connection.
     * @return Response to the incoming message. Varies and is based on the type of message
     * received.
     * @throws Exception In case there are any exceptions that are not yet handled.
     */
    @SneakyThrows(NullPointerException.class)
    @MessageMapping("/message/{id}")
    @SendTo("/topic/reply/{id}")
    public String processMessageFromClient(@Payload String message, @DestinationVariable("id") String socketId) throws Exception {
        String messageBody = gson.fromJson(message, Map.class).get("name").toString();
        String textPart = "", numberPart = "";
        String playerId = "";
        boolean isPlayerOne = false;
        if (!(messageBody.equals("start"))) {
            textPart = messageBody.replaceAll("\\d","");
            numberPart = messageBody.replace(textPart, "");
            HashMap<String, String> tempHashMap = new HashMap<>();
            if (textPart.equals("potheir")) {
                playerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer2();
                tempHashMap.put("turnBy", "p1");
                isPlayerOne = true;
            }
            else if (textPart.equals("pttheir")) {
                playerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1();
                tempHashMap.put("turnBy", "p2");
                isPlayerOne = false;
            }
            GameInstance gameInstance = gameInstanceRepository.findOneByUserId(playerId);
            boolean isContainsShip = gameInstance.enemyTurn(Integer.parseInt(numberPart));
            boolean winningMove = gameInstance.getAttackedShips() >= 15;
            tempHashMap.put("attackedAt", numberPart);
            tempHashMap.put("isContainsShip", String.valueOf(isContainsShip));
            tempHashMap.put("winningMove", String.valueOf(winningMove));
            gameInstanceRepository.save(gameInstance);

            String wonPlayerId, lostPlayerId;
            if (gameInstance.getAttackedShips() >= 15){
                if (isPlayerOne) {
                    wonPlayerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1();
                    lostPlayerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer2();
                } else  {
                    wonPlayerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer1();
                    lostPlayerId = playerMatchesRepository.findOneByWebSocketAddress(socketId).getPlayer2();
                }

                GameInstance wonGameInstance = gameInstanceRepository.findOneByUserId(wonPlayerId);
                GameInstance lostGameInstance = gameInstanceRepository.findOneByUserId(lostPlayerId);

                wonGameInstance.setWonGames(wonGameInstance.getWonGames() + 1);
                lostGameInstance.setLostGames(lostGameInstance.getLostGames() +1);

                gameInstanceRepository.save(wonGameInstance);
                gameInstanceRepository.save(lostGameInstance);
            }


            return gson.toJson(tempHashMap);
        }
        return new Gson().fromJson(message, Map.class).get("name").toString();
    }

    /**
     * This endpoint sends an error message in case there is any error or exception.
     * @param exception The Exception Message
     * @return The error message
     */
    @MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
        return exception.getMessage();
    }

}