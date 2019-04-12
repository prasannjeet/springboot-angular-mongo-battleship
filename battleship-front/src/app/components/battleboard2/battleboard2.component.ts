import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BattleService} from '../../services/battle.service';
import {ActivatedRoute} from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';
import {log} from 'util';

@Component({
    selector: 'app-battleboard2',
    templateUrl: './battleboard2.component.html',
    styleUrls: ['./battleboard2.component.scss']
})
export class Battleboard2Component implements OnInit {

    constructor(private battleService: BattleService, private route: ActivatedRoute) {
    }

    initDone: boolean;
    showErrorMessage: boolean;
    initForm: FormGroup;
    userName: string;
    userId: string;
    socketUrl: string;
    boardLength;
    selectShipMessage;
    newBoardData;
    clickedCells = [''];
    currentMessage;
    ws;
    opponentUserId;
    opponentUserName;
    shipCellCoordinates = [];
    ourTurn;
    gameover = false;

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

    static highlightCells(values, className) {
        for (const item of values) {
            const elId2 = '#' + item.toString();
            $(elId2).addClass(className);
        }
    }

    ngOnInit() {
        let tempUserNameObject;
        this.userName = '';
        this.initDone = false;
        this.showErrorMessage = false;
        this.initForm = new FormGroup({
            name: new FormControl('', Validators.required)
        });
        this.boardLength = Array.from({length: 8}, (v, k) => k);
        console.log(this.boardLength);
        this.opponentUserId = this.route.snapshot.params.userId;
        this.socketUrl = this.route.snapshot.params.socketUrl;
        console.log('Debug User Id: ' + this.opponentUserId);
        this.battleService.getUserName(this.opponentUserId).subscribe(data => {
            // console.log('Line 69 battle2: ' + JSON.stringify(data));
            tempUserNameObject = data;
        }, error => {
            console.error(error);
        }, () => {
            this.opponentUserName = tempUserNameObject.userName;
            console.log('Opp User Name: '+this.opponentUserName);
        });
    }

    submitInitForm() {
        this.userName = this.initForm.get('name').value.trim();
        if (this.userName) {
            this.initDone = true;
            this.initializeBoard(this.userName.toLowerCase(), this.socketUrl);
        } else {
            this.showErrorMessage = true;
        }
        // let i: any;
        // let j: any;
        // for (i = 0; i < 8; i++) {
        //     for (j = 0; j < 8; j++) {
        //         const idVar = '#' + (i * 10 + j);
        //         console.log(idVar);
        //         $(idVar).append(idVar.toString());
        //     }
        // }
        this.connect();
    }

    addClass(event) {
        console.log(event);
        const value = (event.target || event.srcElement || event.currentTarget).attributes.id.nodeValue;
        const values = [value];
        values.push('5');
        Battleboard2Component.highlightCells(values, 'attacked');
        console.log('#' + value.toString());
    }

    onClick(event) {
        const value = (event.target || event.srcElement || event.currentTarget).attributes.id.nodeValue;
        if (this.ourTurn) {
            if (!this.clickedCells.includes(value)) {
                this.ourTurn = false;
                this.currentMessage = '';
                this.clickedCells.push(value);
                Battleboard2Component.highlightCells([value], 'attacked');
                this.sendName('pt'+value);
            } else {
                this.currentMessage = 'You have already attacked there!';
            }
        }
    }

    initializeBoard(username, socketUrl) {
        this.battleService.playWithFriend(username, socketUrl).subscribe(
            data => {
                this.newBoardData = data;
                console.log('New Board Data: \n' + JSON.stringify(this.newBoardData));
            },
            err => {
                console.log(err);
            },
            () => {
                for (const i of this.newBoardData.shipPositions.CARRIER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    Battleboard2Component.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship1');
                }
                for (const i of this.newBoardData.shipPositions.SUBMARINE) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    Battleboard2Component.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship2');
                }
                for (const i of this.newBoardData.shipPositions.CRUISER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    Battleboard2Component.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship3');
                }
                for (const i of this.newBoardData.shipPositions.ATTACKER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    Battleboard2Component.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship4');
                }
                for (const i of this.newBoardData.shipPositions.DESTROYER) {
                    this.shipCellCoordinates.push((i < 10) ? ('my0' + i.toString()) : ('my' + i.toString()));
                    Battleboard2Component.highlightCells([this.shipCellCoordinates[this.shipCellCoordinates.length - 1]], 'ship5');
                }
                // Battleboard2Component.highlightCells(shipCellCoordinates, 'shipCell');
                console.log(JSON.stringify(this.newBoardData));
                this.userId = this.newBoardData.userId;
            });

    }

    connect() {
        // console.log("CONNECT-CONNECT");
        // connect to stomp where stomp endpoint is exposed
        // let ws = new SockJS(http://localhost:8080/greeting);
        const socket = new WebSocket('ws://localhost:8080/greeting');
        this.ws = Stomp.over(socket);
        const that = this;
        this.ws.connect({}, frame => {
            that.ws.subscribe('/errors', message => {
                alert('Error ' + message.body);
            });
            that.ws.subscribe('/topic/reply/' + this.socketUrl, message => {
                if (message.body == 'start') {
                    this.ourTurn = true;
                } else {
                    const stringInfo = JSON.parse(message.body);
                    if (stringInfo.turnBy == 'p2') {
                        this.ourTurn = false;
                        if (stringInfo.isContainsShip == 'true') {
                            Battleboard2Component.highlightCells(['their' + stringInfo.attackedAt], 'attackedWithShip');
                        }
                    }
                    if (stringInfo.turnBy == 'p1') {
                        this.ourTurn = true;
                        if (stringInfo.isContainsShip == 'true') {
                            Battleboard2Component.highlightCells(['my' + stringInfo.attackedAt], 'attackedWithShip');
                        } else {
                            Battleboard2Component.highlightCells(['my' + stringInfo.attackedAt], 'attacked');
                        }
                    }
                    if (stringInfo.winningMove == 'true') {
                        this.gameover = (stringInfo.winningMove == 'true');
                        console.log('Winning Move: '+stringInfo.winningMove);
                        this.ourTurn = false;
                        if (stringInfo.turnBy == 'p2') {
                            this.currentMessage = 'Congratulations, You Won! Close this window.';
                        } else {
                            this.currentMessage = 'Bad Luck! ' + this.opponentUserName + ' won! Close this window.';
                        }

                    }
                }
            });
            this.sendName('start');
        }, error => {
            // alert('STOMP error ' + error);
            this.overlayOn();
        });
    }

    disconnect() {
        if (this.ws != null) {
            this.ws.ws.close();
        }
        console.log('Disconnected');
    }

    sendName(value) {
        const data = JSON.stringify({
            name: value
        });
        this.ws.send('/app/message/' + this.socketUrl, {}, data);
    }

    overlayOn() {
        document.getElementById('overlay').style.display = 'block';
    }

    overlayOff() {
        document.getElementById('overlay').style.display = 'none';
        location.reload();
    }

}
