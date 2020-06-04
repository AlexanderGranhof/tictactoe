import React, { createContext, FunctionComponent, useState } from "react";

const initialContext = {
    name: ""
};

const userContext = createContext<any>([]);

const UserProvider: FunctionComponent = ({children}) => {
    const [ userState, setUserState ] = useState(initialContext);

    return (
        <userContext.Provider value={[userState, setUserState]}>
            { children }
        </userContext.Provider>
    )
}

export { userContext, UserProvider };