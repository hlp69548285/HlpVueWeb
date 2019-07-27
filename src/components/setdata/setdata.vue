<template>
  <div id="content">
    <el-tabs type="border-card">
      <el-tab-pane label="通用设置">
        <el-form :model="form">
          <el-form-item label="选择网关:" prop="device" style="display: inline-block">
            <el-select v-model="form.gateway" @change="selectchange" placeholder="请选择网关">
              <el-option
                :label="item.gatename"
                :value="item.id"
                v-for="item in gateways"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模块:" prop="device" style="display: inline-block">
            <el-select v-model="form.terminal" placeholder="请选择模块">
              <el-option
                :label="item.terminaltypes + '-' + item.terminalnum"
                :value="item.id"
                v-for="item in terminals"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="display: inline-block" label="指令：">
            <el-input
              v-model="form.setmessage"
              placeholder="请输入内容"
              style="display: inline-block;width: 300px"
            ></el-input>
          </el-form-item>
          <el-button @click="setdata" class="pull-right">设置</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="阈值设置">
        <el-form :model="thresholdform">
          <el-form-item label="选择网关:" prop="device" style="display: inline-block">
            <el-select
              v-model="thresholdform.gateway"
              @change="selectchangethreshold"
              placeholder="请选择网关"
            >
              <el-option
                :label="item.gatename"
                :value="item.id"
                v-for="item in gatewaysthreshold"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模块:" prop="device" style="display: inline-block">
            <el-select v-model="thresholdform.terminal" placeholder="请选择模块" @change="getthreshold">
              <el-option
                :label="item.terminaltypes + '-' + item.terminalnum"
                :value="item.id"
                v-for="item in terminalsthreshold"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="display: inline-block" label="阈值名称：">
            <el-input
              v-model="thresholdform.thresholdname"
              placeholder="请输入内容"
              style="display: inline-block;width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item style="display: inline-block" label="阈值：">
            <el-input
              v-model="thresholdform.setmessage"
              placeholder="请输入内容"
              style="display: inline-block;width: 300px"
            ></el-input>
          </el-form-item>
          <el-button @click="setthreshold(1)" class="pull-right">修改</el-button>
          <el-button @click="setthreshold(0)" class="pull-right">新增</el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%" border empty-text="暂无数据">
          <el-table-column prop="devicename" label="设备名称"></el-table-column>
          <el-table-column prop="terminalname" label="终端名称"></el-table-column>
          <el-table-column prop="terminaltype" label="终端类型"></el-table-column>
          <el-table-column prop="thresholdname" label="阈值名称"></el-table-column>
          <el-table-column prop="threshold" label="阈值"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="其他快捷设置">
        <el-form  :model="simpleform">
          <el-form-item label="操作类别：" style="display: inline-block">
            <el-select v-model="simpleform.quickclass">
              <el-option label="设备" value="0"></el-option>
              <el-option label="终端" value="1"></el-option>
              <el-option label="网关" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指令名称：" style="display: inline-block">
            <el-input v-model="simpleform.quickname" style="display: inline-block;width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="快捷指令：" style="display: inline-block">
            <el-input v-model="simpleform.setmessage" style="display: inline-block;width: 300px"></el-input>
          </el-form-item>
          <el-button @click="addquickset" class="pull-right">新增</el-button>
        </el-form>
        <el-divider content-position="left">点击下方按钮快速设置</el-divider>
        <el-form :model="simpleform">
          <el-form-item label="选择网关:" prop="device" style="display: inline-block">
            <el-select
              v-model="simpleform.gateway"
              @change="selectchangesimple"
              placeholder="请选择网关"
            >
              <el-option
                :label="item.gatename"
                :value="item.id"
                v-for="item in gatewayssimple"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模块:" prop="device" style="display: inline-block">
            <el-select v-model="simpleform.terminal" placeholder="请选择模块">
              <el-option
                :label="item.terminaltypes + '-' + item.terminalnum"
                :value="item.id"
                v-for="item in terminalssimple"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <br />
        <div class="mdui-container-fluid">
          <div class="mdui-col-xs-12 mdui-col-md-4">
          <button class="mdui-btn mdui-btn-block mdui-color-blue-200 mdui-ripple">设备</button>
          <br>
          <el-popover placement="bottom-start" width="200" trigger="hover" v-for="item in devicequicksetitems" :key="item.id" >
            <p>{{item.quicksetcontent}}</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="delquickset(item.id)">删除</el-button>
            </div>
            <el-button slot="reference" type="primary" @click="sendmessage(item.quicksetcontent)">{{item.quicksetname}}</el-button>
          </el-popover>
          </div>
          <div class="mdui-col-xs-12 mdui-col-md-4">
            <button class="mdui-btn mdui-btn-block mdui-color-amber-200 mdui-ripple">网关</button>
            <br>
          <el-popover placement="bottom-start" width="200" trigger="hover" v-for="item in gatewayquicksetitems" :key="item.id" >
            <p>{{item.quicksetcontent}}</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="delquickset(item.id)">删除</el-button>
            </div>
            <el-button slot="reference" type="warning" @click="sendmessage(item.quicksetcontent)">{{item.quicksetname}}</el-button>
          </el-popover>
        </div>
        <div class="mdui-col-xs-12 mdui-col-md-4">
          <button class="mdui-btn mdui-btn-block mdui-color-green-200 mdui-ripple">终端</button>
          <br>
          <el-popover placement="bottom-start" width="200" trigger="hover" v-for="item in terminalquicksetitems" :key="item.id" >
            <p>{{item.quicksetcontent}}</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="delquickset(item.id)">删除</el-button>
            </div>
            <el-button slot="reference" type="success" @click="sendmessage(item.quicksetcontent)">{{item.quicksetname}}</el-button>
          </el-popover>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
</style>
<script>
import {getTerminal, getGateway, setData, cookie, getThreshold, setThreshold, addQuickSet, getQuickSet, delQuickSet} from '../../api/api'
export default {
  name: 'SetData',
  data () {
    return {
      form: {
        terminal: '',
        gateway: '',
        setmessage: ''
      },
      thresholdform: {
        terminal: '',
        gateway: '',
        setmessage: '',
        thresholdname: ''
      },
      simpleform: {
        terminal: '',
        gateway: '',
        quickclass: '',
        quickname: '',
        setmessage: ''
      },
      terminals: [],
      gateways: [],
      terminalssimple: [],
      gatewayssimple: [],
      terminalsthreshold: [],
      gatewaysthreshold: [],
      tableData: [],
      devicequicksetitems: [],
      gatewayquicksetitems: [],
      terminalquicksetitems: []

    }
  },
  mounted () {
    this.getgateway()
    this.getquickset()
  },
  methods: {
    setdata: function () {
      let _this = this
      setData({
        'X-CSRFToken': cookie.getCookie('csrftoken'),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }, {
        'gateway': _this.form.gateway,
        'terminal': _this.form.terminal,
        'message': _this.form.setmessage
      }).then((response) => {
        alert('数据发送成功，等待轮询生效')
      }).catch((error) => {
        alert('设置失败', error)
      })
    },
    sendmessage: function (value) {
      let _this = this
      if (_this.simpleform.gateway === '') {
        alert('请选择网关')
        return
      }
      if (_this.simpleform.terminal === '') {
        alert('请选择终端')
        return
      }
      setData({
        'X-CSRFToken': cookie.getCookie('csrftoken'),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }, {
        'gateway': _this.simpleform.gateway,
        'terminal': _this.simpleform.terminal,
        'message': value
      }).then((response) => {
        alert('数据发送成功，等待轮询生效')
      }).catch((error) => {
        alert('设置失败', error)
      })
    },
    setthreshold: function (isalert) {
      let _this = this
      setThreshold({
        'X-CSRFToken': cookie.getCookie('csrftoken'),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }, {
        'gateway': _this.thresholdform.gateway,
        'terminal': _this.thresholdform.terminal,
        'message': _this.thresholdform.setmessage,
        'thresholdname': _this.thresholdform.thresholdname,
        'isalert': isalert
      }).then((response) => {
        console.log(response)
        alert('数据发送成功，等待轮询生效')
      }).catch((error) => {
        alert('设置失败', error)
      })
    },
    getthreshold () {
      let _this = this
      getThreshold({
        'terminal': this.thresholdform.terminal
      }).then((response) => {
        _this.tableData = response.data.results
      }).catch((error) => {
        console.log(error)
      })
    },
    getgateway () {
      let _this = this
      getGateway({
        'limit': 10000
      }).then((response) => {
        _this.gateways = response.data.results
        _this.gatewayssimple = response.data.results
        _this.gatewaysthreshold = response.data.results
      }).catch((error) => {
        console.log(error)
      })
    },
    selectchange () {
      let _this = this
      getTerminal({
        'limit': 1000,
        'gateway': _this.form.gateway
      }).then((response) => {
        _this.terminals = response.data.results
        _this.form.terminal = ''
      }).catch((error) => {
        console.log(error)
      })
    },
    selectchangesimple () {
      let _this = this
      getTerminal({
        'limit': 1000,
        'gateway': _this.simpleform.gateway
      }).then((response) => {
        _this.terminalssimple = response.data.results
        _this.simpleform.terminal = ''
      }).catch((error) => {
        console.log(error)
      })
    },
    selectchangethreshold () {
      let _this = this
      getTerminal({
        'limit': 1000,
        'gateway': _this.thresholdform.gateway
      }).then((response) => {
        _this.terminalsthreshold = response.data.results
        _this.thresholdform.terminal = ''
      }).catch((error) => {
        console.log(error)
      })
    },
    addquickset () {
      let _this = this
      if (this.simpleform.quickname === '') {
        alert('请输入指令名称')
        return
      }
      if (this.simpleform.quickclass === '') {
        alert('请选择指令类型')
        return
      }
      if (this.simpleform.setmessage === '') {
        alert('请输入指令')
        return
      }
      addQuickSet({
        'quicksetname': _this.simpleform.quickname,
        'quicksetclass': _this.simpleform.quickclass,
        'quicksetcontent': _this.simpleform.setmessage
      }).then((response) => {
        _this.getquickset()
      })
    },
    delquickset (id) {
      let _this = this
      delQuickSet(id).then((response) => {
        _this.getquickset()
      })
    },
    getquickset () {
      getQuickSet({
        'quicksetclass': 0
      }).then((response) => {
        console.log(response)
        this.devicequicksetitems = response.data
      })
      getQuickSet({
        'quicksetclass': 1
      }).then((response) => {
        console.log(response)
        this.terminalquicksetitems = response.data
      })
      getQuickSet({
        'quicksetclass': 2
      }).then((response) => {
        console.log(response)
        this.gatewayquicksetitems = response.data
      })
    }
  }
}
</script>
