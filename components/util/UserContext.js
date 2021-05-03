import React, { createContext } from "react";

// const UserContext = React.createContext({
//     uploadedImageProp: [],
//     test: 'bruh',
//     update: (data) => {  }
// })
//
const UserContext = React.createContext({
    ImageProps: [],
    updateImageProps: (data) => {  }
})

export default UserContext
