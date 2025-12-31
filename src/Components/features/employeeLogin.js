// employeeLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';
const savedEmployee = JSON.parse(localStorage.getItem("employeeLogin")) || null;
const employeeLoginSlice = createSlice({
  name: 'employeeLogin',
  initialState: { value: savedEmployee },
  reducers: {
    loginEmployee: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("employeeLogin", JSON.stringify(action.payload));
    },
    logoutEmployee: (state) => {
      state.value = {}; // Clear employee data on logout
      localStorage.removeItem("employeeLogin");
    },
  },
});

export const { loginEmployee, logoutEmployee } = employeeLoginSlice.actions;
export default employeeLoginSlice.reducer;
