interface LobbyConstructor {
    id: string,
    hostSocketId: string,
    hostname: string
}

class Room {
    id: string;
    createdAt: Date;
    hostSocketId: string;
    hostname: string;

    constructor({id, hostSocketId, hostname}: LobbyConstructor) {
        this.id = id;
        this.createdAt = new Date();
        this.hostSocketId = hostSocketId;
        this.hostname = hostname;
    }
}

class LobbyHandler {
    private lobbies: { [key: string]: Room }

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

    createLobby({hostSocketId, hostname} : {hostSocketId: string, hostname: string}): Room {
        let id = LobbyHandler.generateLobbyID();

        while (this.lobbyExists(id)) {
            id = LobbyHandler.generateLobbyID();
        }
        
        const lobby = new Room({ id, hostSocketId, hostname });

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

    getLobbies() {
        return this.lobbies;
    }
}

export default LobbyHandler