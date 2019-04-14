# BattleshipFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Angular Front-End
The front-end was built in angular as it makes it easier and organized for bigger applications. Although Battleship is a small game, dividing various parts into components will make it easy to upgrade in future. There two components in this applicaton:

1. BattleBoard, and
2. BattleBoard2
3. ScoreTable


Both are the same design and almost same functions. They are the main web-app for player1, and player2. The game always works in pairs; when the first component is instantiated, it contains a link, which when clicked, instantiates the second component.

The application is built with a minimal design where the left part contains the player's board with her ship positions that were initialized randomly. Further, the right half contains an empty board through which the other player can be attacked by clicking a particular cell.

The applications initially requests a username, which is then used as a unique-id. If a user uses the same name in another instance, their win-count will be updated in the repository.

The third component displays the scorecard. It contains three columns displaying the user-name, the number of times they have lost the game and won the game. For a user to have their name in the score-card, they should have, at least once completed the game fully.

Further, the application has one service, `BattleService` that handles all the REST api calls. Websocket communications are handled by component themselves. The application uses `Routing` to toggle between different components in the application using pseudo URL's generated.

## Features
- Apart from the enemy's board, users can also see their own board and the ship positions. 
- The enemy attacks on a player's board are also marked. 
- If the enemy attacks correctly on a ship, a "fire" symbol appears in that positions.
- A scorecard, as mentioned above, is also implemented.
- Users can also see an error message if, for any reason, the websockets connection is lost with the server.
