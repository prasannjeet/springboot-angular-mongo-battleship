import { Component } from '@angular/core';
import {BattleboardComponent} from './components/battleboard/battleboard.component';

/**
 * @ignore
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
