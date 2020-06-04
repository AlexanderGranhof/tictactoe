import React, { FunctionComponent, useEffect, useContext, useState } from "react";
import socket from "../../models/socket";
import Table from "../../components/Table/Table";
import { userContext } from "../../context/user";

const Lobby: FunctionComponent = (props) => {
    const [userState, setUserState] = useContext(userContext);

    useEffect(() => {
        socket.emit("get_clients", (clients: any) => {
            console.log("we got", clients)
        });

        socket.on("room_created", (room: any) => {
            console.log("we got a room", room)
        })
    }, []);

    const handleRoomCreate = () => {
        socket.emit("create_room", useState)
    };

    return (
        <main className="page">
            <h1>Welcome {userState.name}</h1>
            <button onClick={handleRoomCreate}>create room</button>
            <Table />
        </main>
    )
};

export default Lobby;