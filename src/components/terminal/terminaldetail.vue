<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="名称编号" prop="terminalnum">
        <el-input v-model="form.terminalnum"></el-input>
      </el-form-item>
      <el-form-item label="网络ID" prop="netid">
        <el-input v-model="form.netid"></el-input>
      </el-form-item>
      <el-form-item label="模块ID" prop="modid">
        <el-input v-model="form.modid"></el-input>
      </el-form-item>
      <el-form-item label="监测类型" prop="terminaltype">
        <el-select v-model="form.terminaltype" placeholder="请选择监测类型">
          <el-option label="电" value="ele"></el-option>
          <el-option label="气体" value="gas"></el-option>
          <el-option label="水" value="water"></el-option>
          <el-option label="震动" value="vibration"></el-option>
          <el-option label="光" value="light"></el-option>
          <el-option label="温度" value="temperture"></el-option>
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
      <el-form-item label="保存频率" prop="rfband">
        <el-input v-model.number="form.rfband"></el-input>
      </el-form-item>
      <el-form-item label="采集频率" prop="rfdatarate">
        <el-input v-model.number="form.rfdatarate"></el-input>
      </el-form-item>
      <el-form-item label="互感器倍数" prop="rfpower">
        <el-input v-model.number="form.rfpower"></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="所属网关">
        <el-select v-model="form.gateway" placeholder="请选择网关">
          <el-option :label="item.gatename" :value="item.id" v-for="item in gateways" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="line"></div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <router-link :to="{path:'/terminalindex'}">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getDevice,
  updateTerminal,
  getTerminalDetail,
  getGateway
} from '../../api/api.js'
export default {
  name: 'TerminalDetail',
  data () {
    return {
      errormsg: '',
      errordialogVisible: false,
      form: {
        terminaltype: '',
        terminalnum: '',
        netid: '',
        modid: '',
        serialband: '',
        serialdatabit: '',
        serialstop: '',
        rfband: '',
        rfdatarate: '',
        rfpower: '',
        device: '',
        gateway: ''
      },
      devices: [],
      gateways: [],
      rules: {
        terminalnum: [
          {
            required: true,
            message: '请输入编号',
            trigger: 'blur'
          }
        ],
        netid: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        modid: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        terminaltype: [
          {
            required: true,
            message: '请输入编号',
            trigger: 'blur'
          }
        ],
        serialband: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        serialdatabit: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        serialstop: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        rfband: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        rfdatarate: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        rfpower: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ]
      }
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
    this.getdevice()
    this.getdetail()
    this.getgateway()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this
          let terminalid = _this.$route.query.id
          updateTerminal(terminalid, {
            terminaltype: _this.form.terminaltype,
            terminalnum: _this.form.terminalnum,
            netid: _this.form.netid,
            modid: _this.form.modid,
            serialband: _this.form.serialband,
            serialdatabit: _this.form.serialdatabit,
            serialstop: _this.form.serialstop,
            rfband: _this.form.rfband,
            rfdatarate: _this.form.rfdatarate,
            rfpower: _this.form.rfpower,
            device: _this.form.device,
            gateway: _this.form.gateway
          })
            .then(response => {
              console.log(_this)
              _this.$router.push({ path: '/terminalindex' })
            })
            .catch(error => {
              let count = 1
              _this.errormsg = ''
              for (let i in error) {
                _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
                count++
              }
              _this.errordialogVisible = true
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getdevice () {
      var _this = this
      getDevice().then(response => {
        _this.devices = response.data.results
      })
    },
    getgateway () {
      let _this = this
      getGateway().then(response => {
        _this.gateways = response.data.results
      })
    },
    goback () {
      console.log(123)
    },
    getdetail () {
      let _this = this
      let id = _this.$route.query.id
      getTerminalDetail(id).then(response => {
        _this.form.terminaltype = response.data.terminaltype
        _this.form.terminalnum = response.data.terminalnum
        _this.form.netid = response.data.netid
        _this.form.modid = response.data.modid
        _this.form.serialband = response.data.serialband
        _this.form.serialdatabit = response.data.serialdatabit
        _this.form.serialstop = response.data.serialstop
        _this.form.rfband = response.data.rfband
        _this.form.rfdatarate = response.data.rfdatarate
        _this.form.rfchannel = response.data.rfchannel
        _this.form.rfpower = response.data.rfpower
        _this.form.device = response.data.device
        _this.form.gateway = response.data.gateway
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
