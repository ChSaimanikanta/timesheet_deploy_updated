import { createSlice } from "@reduxjs/toolkit";

export const submitBtnSlice=createSlice({
     name:"submitBtn",
    initialState:{
        value:{
            isSubmit:false
        }
    },
    reducers:{
        submitON:(state,action)=>{
            state.value.isSubmit=action.payload;
            

        },
        submitOFF:(state,action)=>{
            state.value.isSubmit=action.payload;
        }
    }

});
export const {submitON,submitOFF}=submitBtnSlice.actions;
export default submitBtnSlice.reducer;