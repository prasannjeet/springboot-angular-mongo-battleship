# Battleship
A web-based battleship game that uses Spring in the backend and Angular in the front. MongoDB was used for persisting the data. The project is based on Model-View-Control Design Pattern. Technologies used at a glance:

- Spring Boot 2.1.4
- Angular 7.2.12
- MongoDB 4.0.8
- Websockets used for web-app conversations.
- REST api used for client-server conversations.

## Play the game
To play the game, open your broser at http://localhost:4200/battleboard after compiling the game.

## Compiling the game
The folder `battleship` contains the spring boot server, and `battleship-front` has the angular front-end files. The spring project uses `maven` as it's package manager, were as the angular project uses `yarn` as it's package manager.

### To run the server
- Download the folder `battleship`.
- Import as a `maven` project in IntellIJ or Eclipse, or any other IDE.
- Import all the dependencies.
- Simply run `com.prasannjeet.battleship.BattleshipApplication.java` as an application.
- The Spring server should now be listening at http://localhost:8080

### To run the application
- Make sure `Angular`, `node`, `npm` is installed.
- As this project uses `yarn` as a package manager, make sure it is [installed](https://yarnpkg.com/lang/en/docs/install).
- At the project root, run `yarn upgrade` to update all the packages.
- The project may run with `npm install`, but I am not sure!
- Run `npm start` to start the angular server. The game can now be played at http://localhost:4200/battleboard.

## Limitations
- Currently, the game will run only in localhost.
- No tests have been implemented yet.
- There is no AI opponent currently.
- The design of the application can be improved.