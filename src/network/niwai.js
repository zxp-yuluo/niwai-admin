import axios from "axios";
import { message } from "antd";
import { BASE_URL } from "../config";

const instance = axios.create({
  baseURL: BASE_URL
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    return config;
  }, error => {
    return Promise.reject(error);
  });
// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data;
  }, error => {
    console.log(error.message);
    message.error(error.message + '，请联系管理员')
    return new Promise(() => { })
  })

export default instance