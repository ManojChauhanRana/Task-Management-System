import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
    initAuth: (state) => {
      if (typeof window !== 'undefined') {
        state.accessToken = localStorage.getItem('accessToken');
        state.refreshToken = localStorage.getItem('refreshToken');
        state.isAuthenticated = !!state.accessToken;
      }
    }
  }
});

export const { setCredentials, logout, initAuth } = authSlice.actions;
export default authSlice.reducer;
