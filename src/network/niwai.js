import axios from "axios";
import { message } from "antd";
import Nprogress from 'nprogress';
import store from '../store';
import { delUserInfo } from "../store/slices/userSlice";
import { BASE_URL } from "../config";
import 'nprogress/nprogress.css';

const instance = axios.create({
  baseURL: BASE_URL
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    Nprogress.start()
    const {token} = store.getState().userInfo || ''
    if(token) {
      config.headers.Authorization = 'niwai_' + token
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
// 响应拦截器
instance.interceptors.response.use(
  response => {
    Nprogress.done()
    return response.data;
  }, error => {
    Nprogress.done()
    const statusCode = error.response?error.response.status: ''
    // token过期
    if(statusCode === 401) {
      message.error('身份验证失败，请重新登录！')
      store.dispatch(delUserInfo());
    }else {
      message.error(error.message + '，请联系管理员')
    }
    return new Promise(() => { })
  })

export default instance