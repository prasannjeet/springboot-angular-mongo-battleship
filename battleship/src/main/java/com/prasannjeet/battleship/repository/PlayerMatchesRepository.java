package com.prasannjeet.battleship.repository;

import com.prasannjeet.battleship.model.PlayerMatches;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlayerMatchesRepository extends MongoRepository<PlayerMatches, String> {
//    public PlayerMatches findTopByOrderByCreatedTime();
    public PlayerMatches findOneByPlayer1(String player1);
    public PlayerMatches findOneByWebSocketAddress(String webSocketAddress);
}
