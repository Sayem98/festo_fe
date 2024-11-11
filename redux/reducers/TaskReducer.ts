import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    tasks: [],
    isLoadedtask: false,
    user: undefined,
    pubKey: null,
    priKey: null,
    rate:null,
}

export const TaskReducer = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            
        },
        setRate: (state, action) => {
            state.rate = action.payload
            
        },
        setTasks: (state, action) => {
            // console.log(action.payload)
            state.tasks = action.payload
            state.isLoadedtask = true
        },
        setKeyPairs: (state, action) => {
            state.pubKey = action.payload.publicKey
            state.priKey = action.payload.privateKey
            // console.log(action.payload)
        },
        removeKeyPairs: (state, action) => {
            state.pubKey = null
            state.priKey = null
        },
    },
})

export const { setUser,setRate, setTasks, setKeyPairs, removeKeyPairs } = TaskReducer.actions

export default TaskReducer.reducer