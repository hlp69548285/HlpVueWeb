<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-form :model="form" ref="form">
      <el-form-item label="时间范围:" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="区域:" prop="area">
        <el-select v-model="form.area" placeholder="请选择区域" @change="devicechange">
          <el-option label="所有区域" value></el-option>
          <el-option :label="item.areaname" :value="item.id" v-for="item in areas" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备:" prop="device">
        <el-select v-model="form.device" placeholder="请选择设备" @change="terminalchange">
          <el-option label="所有设备" value></el-option>
          <el-option
            :label="item.devicename"
            :value="item.id"
            v-for="item in devices"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择模块:" prop="device" style="width:300px !important">
        <el-select v-model="form.terminalselect" @change="selectchange" placeholder="请选择模块">
          <el-option label="所有模块" value></el-option>
          <el-option
            :label="item.terminaltypes + item.terminalnum"
            :value="item.id"
            v-for="item in terminals"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="采集类型:" prop="region">
        <el-radio-group v-model="form.datatype">
          <el-radio label="all">全部</el-radio>
          <el-radio label="ele">电</el-radio>
          <el-radio label="temperture">温度</el-radio>
          <el-radio label="light">光照</el-radio>
          <el-radio label="vibration">震动</el-radio>
          <el-radio label="gas" :disabled="true">气体</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="统计方式:" prop="region">
        <el-radio-group v-model="form.type">
          <el-radio label="1" :disabled="hourdisable">小时</el-radio>
          <el-radio label="2" :disabled="daydisable">天</el-radio>
          <el-radio label="3" :disabled="alldisable">所有数据(仅结束时间一天内)</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-dialog title="提示" :visible.sync="timeDialogVisible" width="30%">
        <span>必须选择时间</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="timeDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-form-item>
        <el-button type="primary"
        @click="submitForm('form')"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="正在加载数据">查看数据</el-button>
      </el-form-item>
    </el-form>
    <!-- 图表 -->
    <div id="mychart">
    </div>
    <el-card class="box-card" v-show="chartdisplay">
        <div>暂无数据</div>
    </el-card>
    <el-dialog title="提示" :visible.sync="nodatadialogVisible" width="30%">
      <span>选择时间段没有数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nodatadialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-form-item__label {
  color: firebrick;
}
.el-form-item {
  display: inline-block;
}
</style>
<script>
import echarts from 'echarts'
import {
  getArea,
  getDevice,
  getEleTerminalData,
  getTerminal,
  getLightDataDetail,
  getVibrationDataDetail,
  getTempertureDetail
} from '../../api/api.js'
function getdoublenum (value) {
  return value < 10 ? '0' + value : value
}
export default {
  name: 'Data',
  data () {
    return {
      eleChart: {},
      eleOption: {},
      vibrtionChart: {},
      vibrtionOption: {},
      tempertureChart: {},
      tempertureOption: {},
      ligthChart: {},
      lightOption: {},
      errormsg: '',
      errordialogVisible: false,
      form: {
        starttime: '',
        endtime: '',
        time: '',
        area: '',
        device: '',
        terminalselect: '',
        terminal: 'false',
        type: '3',
        datatype: 'all'
      },
      eleshow: true,
      vibrationshow: true,
      temptureshow: true,
      lightshow: true,
      hourdisable: false,
      daydisable: false,
      alldisable: false,
      terminaltype: '',
      nodatadialogVisible: false,
      timeDialogVisible: false,
      areas: [],
      devices: [],
      terminals: [],
      fullscreenLoading: false,
      count: 0,
      chartdisplay: false
    }
  },
  mounted () {
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
  methods: {
    change () {
      this.eleOption.title.text = 'xxx'
      this.eleChart.setOption(this.eleOption)
    },
    initChart (id, data) {
      this.chartdisplay = false
      let mychartdiv = document.getElementById('mychart')
      let newchart = document.createElement('div')
      newchart.id = id
      newchart.style.cssText = 'width: 100%;height:500px;display: inline-block'
      let Chart = echarts.init(newchart)
      data['chartdata']['yAxis']['max'] = function (value) {
        if (value.max < 5) {
          return 5
        }
        return parseInt(value.max - value.max % 10 + 10)
      }
      Chart.setOption(data['chartdata'])
      mychartdiv.appendChild(newchart)
      Chart.resize()
    },
    getarea () {
      var _this = this
      getArea().then(response => {
        _this.areas = response.data.results
      })
    },
    getdevice (params) {
      var _this = this
      getDevice(params)
        .then(response => {
          _this.devices = response.data.results
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
    },
    getterminal (params) {
      var _this = this
      getTerminal(params)
        .then(response => {
          _this.terminals = response.data.results
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
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      return null
    },
    submitForm (formName) {
      let _this = this
      let valid = true
      console.log('123')
      if (_this.form.starttime === '') {
        _this.timeDialogVisible = true
        valid = false
        return
      }
      if (valid) {
        _this.fullscreenLoading = true
        let mychartdiv = document.getElementById('mychart')
        mychartdiv.innerHTML = ''
        _this.chartdisplay = true
        if (_this.form.datatype === 'ele') {
          _this.count = 1
          this.getelechart()
        } else if (_this.form.datatype === 'light') {
          _this.count = 1
          this.getligthchart()
        } else if (_this.form.datatype === 'vibration') {
          _this.count = 1
          this.getvibrationchart()
        } else if (_this.form.datatype === 'temperture') {
          _this.count = 1
          this.gettemperturechart()
        } else if (_this.form.datatype === 'all') {
          _this.count = 4
          this.getelechart()
          this.getligthchart()
          this.getvibrationchart()
          this.gettemperturechart()
        }
      } else {
        console.log('error submit!!')
        return false
      }
    },
    getelechart: function () {
      let _this = this
      getEleTerminalData({
        starttime: _this.form.starttime,
        endtime: _this.form.endtime,
        device: _this.form.device,
        area: _this.form.area,
        terminalselect: _this.form.terminalselect,
        datatype: _this.form.datatype,
        type: _this.form.type
      })
        .then(response => {
          for (var index in response.data) {
            _this.initChart(index.toString(), response.data[index])
          }
          _this.count -= 1
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
    },
    getligthchart: function () {
      let _this = this
      getLightDataDetail({
        starttime: _this.form.starttime,
        endtime: _this.form.endtime,
        device: _this.form.device,
        area: _this.form.area,
        terminalselect: _this.form.terminalselect,
        datatype: _this.form.datatype,
        type: _this.form.type
      })
        .then(response => {
          for (var index in response.data) {
            _this.initChart(index.toString(), response.data[index])
          }
          _this.count -= 1
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
    },
    gettemperturechart: function () {
      let _this = this
      getTempertureDetail({
        starttime: _this.form.starttime,
        endtime: _this.form.endtime,
        device: _this.form.device,
        area: _this.form.area,
        terminalselect: _this.form.terminalselect,
        datatype: _this.form.datatype,
        type: _this.form.type
      })
        .then(response => {
          for (var index in response.data) {
            _this.initChart(index.toString(), response.data[index])
          }
          _this.count -= 1
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
    },
    getvibrationchart: function () {
      let _this = this
      getVibrationDataDetail({
        starttime: _this.form.starttime,
        endtime: _this.form.endtime,
        device: _this.form.device,
        area: _this.form.area,
        terminalselect: _this.form.terminalselect,
        datatype: _this.form.datatype,
        type: _this.form.type
      })
        .then(response => {
          for (var index in response.data) {
            _this.initChart(index.toString(), response.data[index])
          }
          _this.count -= 1
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
    },
    devicechange (value) {
      this.getdevice({ area: value, limit: 1000 })
    },
    terminalchange (value) {
      this.getterminal({ device: value, limit: 1000 })
    },
    selectchange (value) {
      let len = this.terminals.length
      let count = 0
      while (count < len) {
        if (this.terminals[count]['id'] === value) {
          this.form.datatype = this.terminals[count]['terminaltype']
          break
        }
        count++
      }
    }
  },
  computed: {
    // terminalshow: function () {
    //   if (this.form.terminal === 'false') {
    //     return false
    //   } else {
    //     return true
    //   }
    // }
  },
  watch: {
    'form.time': function (oldvalue, newvalue) {
      let starttime = new Date(this.form.time[0])
      let endtime = new Date(this.form.time[1])
      console.log(this.form.time, this.form.starttime, this.form.endtime)
      this.form.starttime =
        starttime.getFullYear() +
        '-' +
        getdoublenum(starttime.getMonth() + 1) +
        '-' +
        getdoublenum(starttime.getDate()) +
        ' ' +
        getdoublenum(starttime.getHours()) +
        ':' +
        getdoublenum(starttime.getMinutes()) +
        ':' +
        getdoublenum(starttime.getSeconds())
      this.form.endtime =
        endtime.getFullYear() +
        '-' +
        getdoublenum(endtime.getMonth() + 1) +
        '-' +
        getdoublenum(endtime.getDate()) +
        ' ' +
        getdoublenum(endtime.getHours()) +
        ':' +
        getdoublenum(endtime.getMinutes()) +
        ':' +
        getdoublenum(endtime.getSeconds())
      console.log(this.form.time, this.form.starttime, this.form.endtime)
    },
    'form.datatype': function (newvalue, oldvalue) {
      console.log(newvalue)
      if (newvalue === 'vibration') {
        this.hourdisable = true
        this.daydisable = true
        this.alldisable = false
        this.form.type = '3'
      } else if (newvalue === 'light') {
        this.hourdisable = true
        this.daydisable = true
        this.alldisable = false
        this.form.type = '3'
      } else if (newvalue === 'ele') {
        this.hourdisable = false
        this.daydisable = false
        this.alldisable = false
        this.form.type = '1'
      } else if (newvalue === 'tempture') {
        this.hourdisable = true
        this.daydisable = true
        this.alldisable = false
        this.form.type = '3'
      } else if (newvalue === 'all') {
        this.hourdisable = true
        this.daydisable = true
        this.alldisable = false
        this.form.type = '3'
      }
    },
    'count': function (newvalue, oldvalue) {
      if (newvalue === 0) {
        this.fullscreenLoading = false
      }
    }
  },
  created () {
    this.getarea()
  }
}
</script>
