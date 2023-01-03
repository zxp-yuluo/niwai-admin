import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'

// 创建store 
const store = configureStore({
  reducer: {
    userInfo: userSlice.reducer
  }
})

export default store