package com.prasannjeet.battleship.model;

import lombok.Data;

@Data
public class BattleBoard {
    private BattleCell[][] battleCells;

    public BattleBoard() {
        battleCells = new BattleCell[8][8];
        for (int i = 0; i<8; i++) {
            for (int j = 0; j<8; j++)
                battleCells[i][j] = new BattleCell();
        }
    }
}
