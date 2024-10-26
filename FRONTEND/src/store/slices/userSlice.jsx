import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo:localStorage.getItem("userInfo")
    ?JSON.parse(localStorage.getItem("userInfo"))
    :null
}
const userSlice=createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUserDetails:(state,action)=>{
            state.userInfo=action.payload;
            localStorage.setItem("userInfo",JSON.stringify(action.payload))
        },
        logoutUser:(state)=>{
            state.userInfo=null
            localStorage.removeItem("userInfo")
            localStorage.removeItem('accessToken')
            
        }
    }
})

export const {setUserDetails, logoutUser}=userSlice.actions
export default userSlice.reducer;