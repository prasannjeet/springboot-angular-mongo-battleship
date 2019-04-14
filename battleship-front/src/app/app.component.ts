import { Component } from '@angular/core';
import {BattleboardComponent} from './components/battleboard/battleboard.component';

/**
 * Empty component. Contains a link to start playing the game. This link is also shown in the score table component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

    /**
     * Contains the title of the page.
     */
    title = 'battleship-front';
}
