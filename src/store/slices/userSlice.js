import { createSlice } from '@reduxjs/toolkit'
const initialState = {}
const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
initialState.user = user ? JSON.parse(user) : {}
initialState.token = token ? token : ''
initialState.isLogin = user && token ? true : false
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
      state.isLogin = true
    },
    delUserInfo(state) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      state.user = null
      state.token = ''
      state.isLogin = false
    }
  }
})

export const { setUserInfo,delUserInfo } = userSlice.actions

export default userSlice;
