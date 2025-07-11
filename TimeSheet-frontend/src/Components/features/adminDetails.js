

import { createSlice } from "@reduxjs/toolkit";
// reducer for handling modal state value 

// initial state value for adminDetails
const initialAdminDetailsState = {
    adminDetails:null,
    adminDetailsEditValue:false,
    isAuthenticated:false
};


export const adminDetailsSlice =createSlice({
    name: 'adminDetails',
    initialState: { value: initialAdminDetailsState },
    reducers: {
        // set the value for admin details
          changeAdminDetails:(state,action)=>{
              state.value.adminDetails=action.payload;
          }
        ,
        // change the state value once edit admin completed
        adminDetailsEdit:(state,action)=>{
           state.value.adminDetailsEditValue=action.payload;
        },
        authenticate:(state,action)=>{
            state.value.isAuthenticated=action.payload;
         }
      
    }
});

// function to change the value
export const {changeAdminDetails,adminDetailsEdit,authenticate}=adminDetailsSlice.actions;
// reducer to access the data 
export default  adminDetailsSlice.reducer;