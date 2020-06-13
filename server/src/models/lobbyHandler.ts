import { Socket } from "socket.io";
import * as game from "../helpers/game";

interface LobbyConstructor {
    id: string,
    hostSocketId: string,
    hostname: string
}

interface GameStateProps {
    board?: number[]
    currentTurn: string
}

class GameState {
    board: number[];
    currentTurn: string;
    firstMovePlayer: string;
    secondMovePlayer: string;
    playerValues: any;
    completed: boolean;

    constructor({ board, currentTurn }: GameStateProps) {
        this.board = board || [-1, -1, -1, -1, -1, -1, -1, -1, -1];

        this.currentTurn = currentTurn;
        this.firstMovePlayer = currentTurn;
        this.secondMovePlayer = "";
        this.playerValues = {
            [currentTurn]: 1
        }
        this.completed = false;
    }

    setCurrentTurn(socketID: string) {
        this.currentTurn = socketID;
    }

    setSecondPlayer(socketID: string) {
        this.secondMovePlayer = socketID;
        this.playerValues[socketID] = 2;
    }

    makeMove(index: number, socketID: string) {
        const moveNumber = this.currentTurn === this.firstMovePlayer ? 1 : 0;

        if (index < 0 || index > 8) {
            throw new Error(`invalid move to position ${index}`)
        }

        if (socketID === this.currentTurn) {
            if (this.board[index] !== -1) {
                throw new Error(`cannot make move to non-empty square`)
            }

            this.board[index] = moveNumber;
            this.currentTurn = this.currentTurn === this.firstMovePlayer ? this.secondMovePlayer : this.firstMovePlayer;

            const hasWinner = game.checkWinner(this.board)
            const noMoreMoves = this.board.every(square => square !== -1);

            this.completed = !!(hasWinner || noMoreMoves);
        }
    }
}

interface ClientProps {
    id: string;
    name?: string;
}

class Client {
    id: string;
    name: string;
    
    constructor({ id }: ClientProps, name: any) {
        this.id = id;
        this.name = name || "opponent";
    }
}

class Room {
    id: string;
    createdAt: Date;
    hostSocketId: string;
    hostname: string;
    state: GameState;
    private sockets: Client[];

    constructor({id, hostSocketId, hostname}: LobbyConstructor) {
        this.id = id;
        this.createdAt = new Date();
        this.hostSocketId = hostSocketId;
        this.hostname = hostname;
        this.sockets = [];
        this.state = new GameState({ currentTurn: hostSocketId })
    }

    addClient(clientSocket: Socket, name: any) {
        if (this.sockets.length >= 2) {
            throw new Error("cannot add more sockets to this room")
        }

        if (this.state.firstMovePlayer !== clientSocket.id) {
            this.state.setSecondPlayer(clientSocket.id);
        }

        this.sockets.push(new Client(clientSocket, name));
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

    static generateRoomID(length: number = 4) {
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

    createRoom({hostSocketId, hostname} : {hostSocketId: string, hostname: string}): Room {
        let id = LobbyHandler.generateRoomID();

        while (this.roomExists(id)) {
            id = LobbyHandler.generateRoomID();
        }
        
        const lobby = new Room({ id, hostSocketId, hostname });

        this.lobbies[id] = lobby;

        return lobby;
    }

    removeRoom(id: string) {
        const lobbyExists = this.roomExists(id);

        if (lobbyExists) {
            delete this.lobbies[id]
        }

        return lobbyExists
    }

    getAllRooms() {
        return this.lobbies;
    }

    getRoom(id: string) {
        return this.lobbies[id];
    }

    getRoomState(id: string) {
        // fails here sometimes
        return this.lobbies[id].state;
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
        // this fails sometimes for some reason
        return this.lobbies[room].isEmpty();
    }

    roomIsFull(room: string) {
        return this.lobbies[room].isFull();
    }

    addClient(socket: Socket, room: string, name: any) {
        this.lobbies[room].addClient(socket, name);
    }
}

export default new LobbyHandler();