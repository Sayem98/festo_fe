import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  users: [],
  isLoadedUser: false,
  currentUser: {},
  tempMount: 0,
  showAchievement: false,
}

export const UsersReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
      state.isLoadedUser = true
    },
    setTempMount: (state, action) => {
      state.tempMount = action.payload
    },
    setShowAchievement: (state, action) => {
      state.showAchievement = action.payload
    },
  },
})

export const { setUsers, setCurrentUser, setTempMount, setShowAchievement } =
  UsersReducer.actions

export default UsersReducer.reducer
