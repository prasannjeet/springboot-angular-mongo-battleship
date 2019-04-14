package com.prasannjeet.battleship.repository;

import com.prasannjeet.battleship.model.PlayerMatches;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * Repository that extends mongo repository. Contains query methods.
 */
public interface PlayerMatchesRepository extends MongoRepository<PlayerMatches, String> {

    /**
     * Finds one entry of player matches by the user id of player 1.
     * @param player1 The user id of player 1.
     * @return The playerMatches instance containing the player 1.
     */
    public PlayerMatches findOneByPlayer1(String player1);

    /**
     * Finds one entry of player matches by the socket address, which is the unique id for this model.
     * @param webSocketAddress The primary key, or socket id.
     * @return The PlayerMatches instance containing the socket id.
     */
    public PlayerMatches findOneByWebSocketAddress(String webSocketAddress);
}
