import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BattleService {

    constructor(private  http: HttpClient) {
    }

    getNewBoard(username) {
        return this.http.get('/server/api/v1/battle/newgame/' + username);
    }

    playWithFriend(username, socketUrl) {
        return this.http.get('/server/playWithFriend/' + username + '/' + socketUrl);
    }

    getUserName(userId) {
        return this.http.get('/server/api/v1/battle/getUserName/' + userId);
    }

    getPlayer2Id(sockId) {
        return this.http.get('/server/api/v1/battle/getPlayer2Id/' + sockId);
    }

    getAllPlayerData() {
        return this.http.get('/server/api/v1/battle/getAll');
    }
    // connectPlayer(message) {
    //
    // }
}
