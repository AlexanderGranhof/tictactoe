import React from 'react';
import Socket from "./socket/Socket";
import Grid from "./components/grid/Grid";

Socket.connect();

function App() {
    return (
        <Grid />
    );
}

export default App;
