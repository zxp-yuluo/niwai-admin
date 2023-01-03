import { createSlice } from '@reduxjs/toolkit'
const initialState = {}
const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
initialState.user = user ? JSON.parse(user) : {}
initialState.token = token ? token : ''
const userSlice = createSlice({
  initialState,
  name: 'nw',
  reducers: {
    setUserInfo(state, action) {
      const { data, token } = action.payload
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('token', token)
      state.user = data
      state.token = token
    }
  }
})

export const { setUserInfo } = userSlice.actions

export default userSlice;
