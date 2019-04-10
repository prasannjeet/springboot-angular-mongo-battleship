//currently not used
package com.prasannjeet.battleship.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PlayerMatches {
    @Id
    String webSocketAddress;
    private String player1;
    private String player2;

    public PlayerMatches(String player1, String player2) {
        this.player1 = player1;
        this.player2 = player2;
    }
    public PlayerMatches(String player1) {
        this.player1 = player1;
    }
}
