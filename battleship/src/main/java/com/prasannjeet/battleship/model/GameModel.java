package com.prasannjeet.battleship.model;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Data
public class GameModel {
    //    @GeneratedValue(strategy = GenerationType.AUTO)

    String userId;
    @Id String userName;
    String socketUrl;
    List<Integer> attackedByEnemyCoordinates;
    HashMap<Integer, Boolean> attackedCoordinates;
    HashMap<Ship.ShipNameList, int[]> shipPositions;
    boolean won;

    public GameModel(String userId, String userName) {
        this.userId = userId;
        this.userName = userName;
        attackedByEnemyCoordinates = new ArrayList<>();
        attackedCoordinates = new HashMap<>();
        shipPositions = new HashMap<>();
        this.won = false;
    }
}
