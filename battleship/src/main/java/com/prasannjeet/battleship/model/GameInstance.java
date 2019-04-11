package com.prasannjeet.battleship.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.annotation.Id;

//import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Data
@NoArgsConstructor
public class GameInstance {

    private String userId;
    @Id private String userName;
    private BattleBoard battleBoard;
    private List ships;
    private int attackedShips;
    private int wonGames = 0;

//    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    public GameInstance(String userId, String userName) {
        this.userId = userId;
        this.battleBoard = new BattleBoard();
        ships = new ArrayList<Ship>() {{
            add(new Ship(5, Ship.ShipNameList.CARRIER));
            add(new Ship(4, Ship.ShipNameList.CRUISER));
            add(new Ship(3, Ship.ShipNameList.SUBMARINE));
            add(new Ship(2, Ship.ShipNameList.DESTROYER));
            add(new Ship(1, Ship.ShipNameList.ATTACKER));
        }};
        for (Object ship : ships) {
            setRandomPositions(battleBoard, (Ship) ship);
        }
        this.userName = userName;
        attackedShips = 0;
        wonGames = 0;
    }

    @SneakyThrows(NullPointerException.class)
    public void setRandomPositions(BattleBoard battleBoard, Ship ship) {
        boolean isHorizontal = returnRandomBoolean();
        BattleCell oneCell = null;
        Random random = new Random();
        int x = 0;
        int y = 0;
        do {
            if (isHorizontal) {
                x = random.nextInt(8 - ship.getSize() + 1);
                y = random.nextInt(8);
            } else {
                x = random.nextInt(8);
                y = random.nextInt(8 - ship.getSize() + 1);
            }

        } while (!areCellsEmpty(x, y, isHorizontal, battleBoard, ship.getSize()));
        if (isHorizontal)
            for (int i = 0; i < ship.getSize(); i++) {
                ship.getCoordinates()[i] = (x + i) * 10 + y;
                oneCell = battleBoard.getBattleCells()[x + i][y];
//                System.out.println(oneCell.isContainsShip());
                oneCell.setContainsShip(true);
            }
        else
            for (int i = 0; i < ship.getSize(); i++) {
                ship.getCoordinates()[i] = x * 10 + (y + i);
                oneCell = battleBoard.getBattleCells()[x][y + i];
//                System.out.println(oneCell.isContainsShip());
                oneCell.setContainsShip(true);
            }
        oneCell.setShipName(ship.getShipName());
    }

    private boolean areCellsEmpty(int x, int y, boolean isHorizontal, BattleBoard battleBoard, int shipSize) {
        boolean flag = true;
        BattleCell oneCell = null;
        if (isHorizontal)
            for (int i = 0; i < shipSize; i++) {
                oneCell = battleBoard.getBattleCells()[x + i][y];
                if (oneCell.isContainsShip()) flag = false;
            }
        else
            for (int i = 0; i < shipSize; i++) {
                oneCell = battleBoard.getBattleCells()[x][y + i];
                if (oneCell.isContainsShip()) flag = false;
            }
        return flag;
    }

    public boolean returnRandomBoolean() {
        return (Math.random() < 0.5);
    }

    //returns true of contains ship
    public boolean enemyTurn (int coordinate) {
        int x = coordinate/10;
        int y = coordinate%10;
        BattleCell battleCell = this.getBattleBoard().getBattleCells()[x][y];
        battleCell.setAttackedByEnemy(true);
        if (battleCell.isContainsShip()) {
            this.attackedShips++;

            Ship.ShipNameList shipName = battleCell.getShipName();
            for (Object ship : ships) {
                if (((Ship)ship).getShipName() == shipName) {
                    ((Ship)ship).setAttackCount(((Ship)ship).getAttackCount()+1);
                }
            }
            return true;
        }
        else return false;
    }
}
