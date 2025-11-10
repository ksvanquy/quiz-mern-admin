import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, storage } from "../../utils/storage";
import type { User } from "../../interfaces/User";

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      state.token = storage.get<string>(AUTH_TOKEN_KEY) || null;
      state.user = storage.get<User>(AUTH_USER_KEY) || null;
    },
    loginStart(state) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user?: User | null }>) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user ?? null;
      storage.set(AUTH_TOKEN_KEY, action.payload.token);
      if (action.payload.user) storage.set(AUTH_USER_KEY, action.payload.user);
    },
    loginFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      storage.remove(AUTH_TOKEN_KEY);
      storage.remove(AUTH_USER_KEY);
    },
  },
});

export const { hydrateFromStorage, loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

