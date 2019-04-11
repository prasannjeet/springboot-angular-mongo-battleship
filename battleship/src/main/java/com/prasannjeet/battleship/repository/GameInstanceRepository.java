package com.prasannjeet.battleship.repository;

import com.prasannjeet.battleship.model.GameInstance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GameInstanceRepository extends MongoRepository<GameInstance, String> {
    public GameInstance findOneByUserId(String userId);
    public List<GameInstance> findAll();
}
