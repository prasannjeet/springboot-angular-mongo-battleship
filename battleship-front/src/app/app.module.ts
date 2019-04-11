import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BattleboardComponent} from './components/battleboard/battleboard.component';
import {BattleService} from './services/battle.service';
import {Battleboard2Component} from './components/battleboard2/battleboard2.component';
import { OnePlayerComponent } from './component/one-player/one-player.component';
import { ScoreTableComponent } from './components/score-table/score-table.component';

@NgModule({
    declarations: [
        AppComponent,
        BattleboardComponent,
        Battleboard2Component,
        OnePlayerComponent,
        ScoreTableComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [BattleService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
