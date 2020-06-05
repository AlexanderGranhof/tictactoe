import React, { createContext, FunctionComponent, useState } from "react";

const baseContext = { name: "" }

let initialContext: any;

const cachedString = localStorage.getItem("context.userContext");

try {
    initialContext = cachedString === null ? baseContext : JSON.parse(cachedString);
} catch {
    initialContext = baseContext
}

const userContext = createContext<any>([]);

const UserProvider: FunctionComponent = ({children}) => {
    const [ userState, setState ] = useState(initialContext);

    const setUserState = (data: any) => { 
        localStorage.setItem("context.userContext", JSON.stringify(data))
        
        return setState(data);
    }

    return (
        <userContext.Provider value={[userState, setUserState]}>
            { children }
        </userContext.Provider>
    )
}

export { userContext, UserProvider };