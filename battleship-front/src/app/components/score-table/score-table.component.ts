import { Component, OnInit } from '@angular/core';
import {BattleService} from '../../services/battle.service';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {

  constructor(private battleService: BattleService) { }

  ngOnInit() {


      this.battleService.getAllPlayerData().subscribe(data => {
          console.log(JSON.stringify(data));
      }, error => {
          console.error(error);
      }, () => {
          // this.opponentUserName = tempUserNameObject.userName;
          // this.currentMessage = 'Waiting for '+this.opponentUserName.toUpperCase();
      });


  }

}
