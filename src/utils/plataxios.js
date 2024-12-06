import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { appUrl } from '@/utils/env'
import { contentType } from '@/config/net.config'
axios.defaults.withCredentials=true

// 创建axios实例
let service =  axios.create({
  baseURL: appUrl, // api的base_url
  timeout: 5000, // 请求超时时间
  withCredentials: true,
  headers: {
    'Content-Type': contentType,
  }
})
// request拦截器
service.interceptors.request.use(config => {
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
      debugger


      if (typeof res === 'string' && res.indexOf("<h2 class=\"form-signin-heading\">Please sign in</h2>")>0 ) {

        store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
        return Promise.reject('error')
      }

      if ((res.code !== '200' && res.code !== 200 && res.code != null)) {

        debugger
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        // 根据服务端约定的状态码：5001:非法的token; 5002:其他客户端登录了; 5004:Token 过期了;
        if ( (res.code === 5001 || res.code === 5002 || res.code === 5004)) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('LogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          })
        }
        return Promise.reject('error')
      } else { //正常返回数据

        console.log("succ"+response.data)
        return response.data
      }
    },
    error => {
debugger
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
)

export default service
