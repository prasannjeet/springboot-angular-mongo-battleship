import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BattleboardComponent} from './components/battleboard/battleboard.component';
import {Battleboard2Component} from './components/battleboard2/battleboard2.component';
import {ScoreTableComponent} from './components/score-table/score-table.component';

const routes: Routes = [{
    path: 'battleboard',
    component: BattleboardComponent
}, {
    path: 'playWithFriend/:userId/:socketUrl',
    component: Battleboard2Component
}, {
    path: 'scoreTable',
    component: ScoreTableComponent
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
