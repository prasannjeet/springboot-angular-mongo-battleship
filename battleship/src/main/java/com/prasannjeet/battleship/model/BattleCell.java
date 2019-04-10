package com.prasannjeet.battleship.model;

import lombok.Data;

@Data
public class BattleCell {
    private boolean attackedByEnemy;
    private boolean attackedToEnemy;
    private boolean containsEnemyShip;
    private boolean containsShip;
    private Ship.ShipNameList shipName;

    public BattleCell() {
        this.attackedByEnemy = false;
        this.containsShip = false;
        this.attackedToEnemy = false;
        this.containsEnemyShip = false;
    }
}
