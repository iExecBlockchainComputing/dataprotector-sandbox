import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";


export interface AppState {
    lastProtectedDataCreated: string
    userAddressRestricted: string
}

const initialState: AppState = {
    lastProtectedDataCreated: '',
    userAddressRestricted: ''
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLastProtectedDataCreated: (state, action) => {
            state.lastProtectedDataCreated = action.payload
        },
        setUserAddressRestricted: (state, action) => {
            state.userAddressRestricted = action.payload
        }
    }
})


export default appSlice.reducer
export const selectProtectedDataCreated = (state: RootState) => state.app.lastProtectedDataCreated
export const selectUserAddressRestricted = (state: RootState) => state.app.userAddressRestricted
export const { setLastProtectedDataCreated, setUserAddressRestricted } = appSlice.actions
