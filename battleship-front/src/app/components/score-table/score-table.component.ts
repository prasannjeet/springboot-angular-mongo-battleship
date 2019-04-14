import {Component, OnInit} from '@angular/core';
import {BattleService} from '../../services/battle.service';

/**
 * Score Table Component
 */
@Component({
    selector: 'app-score-table',
    templateUrl: './score-table.component.html',
    styleUrls: ['./score-table.component.scss']
})

/**
 * Component that creates the score-table.
 */
export class ScoreTableComponent implements OnInit {


    /**
     * @ignore
     */
    constructor(private battleService: BattleService) {
    }

    /**
     * Contains the list of names to be entered in the score table.
     */
    names = [];

    /**
     * Contains the respective win-counts of each player present in the names variable.
     */
    winCounts = [];

    /**
     * Contains the respective lost-counts of each player present in the names variable.
     */
    lostCounts = [];

    /**
     * Contains list of random colors that will be used for the circular thumbnail of each player.
     */
    randomColors = [];

    /**
     * Executes when the score card link is clicked. Populates the board with player data.
     */
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

        });


    }

    /**
     * Returns the name with first letter as capital.
     * @param {string} set The username.
     * @returns The username with first alphabet capitalized.
     */
    capitalize(set) {
        return set.charAt(0).toUpperCase() + set.slice(1);
    }

    /**
     * Used to generate a random color.
     * @returns A Random color.
     */
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}
