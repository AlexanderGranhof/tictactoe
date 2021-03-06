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
        socket.off("room_removed");
        socket.off("disconnect");
        socket.off("get_rooms");
        socket.off("connect");
    }

    const filterOutFullRooms = (rooms: any) => {
        return Object.entries(rooms).reduce((prev, [id, room]: [string, any]) => { 
            return room.sockets.length < 2 ? {...prev, [id]: room}: prev
        }, {})
    }

    useEffect(() => {
        socket.on("room_created", (room: any) => {
            setRooms({ ...rooms, [room.id]: room })
        });

        socket.on("disconnect", () => {
            socket.once("connect", () => {
                socket.emit("get_clients", (rooms: any[]) => {
                    setRooms(filterOutFullRooms(rooms))
                })
            })
        })

        socket.on("room_removed", (room: string) => {
            let tempRooms: any = { ...rooms };

            delete tempRooms[room];
            
            setRooms(tempRooms);
        });

        socket.on("get_rooms", (rooms: any[]) => {
            setRooms(filterOutFullRooms(rooms))
        })

        return cleanup;
    }, [rooms]);

    useEffect(() => {
        socket.emit("get_rooms", setRooms)
    }, [])

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
                <h1 className="welcome-user">Welcome to tictactoe <span className="username">{userState.name}</span>
                <span style={{ marginTop: 0 }} className="center light hint">You can create, search or join a room using the fields below</span></h1>
                <div className="controls">
                    <Input id="room-filter" label="search rooms" onKeyUp={handleRoomsFilter} />
                    <button className="large blue" onClick={handleRoomCreate}>Create Room</button>
                </div>
                <div className="tables">
                    <Table
                        style={{ height: "100%" }}
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
        </main>
    )
};

export default Lobby;