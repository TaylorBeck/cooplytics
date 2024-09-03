import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  guestToken: null,
  guestFarmId: null,
  loading: false,
  error: null,
  idToken: null
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
      state.idToken = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.guestToken = null;
      state.guestFarmId = null;
      state.loading = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    reset: state => initialState,
    setGuestAccess: (state, action) => {
      state.isGuest = true;
      state.guestToken = action.payload.guestToken;
      state.guestFarmId = action.payload.farmId;
      state.isAuthenticated = true;
    },
    clearGuestAccess: state => {
      state.isGuest = false;
      state.guestToken = null;
      state.guestFarmId = null;
      state.isAuthenticated = false;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  reset,
  setGuestAccess,
  clearGuestAccess
} = authSlice.actions;

export default authSlice.reducer;
