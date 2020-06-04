import React, { FunctionComponent, useRef, RefObject, MutableRefObject, useState, useEffect, useContext } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./Home.scss";
import { userContext } from "../../context/user";
import { RouteComponentProps } from "react-router-dom";

const Home: FunctionComponent<RouteComponentProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [ userState, setUserState ] = useContext(userContext);
    const { history } = props;

    const handlePageClick = () => {
        inputRef.current && inputRef.current.focus();
    };

    const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const isEnter = event.key === "Enter";

        if (isEnter) {
            const name = event.currentTarget.value;
            setUserState({...userState, name})

            history.push("/lobbies")
        }
    }

    return (
        <main className="page welcome-fade">
            <div className="welcome-box" onClick={handlePageClick}>
                <div className="welcome-inputs">
                        <CSSTransition
                            // key={1}
                            timeout={300}
                            in={true}
                            appear={true}
                            classNames="myFade"
                        >
                            <h1 className="welcome-title">Welcome, please enter your name</h1>
                        </CSSTransition>
                    <input onKeyDown={handleKeydown} ref={inputRef} autoFocus spellCheck={false} className="welcome-username" type="text"/>
                </div>
            </div>
        </main>
    )
};

export default Home