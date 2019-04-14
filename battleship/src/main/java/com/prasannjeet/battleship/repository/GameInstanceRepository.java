package com.prasannjeet.battleship.repository;

import com.prasannjeet.battleship.model.GameInstance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * Repository that extends mongo repository. Contains query methods.
 */
public interface GameInstanceRepository extends MongoRepository<GameInstance, String> {

    /**
     * Finds one GameInstance by the User Id
     * @param userId User-Id of a player
     * @return GameInstance
     */
    public GameInstance findOneByUserId(String userId);

    /**
     * Finds all the GameInstance entries for score table.
     * @return List of all Game Instance entries.
     */
    public List<GameInstance> findAll();

    /**
     * Finds if a username exists in the repository.
     * @param userName The username of player.
     * @return Boolean value whether the user exists.
     */
    public boolean existsByUserName(String userName);

    /**
     * Finds one entry by the Username of the player.
     * @param username The username of player.
     * @return The game instance of the user.
     */
    public GameInstance findOneByUserName(String username);
}
