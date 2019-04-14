package com.prasannjeet.battleship.model;

import lombok.Data;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * Class for one cell in the battleship board game.
 */
@Data
public class BattleCell {

    /**
     * If this cell is attacked by enemy.
     */
    private boolean attackedByEnemy;

    /**
     * If the player has attacked the enemy's board in this cell.
     */
    private boolean attackedToEnemy;

    /**
     * If this cell contains a ship.
     */
    private boolean containsEnemyShip;

    /**
     * If this cell contains a ship in enemy's board. This value is updated only after player attacks a cell and
     * realizes that that cell contains an enemy ship.
     */
    private boolean containsShip;

    /**
     * Name of the ship that is located  in that cell.
     */
    private Ship.ShipNameList shipName;

    /**
     * Constructor initializing everything with <i>false.</i>. This values update in game time.
     */
    public BattleCell() {
        this.attackedByEnemy = false;
        this.containsShip = false;
        this.attackedToEnemy = false;
        this.containsEnemyShip = false;
    }
}
