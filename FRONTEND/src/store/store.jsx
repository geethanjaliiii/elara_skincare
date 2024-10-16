import { configureStore } from "@reduxjs/toolkit";


import userSlice from './slices/userSlice'
const store=configureStore({
    reducer:{
        user:userSlice
    },
    devTools:true
})

export default store