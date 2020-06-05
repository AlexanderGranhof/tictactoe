import React, { FunctionComponent, useEffect, useContext, useState } from "react";
import socket from "../../models/socket";
import Table from "../../components/Table/Table";
import { userContext } from "../../context/user";
import { CSSTransition } from "react-transition-group";
import "./Lobby.scss";
import { RouteComponentProps } from "react-router-dom";

const Lobby: FunctionComponent<RouteComponentProps> = (props) => {
    const [userState] = useContext(userContext);
    const [rooms, setRooms] = useState({});
    const { history } = props;

    useEffect(() => {
        socket.off("room_created");

        socket.on("room_created", (room: any) => {
            console.log("setting rooms")
            setRooms({ ...rooms, [room.id]: room })
        });
    }, [rooms]);

    useEffect(() => void socket.emit("get_clients", setRooms), [])

    const handleRoomCreate = () => {
        socket.emit("create_room", userState)
    };

    const render = (row: any, column: any) => {
        return (
            <CSSTransition
                appear={true}
                in={true}
                timeout={300}
                classNames="table-row"
            >
                <span>{row[column.index]}</span>
            </CSSTransition>
        )
    };

    const handleRowClick = (row: any, col: any) => {
        history.push(`/room/${row.id}`)
    };

    const noRoomsComponent = () => {
        return (
            <span className="no-rooms-text">no rooms avaliable right now :/</span>
        )
    }

    return (
        <main className="page lobbies-fade">
            <div className="lobby">
                <h1 className="welcome-user">Welcome <span className="username">{userState.name}</span></h1>
                <div className="two-col-grid">
                    <div className="tables">
                        <span className="left light hint">select a room to join</span>
                        <Table
                            emptyComponent={noRoomsComponent}
                            className="lobbies"
                            rowClick={handleRowClick}
                            data={Object.values(rooms)}
                            sort={(a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()}
                            rowKeyIndex="id"
                            columns={[{ title: "room", key: "id", index: "id", render }, { title: "name", key: "hostname", index: "hostname", render }]}
                        />
                    </div>
                    <div className="controls">
                        <span className="right light hint">search rooms or play against a bot</span>
                        <button onClick={handleRoomCreate}>create room</button>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Lobby;