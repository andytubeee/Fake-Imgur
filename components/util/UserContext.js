import React, { createContext } from "react";

const UserContext = React.createContext({
    user_SignedIn: false,
    user: {},
    update: (data) => { }
})

export default UserContext
