<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red" v-html="errormsg">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="模块编码" prop="gatename">
        <el-input v-model="form.gatename"></el-input>
      </el-form-item>
      <el-form-item label="服务器ip" prop="serverip">
        <el-input v-model="form.serverip"></el-input>
      </el-form-item>
      <el-form-item label="服务器端口" prop="serverport">
        <el-input v-model="form.serverport"></el-input>
      </el-form-item>
      <el-form-item label="网络ID" prop="netid">
        <el-input v-model="form.netid"></el-input>
      </el-form-item>
      <el-form-item label="模块ID" prop="modid">
        <el-input v-model="form.modid"></el-input>
      </el-form-item>
      <el-form-item label="传输方式" prop="transport">
        <el-select v-model="form.transport" placeholder="请选择监测类型">
          <el-option label="定点" value="point"></el-option>
          <el-option label="透传" value="all"></el-option>
        </el-select>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="串口波特率" prop="serialband">
        <el-input v-model.number="form.serialband"></el-input>
      </el-form-item>
      <el-form-item label="数据位" prop="serialdatabit">
        <el-input v-model.number="form.serialdatabit"></el-input>
      </el-form-item>
      <el-form-item label="停止位" prop="serialstop">
        <el-input v-model.number="form.serialstop"></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="空中速率" prop="rfband">
        <el-input v-model.number="form.rfband"></el-input>
      </el-form-item>
      <el-form-item label="发射功率" prop="rfdatarate">
        <el-input v-model.number="form.rfdatarate"></el-input>
      </el-form-item>
      <el-form-item label="设备频道" prop="rfchannel">
        <el-input v-model.number="form.rfchannel"></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">立即保存</el-button>
        <router-link :to="{path:'/gatewayindex'}">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addGateway, getGateway } from '../../api/api.js'
export default {
  name: 'GatewayAdd',
  data () {
    return {
      form: {
        gatename: '',
        serverip: '',
        serverport: '',
        netid: '',
        modid: '',
        serialband: '',
        serialdatabit: '',
        serialstop: '',
        rfband: '',
        rfdatarate: '',
        rfchannel: '',
        transport: ''
      },
      rules: {
        gatename: [
          { required: true, message: '网关不能为空', trigger: 'blur' }
        ],
        serverip: [
          { required: true, message: '服务器ip不能为空', trigger: 'blur' }
        ],
        serverport: [
          { required: true, message: '服务器端口不能为空', trigger: 'blur' }
        ],
        netid: [{ required: true, message: '网络id不能为空', trigger: 'blur' }],
        modid: [{ required: true, message: '模块id不能为空', trigger: 'blur' }]
      },
      errormsg: '',
      errordialogVisible: false
    }
  },
  mounted () {
    console.log('1')
    if (
      document.body.scrollHeight >
      (window.innerHeight || document.documentElement.clientHeight)
    ) {
      console.log('2')
      document.getElementsByTagName('body')[0].className = ''
    } else {
      document.getElementsByTagName('body')[0].className =
        'mdui-bottom-nav-fixed mdui-bottom-nav-scroll-hide'
    }
  },
  created () {
    this.getgateway()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getgateway () {
      let _this = this
      getGateway().then(response => {
        _this.gateways = response.data.results
      })
    },
    onSubmit () {
      let _this = this
      addGateway({
        gatename: _this.form.gatename,
        transport: _this.form.transport,
        netid: _this.form.netid,
        modid: _this.form.modid,
        serialband: _this.form.serialband,
        serialdatabit: _this.form.serialdatabit,
        serialstop: _this.form.serialstop,
        rfband: _this.form.rfband,
        rfdatarate: _this.form.rfdatarate,
        rfchannel: _this.form.rfchannel,
        serverip: _this.form.serverip,
        serverport: _this.form.serverport
      })
        .then(response => {
          console.log(_this)
          _this.$router.push({ path: '/gatewayindex' })
        })
        .catch(error => {
          let count = 1
          _this.errormsg = ''
          let fieldname = ''
          for (let i in error) {
            if (i === 'serverip') {
              fieldname = '服务器ip'
            }
            if (i === 'serverport') {
              fieldname = '服务器端口'
            }
            if (i === 'netid') {
              fieldname = '网络id'
            }
            if (i === 'modid') {
              fieldname = '模块id'
            }
            if (i === 'serialband') {
              fieldname = '串口频率'
            }
            if (i === 'serialdatabit') {
              fieldname = '数据位'
            }
            if (i === 'serialstop') {
              fieldname = '终止位'
            }
            if (i === 'rfband') {
              fieldname = '空中速率'
            }
            if (i === 'rfdatarate') {
              fieldname = '发射功率'
            }
            if (i === 'rfchannel') {
              fieldname = '设备频道'
            }
            if (i === 'transpo') {
              fieldname = '传输方式'
            }
            _this.errormsg +=
              '<div>' + count + '、' + fieldname + ':' + error[i] + '</div>'
            count++
          }
          _this.errordialogVisible = true
        })
    }
  }
}
</script>
<style scoped>
.el-form-item {
  display: inline-block;
  width: 300px;
}
</style>
