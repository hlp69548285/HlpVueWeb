<template>
  <div id='content'>
    <el-dialog title='错误提示' :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div id="login">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>合立普物联11网能源管理系统</span>
        </div>
        <div class="logincontent">
          <el-input v-model="username" placeholder="请输入帐号" @keyup.enter.native="login">
            <template slot="prepend">账户</template>
          </el-input>
        </div>
        <div class="logincontent">
          <el-input v-model="password" type="password" placeholder="请输入密码" @keyup.enter.native="login">
            <template slot="prepend">密码</template>
          </el-input>
        </div>
        <div class="el-button el-button--primary logincontent" style="width:100%" @click="login" >登录</div>
      </el-card>
    </div>
  </div>
</template>
<style >
.el-row {
  margin-bottom: 20px;
}
.login-box {
  margin-top: 20%;
  margin-left: 40%;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
<script>
import { login, cookie } from '../../api/api.js'
export default {
  name: 'Login',
  data () {
    return {
      errormsg: '',
      errordialogVisible: false,
      username: '',
      password: ''
    }
  },
  created () {},
  methods: {
    checklogin: function () {
      let username = cookie.getCookie('name')
      console.log(username)
      if (username !== undefined) {
        this.$router.push({ path: '/' })
      }
    },
    login: function () {
      var _this = this
      login({
        username: _this.username,
        password: _this.password
      })
        .then(response => {
          console.log(response)
          cookie.setCookie('name', _this.username, 7)
          cookie.setCookie('token', response.data.token, 7)
          cookie.setCookie('id', response.data.id, 7)
          cookie.setCookie('csrftoken', response.data.csrftoken, 7)
          _this.$store.dispatch('setInfo')
          _this.$router.push({ path: '/' })
        })
        .catch(error => {
          console.log(error)
          let count = 1
          _this.errormsg = ''
          for (let i in error) {
            _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
            count++
          }
          _this.errordialogVisible = true
        })
    }
  }
}
</script>
<style scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
body {
  background-color: cornflowerblue !important;
}
#login {
  position: absolute;
  width: 574px;
  height: 160px;
  left: 50%;
  top: 38%;
  margin-left: -287px;
  margin-top: -80px;
}
.logincontent {
  margin-top: 5px;
}
</style>
