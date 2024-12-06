import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { appUrl } from '@/utils/env'

// 创建axios实例
let service =  axios.create({
  baseURL: appUrl, // api的base_url
  timeout: 5000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  debugger
  config.withCredentials = true;
  if (store.getters.token) {
    config.headers = {
      'Authorization' : "Token " + getToken('Token'), //携带权限参数
     };
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
   /**
    * code:200,接口正常返回;
    */
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })


      return Promise.reject('error')
    } else { // res.code === 200,正常返回数据
        return response.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
