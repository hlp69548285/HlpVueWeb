import * as types from './mutation-types'
import cookie from '../../static/cookie'
import Vue from 'vue'
import Axios from 'axios'
Vue.prototype.$http = Axios

export default {
  [types.SET_INFO] (state) {
    state.userInfo = {
      name: cookie.getCookie('name'),
      token: cookie.getCookie('token')
    }
    console.log(state.userInfo)
  }
}
