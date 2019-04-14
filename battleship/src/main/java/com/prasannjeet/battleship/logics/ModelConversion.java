package com.prasannjeet.battleship.logics;

import com.prasannjeet.battleship.model.BattleCell;
import com.prasannjeet.battleship.model.GameInstance;
import com.prasannjeet.battleship.model.GameModel;
import com.prasannjeet.battleship.model.Ship;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

/**
 * @author Prasannjeet <strong>Description: </strong>
 * The class that converts <i>GameInstance</i> model to the <i>GameModel</i> POJO Class.
 */
public class ModelConversion {

    /**
     * Converts <i>GameInstance</i> model to the <i>GameModel</i> POJO Class.
     * @param gameModel The game model class.
     * @param gameInstance The game instance class.
     * @return The process game model class.
     */
    public static GameModel convertGameInstance(GameModel gameModel, GameInstance gameInstance) {
        int positiveAttacks = 0;
        for (int i = 0; i<8; i++)
            for (int j = 0; j<8; j++) {
                BattleCell battleCell = gameInstance.getBattleBoard().getBattleCells()[i][j];
                if (battleCell.isAttackedByEnemy()) gameModel.getAttackedByEnemyCoordinates().add(i*10+j);
                if (battleCell.isAttackedToEnemy()) gameModel.getAttackedCoordinates().put(i*10+j, battleCell.isContainsEnemyShip());
            }
        ArrayList<Ship> ships = (ArrayList<Ship>) gameInstance.getShips();
        for (Ship ship : ships) {
            Ship.ShipNameList shipName = ship.getShipName();
            int[] shipPositions = ship.getCoordinates();
            gameModel.getShipPositions().put(shipName, shipPositions);
        }
        Collection<Boolean> shipAttackedCells = gameModel.getAttackedCoordinates().values();
        Iterator<Boolean> shipAttackedCellsIterator = shipAttackedCells.iterator();
        while (shipAttackedCellsIterator.hasNext()) {
            if (shipAttackedCellsIterator.next()) positiveAttacks++;
        }
        if (positiveAttacks == 15) gameModel.setWon(true);
        else gameModel.setWon(false);
        return gameModel;
    }
}
