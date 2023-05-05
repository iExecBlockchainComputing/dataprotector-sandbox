import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface AppState {
  lastProtectedDataCreated: string;
  authorizedUser: string;
}

const initialState: AppState = {
  lastProtectedDataCreated: '',
  authorizedUser: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLastProtectedDataCreated: (state, action) => {
      state.lastProtectedDataCreated = action.payload;
    },
    setAuthorizedUser: (state, action) => {
      state.authorizedUser = action.payload;
    },
  },
});

export default appSlice.reducer;
export const selectProtectedDataCreated = (state: RootState) =>
  state.app.lastProtectedDataCreated;
export const selectAuthorizedUser = (state: RootState) =>
  state.app.authorizedUser;
export const { setLastProtectedDataCreated, setAuthorizedUser } =
  appSlice.actions;
