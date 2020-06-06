import React, { FunctionComponent, useEffect, useContext, useState } from "react";
import socket from "../../models/socket";
import Table from "../../components/Table/Table";
import { userContext } from "../../context/user";
import { CSSTransition } from "react-transition-group";
import "./Lobby.scss";
import { RouteComponentProps } from "react-router-dom";
import Input from "../../components/Input/Input";

const Lobby: FunctionComponent<RouteComponentProps> = (props) => {
    const [userState] = useContext(userContext);
    const [rooms, setRooms] = useState({});
    const [ filteredRooms, setFilteredRooms ] = useState({});
    const [ roomSearch, setRoomSearch ] = useState("");
    const { history } = props;

    const cleanup = () => {
        socket.off("room_created");
    }

    useEffect(() => {
        socket.on("room_created", (room: any) => {
            console.log("setting rooms")
            setRooms({ ...rooms, [room.id]: room })
        });

        return cleanup;
    }, [rooms]);

    useEffect(() => void socket.emit("get_clients", setRooms), [])

    const handleRoomCreate = () => {
        socket.emit("create_room", userState, (room: any) => {
            history.push(`/room/${room.id}`)
        });
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

    const handleRoomsFilter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const search = event.currentTarget.value.toLowerCase();
        setRoomSearch(search);

        if (search === "") {
            return setFilteredRooms({});
        }

        const filteredRooms = Object.entries(rooms).reduce((prev, row) => {
            const [key, value]: [string, any] = row;
            const name = value.hostname.toLowerCase();

            if (name.includes(search)) {
                return {...prev, [key]: value}
            }

            return prev;
        }, {});

        setFilteredRooms(filteredRooms);
    }

    const sortRoomsByDate = (a: any, b: any) =>  {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    return (
        <main className="page lobbies-fade">
            <div className="lobby">
                <h1 className="welcome-user">Welcome <span className="username">{userState.name}</span></h1>
                <div className="two-col-grid">
                    <div className="controls">
                        <span className="left light hint">search rooms or play against a bot</span>
                        <Input id="room-filter" label="search rooms" onKeyUp={handleRoomsFilter} />
                        <button className="large blue" onClick={handleRoomCreate}>Create Room</button>
                    </div>
                    <div className="tables">
                        <span className="right light hint">select a room to join</span>
                        <Table
                            emptyComponent={noRoomsComponent}
                            className="lobbies"
                            rowClick={handleRowClick}
                            data={roomSearch.length ? Object.values(filteredRooms) : Object.values(rooms)}
                            sort={sortRoomsByDate}
                            rowKeyIndex="id"
                            columns={[{ title: "room", key: "id", index: "id", render }, { title: "name", key: "hostname", index: "hostname", render }]}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Lobby;