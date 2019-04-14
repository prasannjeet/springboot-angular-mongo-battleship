package com.prasannjeet.battleship.model;

import lombok.Data;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * Contains 64 instances of battlecell. Thus making it a battleboard. Currently not needed in the context of the
 * functionalities of this game. Can be used in future if further functionalities are added.
 */
@Data
public class BattleBoard {
    private BattleCell[][] battleCells;

    /**
     * Constructor initializing 64 instances of BattleCell class.
     */
    public BattleBoard() {
        battleCells = new BattleCell[8][8];
        for (int i = 0; i<8; i++) {
            for (int j = 0; j<8; j++)
                battleCells[i][j] = new BattleCell();
        }
    }
}
