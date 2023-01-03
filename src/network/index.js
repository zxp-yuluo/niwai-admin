import niwai from './niwai'

// 登录
export const login = data => niwai.post('/login',data)