import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  builds: [],
  isLoadedBuilds: false,
  isLoadedThings: false,
  things: [],
}

export const BuildReducer = createSlice({
  name: 'build',
  initialState,
  reducers: {
    setBuilds: (state, action) => {
      state.builds = action.payload
      state.isLoadedBuilds = true
    },
    setThings: (state, action) => {
      state.things = action.payload
      state.isLoadedThings = true
    },
  },
})

export const { setBuilds, setThings } = BuildReducer.actions

export default BuildReducer.reducer
