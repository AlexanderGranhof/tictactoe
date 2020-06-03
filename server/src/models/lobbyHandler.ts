interface LobbyConstructor {
    id: string,
    createdBy: string,
}

class Lobby {
    id: string;
    createdAt: Date;
    createdBy: string;

    constructor({id, createdBy}: LobbyConstructor) {
        this.id = id;
        this.createdAt = new Date();
        this.createdBy = createdBy;
    }
}

class LobbyHandler {
    private lobbies: { [key: string]: Lobby }

    constructor() {
        this.lobbies = {};
    }

    static generateLobbyID(length: number = 4) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
        const numbers = "0123456789";
    
        let roomID = "";
    
        for (let i = 0; i < length; i++) {
            const useLetter = Math.random() > 0.5;
    
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    
            roomID += useLetter ? randomLetter : randomNumber;
        }
    
        return roomID;
    }

    lobbyExists(id: string) {
        return Object.keys(this.lobbies).includes(id);
    }

    createLobby(createdBySocketID: string): Lobby {
        let id = LobbyHandler.generateLobbyID();

        while (this.lobbyExists(id)) {
            id = LobbyHandler.generateLobbyID();
        }
        
        const lobby = new Lobby({ id, createdBy: createdBySocketID });

        this.lobbies[id] = lobby;

        return lobby;
    }

    removeLobby(id: string) {
        const lobbyExists = this.lobbyExists(id);

        if (lobbyExists) {
            delete this.lobbies[id]
        }

        return lobbyExists
    }
}

export default LobbyHandler