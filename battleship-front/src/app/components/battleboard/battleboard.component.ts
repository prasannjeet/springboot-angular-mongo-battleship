import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BattleService} from '../../services/battle.service';
import {ActivatedRoute} from '@angular/router';
import * as Stomp from 'stompjs';

import * as $ from 'jquery';

/**
 * BattleBoard component that instantiates when first player opens the URL.
 */
@Component({
    selector: 'app-battleboard',
    templateUrl: './battleboard.component.html',
    styleUrls: ['./battleboard.component.scss']
})

/**
 * BattleBoard component that instantiates when first player opens the URL.
 */
export class BattleboardComponent implements OnInit {

    /**
     * Constructor for this component.
     * @param battleService An instance of BattleService service for API calls.
     * @param route Instance of ActivatedRoute for getting route ID's
     */
    constructor(private battleService: BattleService, private route: ActivatedRoute) {
    }

    /**
     * Defines if the component has been initialized or not. When the user enters their username and submits.
     */
    initDone: boolean;

    /**
     * When true, the error message is shown in the screen.
     */
    showErrorMessage: boolean;

    /**
     * Instance of form group for filling up the username text box.
     */
    initForm: FormGroup;

    /**
     * User name of the player.
     */
    userName: string;

    /**
     * User id of the player.
     */
    userId: string;

    /**
     * The socket id, which is the primary key of PlayerMatches model in the server. Used to communicate via websockets with the server.
     */
    socketUrl: string;

    /**
     * The board length of the game, which is a constant number 8 in this game.
     */
    boardLength;

    /**
     * Will contain the data of new board. Received from the GameModel POJO class in spring.
     */
    newBoardData;

    /**
     * Array containing all the cell positions attacked by the player.
     */
    clickedCells = [''];

    /**
     * Contains the current message to be displayed in the screen. Like "It's your turn", "It's enemy's turn", etc.
     */
    currentMessage;

    /**
     * Stomp instance for web sockets.
     */
    ws;

    /**
     * The user-id of the opponent.
     */
    opponentUserId;

    /**
     * The user name of the opponent.
     */
    opponentUserName;

    /**
     * Contains the list of all the coordinates containing a ship. Used to highlight ship coordinates.
     */
    shipCellCoordinates = [];

    /**
     * True if it's the player's turn. Toggles between true and false with each click.
     */
    ourTurn;

    /**
     * Intimates whether the game is over or not. True of any of the player wins. Intimation received from the server.
     */
    gameover = false;

    /**
     * Contains the url that will be used to initialize the second player.
     */
    playGameUrl;

    /**
    * Variable for receiving GameModel POJO class. However, this is unused at the moment.
    */
    private boardStatus = {
        userId: {},
        userName: {},
        attackedByEnemyCoordinates: [],
        attackedCoordinates: {},
        shipPositions: {
            CARRIER: [],
            SUBMARINE: [],
            CRUISER: [],
            ATTACKER: [],
            DESTROYER: []
        },
        won: {}
    };

    /**
     * Used to highlight a particular cell in the player's board.
     * @param values Contains an array of the #id of the cell that needs to be highlighted.
     * @param className Contains the class name that should be assignmed to the id.
     */
    static highlightCells(values, className) {
        for (const item of values) {
            const elId2 = '#' + item.toString();
            $(elId2).addClass(className);
        }
    }

    /**
     * Executes when this component is initialized.
     * <ol>
     *     <li>Variables are set to empty/false depending upon the type.</li>
     *     <li>The username form is initialized.</li>
     * </ol>
     */
    ngOnInit() {
        this.userName = '';
        this.initDone = false;
        this.showErrorMessage = false;
        this.initForm = new FormGroup({
            name: new FormControl('', Validators.required)
        });
        /**
         * Initializing the array with values: {0,1,2,3,4,5,6,7}
         */
        this.boardLength = Array.from({length: 8}, (v, k) => k);
    }

    /**
     * Called to submit the init form. Was initially made for call-backs. However, now it is redundant.
     * calls submitInitForm() method.
     */
    submitInitFormOriginal() {
        this.submitInitForm();
    }

    /**
     * Runs when the initial form with username is submitted. The username variable is updated. If pressed enter without entering any
     * username, an error message is displayed. Also makes sure that only spaces have not been sent as a username.
     */
    submitInitForm() {
        this.userName = this.initForm.get('name').value.trim().toLowerCase();
        if (this.userName) {
            this.initDone = true;
            this.initializeBoard(this.userName, () => {
                    this.connect();
                });
        } else {
            this.showErrorMessage = true;
        }
     }

    /**
     * Executes when an enemy cell in the battle board is click by a player. If clicked on a legal cell, the method changes the color of
     * that cell to red, as well as sends the message to server via web sockets so that other player can change the color as well.
     * @param event Click event is passed to this method from the DOM.
     */
    onClick(event) {
        const value = (event.target || event.srcElement || event.currentTarget).attributes.id.nodeValue;
        if (this.ourTurn) {
            if (!this.clickedCells.includes(value)) {
                this.ourTurn = false;
                this.currentMessage = '';
                this.clickedCells.push(value);
                BattleboardComponent.highlightCells([value], 'attacked');
                this.sendName('po' + value);
            } else {
                this.currentMessage = 'You have already attacked there!';
            }
        }
    }

    /**
     * This method is called after the init form is submitted by the user. It initializes the board. It first sends an RESTful API call
     * to the server to Initialize the board. It then receives the GameModel POJO class from the server that it uses to populate the
     * user's board with ship positions and different colors for different ships. Also saves the user id of current user. A sample new
     * board data is of the following type:
     *
     * @example
     * To check an example of the JSON object received, refer to the README tab above.
     *
     * @param username The username of the player.
     * @param callback1 A callback function that is called after all the process of this method is finished.
     */
    initializeBoard(username, callback1) {
        this.battleService.getNewBoard(username).subscribe(
            data => {
                this.newBoardData = data;
            },
            err => {
                console.log(err);
            },
            () => {
                for (const i of this.newBoardData.shipPositions.CARRIER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    BattleboardComponent.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship1');
                }
                for (const i of this.newBoardData.shipPositions.SUBMARINE) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    BattleboardComponent.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship2');
                }
                for (const i of this.newBoardData.shipPositions.CRUISER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    BattleboardComponent.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship3');
                }
                for (const i of this.newBoardData.shipPositions.ATTACKER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    BattleboardComponent.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship4');
                }
                for (const i of this.newBoardData.shipPositions.DESTROYER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    BattleboardComponent.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship5');
                }
                // BattleboardComponent.highlightCells(this.shipCellCoordinates, 'shipCell');
                console.log(JSON.stringify(this.newBoardData));
                this.userId = this.newBoardData.userId;
                this.socketUrl = this.newBoardData.socketUrl;
                this.playGameUrl = '/playWithFriend/' + this.userId + '/' + this.socketUrl;
                callback1();
            });
    }

    /**
     * Attempts to connect through web sockets with the server as soon as the initial form with the username is submitted. Further, it also
     * subscribes to the server through the channel containing the socket-id. The server sends a "start" message the first time. From the
     * next steps, it sends the details of the opponent player turn. This is used to color the battle board with appropriate colors. If
     * the game is over, the server also sends that info here. Refer to the processMessageFromClient() api in WebSocketController in the
     * server. A sample response can be of the type:
     *
     * @example
     * To check an example input JSON object, refer to the README tab above.
     */
    connect() {
        const socket = new WebSocket('ws://localhost:8080/greeting');
        this.ws = Stomp.over(socket);
        const that = this;
        this.ws.connect({}, frame => {
            that.ws.subscribe('/errors', message => {
                alert('Error ' + message.body);
            });
            that.ws.subscribe('/topic/reply/' + this.socketUrl, message => {
                let tempdata;
                let tempUserNameObject;
                if (message.body === 'start') {
                    setTimeout(() => {
                        this.battleService.getPlayer2Id(this.socketUrl).subscribe(
                            data => {
                                tempdata = data;
                                this.opponentUserId = tempdata.userId;
                            }, error1 => {
                                console.error(error1);
                            }, () => {
                                    this.battleService.getUserName(this.opponentUserId).subscribe(data => {
                                        tempUserNameObject = data;
                                    }, error => {
                                        console.error(error);
                                    }, () => {
                                        this.opponentUserName = tempUserNameObject.userName;
                                    });
                            });
                        }, 1500);

                } else {
                    const stringInfo = JSON.parse(message.body);
                    if (stringInfo.turnBy == 'p1') {
                        if (stringInfo.isContainsShip == 'true') {
                            this.ourTurn = false;
                            BattleboardComponent.highlightCells(['their' + stringInfo.attackedAt], 'attackedWithShip');
                        }
                    }
                    if (stringInfo.turnBy == 'p2') {
                        this.ourTurn = true;
                        if (stringInfo.isContainsShip == 'true') {
                            BattleboardComponent.highlightCells(['my' + stringInfo.attackedAt], 'attackedWithShip');
                        } else {
                            BattleboardComponent.highlightCells(['my' + stringInfo.attackedAt], 'attacked');
                        }
                    }
                    if (stringInfo.winningMove == 'true') {
                        this.gameover = (stringInfo.winningMove == 'true');
                        console.log('Winning Move: ' + stringInfo.winningMove);
                        this.ourTurn = false;
                        if (stringInfo.turnBy == 'p1') {
                            this.currentMessage = 'Congratulations, You Won! Refresh to play again.';
                        } else {
                            this.currentMessage = 'Bad Luck! ' + this.opponentUserName + ' won! Refresh to play again.';
                        }

                    }
                }
            });
        }, error => {
            this.overlayOn();
        });
    }

    /**
     * Used to disconnect the web sockets from the server. Never used.
     */
    disconnect() {
        if (this.ws != null) {
            this.ws.ws.close();
        }
        console.log('Disconnected');
    }

    /**
     * Used to send information to the server, whether the player has made his turn, or the player has initialized their board.
     * @param value Can be the coordinate of the cell that the player clicked, or can just be an indicator that the player is ready to play.
     */
    sendName(value) {
        const data = JSON.stringify({
            name: value
        });
        this.ws.send('/app/message/' + this.socketUrl, {}, data);
        console.log('SEND-SEND ' + value);
    }

    /**
     * Called when web sockets connection is broken. Adds an overlay in the screen with error message.
     */
    overlayOn() {
        document.getElementById('overlay').style.display = 'block';
        // const idName = '#overlayText';
    }

    /**
     * Called to remove the overlay that appears when overlayOn() is called.
     */
    overlayOff() {
        document.getElementById('overlay').style.display = 'none';
    }
}
