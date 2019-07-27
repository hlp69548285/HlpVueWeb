<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {cookie} from '../src/api/api.js'
export default {
  name: 'App',
  mounted () {
    this.checklogin()
  },
  methods: {
    changeFooter () {
    },
    checklogin () {
      console.log(123)
      let username = cookie.getCookie('name')
      console.log(username)
      if (username === null) {
        this.$router.push({path: '/login'})
      }
    }
  }
}
window.onresize = function () {
  if (document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)) {
    console.log('2')
    document.getElementsByTagName('body')[0].className = ''
  } else {
    document.getElementsByTagName('body')[0].className = 'mdui-bottom-nav-fixed mdui-bottom-nav-scroll-hide'
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
html{
  overflow-y:scroll;
}
html,body{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#content{
  padding: 100px
}
.el-form-item__label{
    width: 95px !important;
  }
.el-form-item__content{
  margin-left: 100px !important;
}
.mdui-bottom-nav{
  background-color: rgb(84, 92, 100) !important;
  color: rgb(255, 208, 75) !important;
}
.echarts {
  width: 100%;
  height: 100%;
}
.el-table th {
  background-color:slategray !important;
  color: aliceblue !important;
}
  button{
  margin-left: 5px !important;
}
.el-select,.el-select .el-input {
  width: 120px !important;
}
</style>
