import { createSlice } from "@reduxjs/toolkit";

export const submitAdminButtonSlice=createSlice({
     name:"submitAdminButton",
    initialState:{
        value:{
            isSubmit:false
        }
    },
    reducers:{
        submitAdminON:(state,action)=>{
            state.value.isSubmit=action.payload;
            

        },
        submitAdminOFF:(state,action)=>{
            state.value.isSubmit=action.payload;
        }
    }

});
export const {submitAdminON, submitAdminOFF}=submitAdminButtonSlice.actions;
export default submitAdminButtonSlice.reducer;