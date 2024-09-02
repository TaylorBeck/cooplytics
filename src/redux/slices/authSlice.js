import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  idToken: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.idToken = action.payload.idToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: state => {
      state.user = null;
      state.idToken = null; // Clear idToken
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    reset: state => initialState // Add reset action
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  reset
} = authSlice.actions;

export default authSlice.reducer;
