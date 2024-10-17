import { configureStore } from "@reduxjs/toolkit";

import adminSlice from './slices/adminSlice'
import userSlice from './slices/userSlice'
const store=configureStore({
    reducer:{
        user:userSlice,
        admin:adminSlice
    },
    devTools:true
})

export default store