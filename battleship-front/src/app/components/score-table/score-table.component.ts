import {Component, OnInit} from '@angular/core';
import {BattleService} from '../../services/battle.service';

@Component({
    selector: 'app-score-table',
    templateUrl: './score-table.component.html',
    styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {


    constructor(private battleService: BattleService) {
    }

    names = [];
    winCounts = [];
    lostCounts = [];
    randomColors = [];

    ngOnInit() {


        this.battleService.getAllPlayerData().subscribe(data => {
            console.log(data);
            // console.log(data);
            for (const i in data) {
                this.names.push(i); // alerts key
                this.winCounts.push(data[i][0]); //alerts key's value (wincount)
                this.lostCounts.push(data[i][1]); //alerts other key value (lostcount)
                this.randomColors.push(this.getRandomColor());
            }
            console.log(this.names);
            console.log(this.lostCounts);
            console.log(this.winCounts);
        }, error => {
            console.error(error);
        }, () => {
            // this.opponentUserName = tempUserNameObject.userName;
            // this.currentMessage = 'Waiting for '+this.opponentUserName.toUpperCase();

        });


    }

    capitalize(set) {
        return set.charAt(0).toUpperCase() + set.slice(1);
    };

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}
