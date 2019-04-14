package com.prasannjeet.battleship.model;

import lombok.Data;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * The ship class that contains the shp name, the ship size and the number of times the ship was attacked. If the
 * attack count equals the ship size, it means that the ship is destroyed completely. It also contains the ship
 * coordinates variable that contains the coordinates where the ship is placed in a board.
 */
@Data
public class Ship {

    /**
     * Enum of ship names.
     */
    public enum ShipNameList {
        CARRIER, CRUISER, SUBMARINE, DESTROYER, ATTACKER
    }

    /**
     * Size of the ship.
     */
    private int size;

    /**
     * Coordinates in the board where ship is placed.
     */
    private int[] coordinates;

    /**
     * Number of times the ship was attacked.
     */
    private int attackCount;

    /**
     * Name of the ship, from the ship enum defined above.
     */
    private ShipNameList shipName;

    /**
     * A basic constructor that initializes the class. The coordinates are set to 0.
     * @param size The size of the ship.
     * @param shipName The ship name.
     */
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
