<template>
  <div id='nav' style="position:fixed;width:100%;z-index:1000">
    <el-dialog
      title="错误提示"
      :visible.sync="errordialogVisible"
      :default-active="activeIndex"
      width="500px"
    >
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      router
      active-text-color="#ffd04b">
      <el-menu-item index="/index">信息概览</el-menu-item>
      <el-submenu index="2">
        <template slot="title">人员</template>
        <el-menu-item index="/user">人员管理</el-menu-item>
        <el-menu-item index="/permisson">权限管理</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">设备</template>
        <el-menu-item index="/area">区域管理</el-menu-item>
        <el-menu-item index="/device">设备管理</el-menu-item>
        <el-menu-item index="/devicefile">设备文件</el-menu-item>
        <el-menu-item index="/deviceproduct">设备产品管理</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">网关与终端</template>
        <el-menu-item index="/gatewayindex">网关管理</el-menu-item>
        <el-menu-item index="/terminalindex">终端管理</el-menu-item>
        <el-menu-item index="/terminalinstall">模块安装</el-menu-item>
        <el-menu-item index="/threshold">阈值管理</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
          <template slot="title">
              预警维护
          </template>
        <el-menu-item index="/warn">预警管理</el-menu-item>
        <el-menu-item index="/maintain">设备维护</el-menu-item>
        <el-menu-item index="/maintainsetting">维护设定</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">数据</template>
        <el-menu-item index="/data">数据统计</el-menu-item>
        <el-menu-item index="/datadetail">电量数据详情</el-menu-item>
        <el-menu-item index="/lightdatadetail">光照数据详情</el-menu-item>
        <el-menu-item index="/vibrationdatadetail">震动数据详情</el-menu-item>
        <el-menu-item index="/plcdata">plc数据详情</el-menu-item>
        <el-menu-item index="/tempturedata">温度数据详情</el-menu-item>
      </el-submenu>
      <el-menu-item index="/setdata">参数设置</el-menu-item>
      <div class="circle" @mouseenter="changeshow" @mouseleave="changeshow" style="cursor:pointer">
        <el-badge :value="warnvalue" class="item" type="warning" style="top:5px;right:60px;">
        <i class="mdui-icon material-icons imgcircle">&#xe853;</i>
              </el-badge>
        <transition name="el-fade-in">
          <div v-show="loginshow" class="transition-box floatcontent">
            <div class="mdui-collapse-item">
              <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
                <i
                  class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-white"
                >&#xe851;</i>
                <div class="mdui-list-item-content">{{loginname}}</div>
              </div>
            </div>
            <div class="mdui-collapse-item" @click="dialogVisible = true">
              <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
                <i
                  class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-white"
                >&#xe3c9;</i>
                <div class="mdui-list-item-content">修改密码</div>
              </div>
            </div>
            <div class="mdui-collapse-item" @click="logoff">
              <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
                <i
                  class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-white"
                >&#xe566;</i>
                <div class="mdui-list-item-content">退出登录</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </el-menu>
    <!-- 修改密码 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      style="min-width:500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原密码" prop="oldpassword">
          <el-input type="password" v-model="form.oldpassword"></el-input>
        </el-form-item>
        <el-form-item prop="newpassword" label="新密码">
          <el-input type="password" v-model="form.newpassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changepassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { cookie } from '../../api/api.js'
// import axios from 'axios'
// import { cookie, changePassword } from '../../api/api.js'
import { cookie, changeP, getStatus } from '../../api/api.js'
// import { setInterval } from 'timers'
// import $ from 'jquery'
export default {
  name: 'Nav',
  data () {
    var checkpass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      errormsg: '',
      errordialogVisible: false,
      activeIndex: '2',
      loginname: cookie.getCookie('name'),
      loginshow: false,
      dialogVisible: false,
      warnvalue: 0,
      setdatano: 0,
      setdatawait: 0,
      setdataok: 0,
      notify: '',
      form: {
        oldpassword: '',
        newpassword: '',
        password: ''
      },
      rules: {
        oldpassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: checkpass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    let _this = this
    setInterval(_this.getstatus, 10000)
  },
  methods: {
    getstatus () {
      let _this = this
      let messagex = ''
      getStatus({
        'setdatano': _this.setdatano,
        'setdataok': _this.setdataok,
        'setdatawait': _this.setdatawait
      }).then((response) => {
        _this.warnvalue = response.data.warnnum
        _this.setdatano = response.data.no.all
        _this.setdataok = response.data.ok.all
        _this.setdatawait = response.data.wait.all
        if (_this.warnvalue > 0) {
          if (_this.notify !== '') {
            _this.notify.close()
          }
          messagex = `<strong ">当前有<span style="color:red">${_this.warnvalue} </span>个报警未处理</strong>`
          if (response.data.no.count !== 0) {
            messagex += `<br><strong ">当前有<span style="color:red">${response.data.no.count} </span>个指令设置失败</strong>`
          }
          if (response.data.ok.count !== 0) {
            messagex += `<br><strong ">当前有<span style="color:red">${response.data.ok.count} </span>个指令设置成功</strong>`
          }
          if (response.data.wait.count !== 0) {
            messagex += `<br><strong ">当前有<span style="color:red">${response.data.wait.count} </span>个指令等待设置</strong>`
          }
          _this.notify = _this.$notify.error({
            title: '错误',
            dangerouslyUseHTMLString: true,
            message: messagex,
            position: 'bottom-right',
            duration: 0
          })
          console.log(_this.notify)
        }
      })
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    logoff: function () {
      this.$confirm('是否确认退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('logout')
          cookie.delCookie('name')
          cookie.delCookie('token')
          this.$store.dispatch('setInfo')
          this.$router.push({ path: '/login' })
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {})
    },
    changeshow () {
      this.loginshow = !this.loginshow
    },
    changepassword () {
      let _this = this
      let headers = {
        'X-CSRFToken': cookie.getCookie('csrftoken')
      }
      changeP(headers, {
        oldpassword: this.form.oldpassword,
        newpassword: _this.form.newpassword,
        id: cookie.getCookie('id'),
        csrfmiddlewaretoken: cookie.getCookie('csrftoken')
      })
        .then(response => {
          this.$message({
            type: 'error',
            message: `修改成功，请重新登录`
          })
          cookie.delCookie('name')
          cookie.delCookie('token')
          this.$store.dispatch('setInfo')
          this.$router.push({ path: '/login' })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: `${error}`
          })
        })
    }
  }
}
</script>
<style scoped>
.circle {
  width: 50px;
  height: 50px;
  float: right;
  margin-right: 20px;
  margin-top: 5px;
  border-radius: 100%;
}
.floatcontent {
  position: absolute;
  top: 60px;
  right: 0px;
  display: inline-block;
  background-color: #3399da;
  width: 160px;
  height: 144px;
  color: white;
}
.floatcontent > div {
  border-bottom: 1px solid white;
}
.imgcircle {
  font-size: 50px;
  color: deepskyblue;
}
.content {
  display: inline-block;
  background-color: #00979d;
  color: aliceblue;
  border: 1px solid;
  line-height: 40px;
  width: 100px;
  height: 40px;
}
sup {
    position: absolute;
    top: 5px !important;
    right: 60px;
    -webkit-transform: translateY(-50%) translateX(100%);
    transform: translateY(-50%) translateX(100%);
}
</style>
