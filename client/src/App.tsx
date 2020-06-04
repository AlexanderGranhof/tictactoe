import React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { UserProvider } from "./context/user";

import Grid from "./components/grid/Grid";

import Lobby from "./views/Lobby/Lobby";
import Home from "./views/Home/Home";

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
            <nav style={{zIndex: 100, position: "absolute", right: 0}}>
                <Link to="/">home</Link>
                <Link to="/lobbies">lobbies</Link>
            </nav>
                <Route render={({ location }) => (
                    <TransitionGroup>
                        <CSSTransition
                            key={location.key}
                            timeout={300}
                            classNames="page-fade"
                        >
                            <Switch location={location}>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/lobbies" component={Lobby} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )} />
            </BrowserRouter>
        </UserProvider>

    );
}

export default App;
