// superadminLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';
const savedEmployee = JSON.parse(localStorage.getItem("superadminLogin")) || null;
const superadminLoginSlice = createSlice({
  name: 'superadminLogin',
  initialState: { value: savedEmployee },
  reducers: {
    loginSuperadmin: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("superadminLogin", JSON.stringify(action.payload));

    },
    logoutSuperadmin: (state) => {
      state.value = {}; // Clear superadmin data on logout
      localStorage.removeItem("superadminLogin");
    },
  },
});

export const { loginSuperadmin, logoutSuperadmin } = superadminLoginSlice.actions;
export default superadminLoginSlice.reducer;
