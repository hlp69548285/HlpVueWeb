// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {Axios} from 'axios'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/mdui-v0.4.2/css/mdui.css'
import '../static/mdui-v0.4.2/js/mdui'
import store from './store/store'
import './axios/index'
Vue.use(ElementUI)
Vue.config.productionTip = false
// 全局加载resource拦截器
// axios.defaults.withCredentials = true
// Vue.prototype.$axios = axios
Vue.prototype.$http = Axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
