package com.prasannjeet.battleship.model;

import lombok.Data;

@Data
public class Ship {
    public enum ShipNameList {
        CARRIER, CRUISER, SUBMARINE, DESTROYER, ATTACKER
    }

    private int size;
    private int[] coordinates;
    private int attackCount;
    private ShipNameList shipName;

    public Ship (int size, ShipNameList shipName) {
        this.size = size;
        this.attackCount = 0;
        coordinates = new int[size];
        for (int i = 0; i<size; i++) {
            coordinates[i] = 0;
        }
        this.shipName = shipName;
    }
}
