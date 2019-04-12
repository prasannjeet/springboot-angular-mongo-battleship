import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BattleService} from '../../services/battle.service';
import {ActivatedRoute} from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as Regex from 'regex';

import * as $ from 'jquery';
import {applySourceSpanToExpressionIfNeeded} from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'app-battleboard',
    templateUrl: './battleboard.component.html',
    styleUrls: ['./battleboard.component.scss']
})
export class BattleboardComponent implements OnInit {

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
    playGameUrl;
    opponentUserId;
    opponentUserName;
    ourTurn = false;
    shipCellCoordinates = [];
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
        // this.currentMessage = 'Waiting for the Opponent';
        this.userName = '';
        this.initDone = false;
        this.showErrorMessage = false;
        this.initForm = new FormGroup({
            name: new FormControl('', Validators.required)
        });
        this.boardLength = Array.from({length: 8}, (v, k) => k);
        console.log(this.boardLength);
    }

    submitInitFormOriginal() {
        this.submitInitForm();
    }

    // this.overlayOn('<p>Ask your friend to join by clicking' +
    //     'on <a [href]=\"playGameUrl\">this' +
    //     'link.</a></p><p>Waiting for Friend...</p>');
    // console.log('testing pj');
    // this.overlayOn();
    // console.log('testing pj');
    // document.getElementById('overlay').style.display = 'block';
    // $('#overlay').toggleClass('dBlock');

    submitInitForm() {
        this.userName = this.initForm.get('name').value.trim();
        if (this.userName) {
            this.initDone = true;
            this.initializeBoard(this.userName.toLowerCase(), () => {
                    this.connect();
                });
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

    }

    // addClass(event) {
    //     console.log(event);
    //     const value = (event.target || event.srcElement || event.currentTarget).attributes.id.nodeValue;
    //     const values = [value];
    //     values.push('5');
    //     BattleboardComponent.highlightCells(values, 'attacked');
    //     console.log('#' + value.toString());
    // }

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
                // const reg = new RegExp('@\'[\d-]\'');
                // const newString = message.body.replace(reg, {});
                // console.log('prasannjeetTest ' + message.body);
                let tempdata;
                let tempUserNameObject;
                if (message.body === 'start') {
                    // this.ourTurn = true;
                    setTimeout(() => {
                        this.battleService.getPlayer2Id(this.socketUrl).subscribe(
                            data => {
                                tempdata = data;
                                this.opponentUserId = tempdata.userId;
                            }, error1 => {
                                console.error(error1);
                            }, () => {

                                // setTimeout(() => {
                                    this.battleService.getUserName(this.opponentUserId).subscribe(data => {
                                        tempUserNameObject = data;
                                    }, error => {
                                        console.error(error);
                                    }, () => {
                                        this.opponentUserName = tempUserNameObject.userName;
                                        // this.currentMessage = 'Waiting for '+this.opponentUserName.toUpperCase();
                                    });
                                // }, 1500);


                            });
                        }, 1500);

                } else {
                    const stringInfo = JSON.parse(message.body);
                    if (stringInfo.turnBy == 'p1') {
                        if (stringInfo.isContainsShip == 'true') {
                            this.ourTurn = false;
                            // this.currentMessage = 'Waiting for '+this.opponentUserName.toUpperCase();
                            BattleboardComponent.highlightCells(['their' + stringInfo.attackedAt], 'attackedWithShip');
                        }
                    }
                    if (stringInfo.turnBy == 'p2') {
                        this.ourTurn = true;
                        // this.currentMessage = 'Your turn now!';
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
                    // if (JSON.parse(message.body).textPart == 'pttheir') {
                    //     const coordinates = 'my' + JSON.parse(message.body).numberPart;
                    //     console.log(coordinates);
                    //     if (this.shipCellCoordinates.includes(coordinates)) {
                    //     console.log('TESTcontains');
                    //     BattleboardComponent.highlightCells([coordinates], 'attackedWithShip');
                    // } else {
                    //     console.log('TESTnotcontains');
                    //     BattleboardComponent.highlightCells([coordinates], 'attacked');
                    // }
                    // }

                }



                // console.log('/topic/reply/' + this.socketUrl);
                // console.log('pjRECEIVED ' + JSON.stringify(message));
            });
        }, error => {
            // alert('STOMP error ' + error);
            this.overlayOn();
            // 'Oops! You have been disconnected from the server. Refresh the page to try again'
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
        console.log('SEND-SEND ' + value);
    }

    overlayOn() {
        document.getElementById('overlay').style.display = 'block';
        // const idName = '#overlayText';
    }

    overlayOff() {
        document.getElementById('overlay').style.display = 'none';
    }
}
