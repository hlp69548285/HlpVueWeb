// 引入vue
import axios from 'axios'
// import cookie from '../api/index'
import router from '../router/index'
// 全局状态控制引入
import store from '../store/store'
// http request 拦截器
axios.defaults.withCredentials = true
axios.interceptors.request.use(
  config => {
    config.withCredentials = true
    if (store.state.userInfo.token) {
      config.headers.Authorization = `JWT ${store.state.userInfo.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  undefined,
  error => {
    console.log(123)
    if (error.response !== undefined) {
      let res = error.response
      switch (res.status) {
        case 401:
          console.log('未登录 或者token过期')
          router.push({path: '/login'})
          break
        case 403:
          console.log('您没有该操作权限')
          break
        case 500:
          console.log('服务器错误')
          router.push({path: '/500'})
          break
        default:
          console.log('未知错误')
      }
      return Promise.reject(error.response.data)
    }
    if (error.message === 'Network Error') {
      router.push({path: '/neterror'})
      console.log('网络错误')
    }
    // 返回接口返回的错误信息
  })
