// adminLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';
const savedEmployee = JSON.parse(localStorage.getItem("adminLogin")) || null;

const adminLoginSlice = createSlice({
  name: 'adminLogin',
  initialState: { value:savedEmployee },
  reducers: {
    loginAdmin: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("adminLogin", JSON.stringify(action.payload));

    },
    logoutAdmin: (state) => {
      state.value = {}; // Clear admin data on logout
      localStorage.removeItem("adminLogin");

    },
  },
});

export const { loginAdmin, logoutAdmin } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
