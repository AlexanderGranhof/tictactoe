import React from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { UserProvider } from "./context/user";

import Lobby from "./views/Lobby/Lobby";
import Home from "./views/Home/Home";
import Room from "./views/Room/Room";

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
                                <Route exact path="/room" render={() => <Redirect to="/lobbies" />} />
                                <Route exact path="/room/:id" component={Room} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )} />
            </BrowserRouter>
        </UserProvider>

    );
}

export default App;
