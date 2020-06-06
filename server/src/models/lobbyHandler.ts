import { Socket } from "socket.io";

interface LobbyConstructor {
    id: string,
    hostSocketId: string,
    hostname: string
}

class Client {
    id: string;

    constructor({ id }: {id: string}) {
        this.id = id;
    }
}

class Room {
    id: string;
    createdAt: Date;
    hostSocketId: string;
    hostname: string;
    private sockets: Client[];

    constructor({id, hostSocketId, hostname}: LobbyConstructor) {
        this.id = id;
        this.createdAt = new Date();
        this.hostSocketId = hostSocketId;
        this.hostname = hostname;
        this.sockets = [];
    }

    addClient(clientSocket: Socket) {
        if (this.sockets.length >= 2) {
            throw new Error("cannot add more sockets to this room")
        }

        this.sockets.push(new Client(clientSocket));
    }

    removeClient(client: Socket): Client | undefined {
        const index = this.sockets.findIndex(socket => socket.id === client.id);
        
        return this.sockets.splice(index, 1).shift();
    }

    isFull() {
        return this.sockets.length >= 2;
    }

    isEmpty() {
        return this.sockets.length === 0;
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

    roomExists(id: string) {
        return Object.keys(this.lobbies).includes(id);
    }

    createLobby({hostSocketId, hostname} : {hostSocketId: string, hostname: string}): Room {
        let id = LobbyHandler.generateLobbyID();

        while (this.roomExists(id)) {
            id = LobbyHandler.generateLobbyID();
        }
        
        const lobby = new Room({ id, hostSocketId, hostname });

        this.lobbies[id] = lobby;

        return lobby;
    }

    removeLobby(id: string) {
        const lobbyExists = this.roomExists(id);

        if (lobbyExists) {
            delete this.lobbies[id]
        }

        return lobbyExists
    }

    getLobbies() {
        return this.lobbies;
    }

    removeClient(socket: Socket, roomID: string) {
        if (this.roomExists(roomID)) {
            const lobby = this.lobbies[roomID];
            const removedClient =  lobby.removeClient(socket);
    
            return removedClient
        }

        return false
    }

    roomIsEmpty(room: string) {
        return this.lobbies[room].isEmpty();
    }

    roomIsFull(room: string) {
        return this.lobbies[room].isFull();
    }

    addClient(socket: Socket, room: string) {
        this.lobbies[room].addClient(socket);
    }
}

export default new LobbyHandler();