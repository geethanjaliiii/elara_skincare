import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminInfo : localStorage.getItem("adminInfo")
    ?JSON.parse(localStorage.getItem("adminInfo"))
    :null
}

const adminSlice=createSlice({
    name: "admin",
    initialState,
    reducers:{
        setAdminDetails:(state,action)=>{
            state.adminInfo=action.payload
            localStorage.setItem("adminInfo",JSON.stringify(action.payload))
        },
        logoutAdmin:(state)=>{
            state.adminInfo=null
            localStorage.removeItem("adminInfo")
            
        }
    }
})

export const {setAdminDetails, logoutAdmin}=adminSlice.actions
export default adminSlice.reducer;