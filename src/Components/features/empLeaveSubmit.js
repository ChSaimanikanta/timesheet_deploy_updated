
import { createSlice } from "@reduxjs/toolkit";

export const empLeaveSubmitSlice=createSlice({
     name:"leaveSubmitBtn",
    initialState:{
        value:{
            isSubmit:false
        }
    },
    reducers:{
        leaveSubmitON:(state,action)=>{
            state.value.isSubmit=action.payload;
            

        },
        leaveSubmitOFF:(state,action)=>{
            state.value.isSubmit=action.payload;
        }
    }

});
export const {leaveSubmitON,leaveSubmitOFF}=empLeaveSubmitSlice.actions;
export default empLeaveSubmitSlice.reducer;