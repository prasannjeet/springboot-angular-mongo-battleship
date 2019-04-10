package com.prasannjeet.battleship.repository;

import com.prasannjeet.battleship.model.GameInstance;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GameInstanceRepository extends MongoRepository<GameInstance, String> {
    public GameInstance findOneByUserId(String userId);
}
