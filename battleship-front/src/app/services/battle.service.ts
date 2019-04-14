import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * BattleService service that contains all the RESTful API calls. Complete details on all the API calls can be read in the server
 * documentation.
 */
@Injectable({
    providedIn: 'root'
})

export class BattleService {

    /**
     * Constructor
     * @param http HttpClient
     */
    constructor(private  http: HttpClient) {
    }

    /**
     * To initialize a new board for player 1.
     * @param username Username of player 1.
     */
    getNewBoard(username) {
        return this.http.get('/server/api/v1/battle/newgame/' + username);
    }

    /**
     * To initialize a new board for player 1.
     * @param username Username of player 2.
     * @param socketUrl The socket URL, which is a primary key of PlayerMatches model in the server.
     */
    playWithFriend(username, socketUrl) {
        return this.http.get('/server/playWithFriend/' + username + '/' + socketUrl);
    }

    /**
     * To get the username of player 2 when the player 2 enters their username and are ready to play. This name is then displayed
     * in the bottom of the screen. Also used by player 1 to get username of player 2.
     * @param userId User ID of the player.
     */
    getUserName(userId) {
        return this.http.get('/server/api/v1/battle/getUserName/' + userId);
    }

    /**
     * To get the player 2 id. First the ID is received and then from this ID, the player 2 username is received.
     * @param sockId
     */
    getPlayer2Id(sockId) {
        return this.http.get('/server/api/v1/battle/getPlayer2Id/' + sockId);
    }

    /**
     * Used to get all the data that is used to populate the score table.
     */
    getAllPlayerData() {
        return this.http.get('/server/api/v1/battle/getAll');
    }
}
