// supervisorLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';
const savedEmployee = JSON.parse(localStorage.getItem("supervisorLogin")) || null;

const supervisorLoginSlice = createSlice({
  name: 'supervisorLogin',
  initialState: { value:savedEmployee },
  reducers: {
    loginSupervisor: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("supervisorLogin", JSON.stringify(action.payload));

    },
    logoutSupervisor: (state) => {
      state.value = {}; // Clear supervisor data on logout
      localStorage.removeItem("supervisorLogin");

    },
  },
});

export const { loginSupervisor, logoutSupervisor } = supervisorLoginSlice.actions;
export default supervisorLoginSlice.reducer;
