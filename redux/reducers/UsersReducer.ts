import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    users: [],
    isLoadedUser: false,
    currentUser: {},
    tempMount: 0,
}

export const UsersReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
            // state.isLoadedUser = true
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
            state.isLoadedUser = true
        },
        setTempMount: (state, action) => {
            state.tempMount = action.payload
            // state.isLoadedUser = true
        },


    },
})

export const {setUsers, setCurrentUser, setTempMount } = UsersReducer.actions

export default UsersReducer.reducer