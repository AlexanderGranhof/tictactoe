import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Grid from "./components/grid/Grid";
import Lobby from "./views/Lobby/Lobby";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Lobby} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
